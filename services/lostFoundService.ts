import { categoryLabel } from "@/constants/categories";
import { rankMatches } from "@/services/matching";
import { storage } from "@/services/storage";
import type {
  Claim,
  ClaimStatus,
  CreateFoundItemInput,
  CreateLostReportInput,
  FoundItem,
  LostReport,
  MatchResult,
} from "@/types/models";

function id(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function defaultClaimSteps(): Claim["steps"] {
  return [
    { id: "request", label: "Request sent", status: "done" },
    { id: "verify", label: "Verify details", status: "current" },
    { id: "pickup", label: "Pick-up info", status: "waiting" },
    { id: "returned", label: "Item returned", status: "waiting" },
  ];
}

export const lostFoundService = {
  async loadAll() {
    return storage.loadAll();
  },

  async getFoundItems(): Promise<FoundItem[]> {
    return storage.getFoundItems();
  },

  async getReports(): Promise<LostReport[]> {
    return storage.getReports();
  },

  async getReport(reportId: string): Promise<LostReport | undefined> {
    const reports = await storage.getReports();
    return reports.find((r) => r.id === reportId);
  },

  async getFoundItem(foundId: string): Promise<FoundItem | undefined> {
    const items = await storage.getFoundItems();
    return items.find((i) => i.id === foundId);
  },

  async createLostReport(input: CreateLostReportInput): Promise<LostReport> {
    const report: LostReport = {
      id: id("lost"),
      title: `${categoryLabel(input.category)} — ${input.locationLabel}`,
      category: input.category,
      description: input.description,
      locationLabel: input.locationLabel,
      coordinates: input.coordinates,
      lostAt: input.lostAt,
      photoUri: input.photoUri,
      notifyOnMatch: input.notifyOnMatch,
      status: "searching",
      createdAt: new Date().toISOString(),
    };
    const reports = await storage.getReports();
    reports.unshift(report);
    await storage.setReports(reports);
    return report;
  },

  async createFoundItem(input: CreateFoundItemInput): Promise<FoundItem> {
    const item: FoundItem = {
      id: id("found"),
      title: `${categoryLabel(input.category)} — ${input.locationLabel}`,
      description: input.description,
      category: input.category,
      locationLabel: input.locationLabel,
      coordinates: input.coordinates,
      foundAt: input.foundAt,
      aiTags: input.aiTags,
      handoff: input.handoff,
      photoUri: input.photoUri,
    };
    const items = await storage.getFoundItems();
    items.unshift(item);
    await storage.setFoundItems(items);
    return item;
  },

  async getMatches(
    reportId: string,
    includeWeak = false,
  ): Promise<{
    report: LostReport;
    top: MatchResult[];
    weakerCount: number;
  } | null> {
    const report = await this.getReport(reportId);
    if (!report) return null;
    const items = await storage.getFoundItems();
    const { top, weakerCount } = rankMatches(report, items, { includeWeak });
    return { report, top, weakerCount };
  },

  async getMatchForReport(
    reportId: string,
    foundId: string,
  ): Promise<MatchResult | null> {
    const report = await this.getReport(reportId);
    if (!report) return null;
    const items = await storage.getFoundItems();
    const { all } = rankMatches(report, items, { includeWeak: true });
    return all.find((m) => m.foundId === foundId) ?? null;
  },

  async updateReportStatus(
    reportId: string,
    status: LostReport["status"],
  ): Promise<void> {
    const reports = await storage.getReports();
    const idx = reports.findIndex((r) => r.id === reportId);
    if (idx < 0) return;
    reports[idx] = { ...reports[idx], status };
    await storage.setReports(reports);
  },

  async createClaim(
    lostReportId: string,
    foundId: string,
    secretDetail: string,
  ): Promise<Claim> {
    const claim: Claim = {
      id: id("claim"),
      lostReportId,
      foundId,
      secretDetail,
      status: "pending",
      steps: defaultClaimSteps(),
      qrPayload: "",
      createdAt: new Date().toISOString(),
    };
    claim.qrPayload = `VLF-${claim.id}`;

    const claims = await storage.getClaims();
    claims.unshift(claim);
    await storage.setClaims(claims);

    await this.updateReportStatus(lostReportId, "matched");

    setTimeout(() => {
      void this.advanceClaimVerification(claim.id);
    }, 2000);

    return claim;
  },

  async getClaim(claimId: string): Promise<Claim | undefined> {
    const claims = await storage.getClaims();
    return claims.find((c) => c.id === claimId);
  },

  async getClaimForReport(reportId: string): Promise<Claim | undefined> {
    const claims = await storage.getClaims();
    return claims.find((c) => c.lostReportId === reportId);
  },

  async advanceClaimVerification(claimId: string): Promise<Claim | undefined> {
    const claims = await storage.getClaims();
    const idx = claims.findIndex((c) => c.id === claimId);
    if (idx < 0) return undefined;

    const now = new Date().toISOString();
    const updated: Claim = {
      ...claims[idx],
      status: "verified",
      steps: [
        {
          id: "request",
          label: "Request sent",
          status: "done",
          timestamp: claims[idx].createdAt,
        },
        {
          id: "verify",
          label: "Verify details",
          status: "done",
          timestamp: now,
        },
        { id: "pickup", label: "Pick-up info", status: "current" },
        { id: "returned", label: "Item returned", status: "waiting" },
      ],
    };
    claims[idx] = updated;
    await storage.setClaims(claims);
    await this.updateReportStatus(updated.lostReportId, "at_depot");
    return updated;
  },

  async setSafeReply(
    claimId: string,
    reply: string,
  ): Promise<Claim | undefined> {
    const claims = await storage.getClaims();
    const idx = claims.findIndex((c) => c.id === claimId);
    if (idx < 0) return undefined;
    const now = new Date().toISOString();
    claims[idx] = {
      ...claims[idx],
      safeReply: reply,
      status: "ready_pickup",
      steps: [
        {
          id: "request",
          label: "Request sent",
          status: "done",
          timestamp: claims[idx].createdAt,
        },
        {
          id: "verify",
          label: "Verify details",
          status: "done",
          timestamp: now,
        },
        { id: "pickup", label: "Pick-up info", status: "done", timestamp: now },
        { id: "returned", label: "Item returned", status: "current" },
      ],
    };
    await storage.setClaims(claims);
    await this.updateReportStatus(claims[idx].lostReportId, "claimed");
    return claims[idx];
  },

  async completeClaim(claimId: string): Promise<void> {
    const claims = await storage.getClaims();
    const idx = claims.findIndex((c) => c.id === claimId);
    if (idx < 0) return;
    claims[idx] = {
      ...claims[idx],
      status: "completed",
      steps: claims[idx].steps.map((s) => ({ ...s, status: "done" as const })),
    };
    await storage.setClaims(claims);
    await this.updateReportStatus(claims[idx].lostReportId, "returned");
  },

  async searchFoundItems(query: {
    text?: string;
    category?: string;
    last7Days?: boolean;
  }): Promise<FoundItem[]> {
    let items = await storage.getFoundItems();
    const now = Date.now();
    if (query.last7Days) {
      items = items.filter(
        (i) => now - new Date(i.foundAt).getTime() <= 7 * 24 * 60 * 60 * 1000,
      );
    }
    if (query.category && query.category !== "all") {
      items = items.filter((i) => i.category === query.category);
    }
    if (query.text?.trim()) {
      const q = query.text.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.locationLabel.toLowerCase().includes(q),
      );
    }
    return items;
  },
};
