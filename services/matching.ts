import { DEMO_USER } from "@/constants/locations";
import type {
  FoundItem,
  LostReport,
  MatchReason,
  MatchResult,
} from "@/types/models";

function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
}

function descriptionOverlap(lost: string, found: string): number {
  const a = tokenize(lost);
  const b = tokenize(found);
  let overlap = 0;
  for (const w of a) {
    if (b.has(w)) overlap += 1;
  }
  return Math.min(20, overlap * 5);
}

export function computeMatch(report: LostReport, item: FoundItem): MatchResult {
  const reasons: MatchReason[] = [];
  let score = 0;

  if (report.category === item.category) {
    score += 25;
    reasons.push({ label: "Same category", points: 25 });
  }

  const reportPoint = report.coordinates ?? DEMO_USER;
  const sameLabel =
    report.locationLabel.toLowerCase() === item.locationLabel.toLowerCase();
  const distM = haversineMeters(reportPoint, item.coordinates);

  if (sameLabel || distM < 500) {
    score += 20;
    reasons.push({
      label: sameLabel
        ? "Same area"
        : `Within ${Math.round(distM)} m of loss location`,
      points: 20,
    });
  }

  const lostTime = new Date(report.lostAt).getTime();
  const foundTime = new Date(item.foundAt).getTime();
  const diffHours = Math.abs(foundTime - lostTime) / (1000 * 60 * 60);
  if (diffHours <= 2) {
    score += 25;
    reasons.push({
      label: `Within ${Math.round(diffHours * 60)} min of loss`,
      points: 25,
    });
  } else if (diffHours <= 24) {
    score += 10;
    reasons.push({ label: "Same day", points: 10 });
  }

  const overlap = descriptionOverlap(report.description, item.description);
  if (overlap > 0) {
    score += overlap;
    reasons.push({ label: "Partial description overlap", points: overlap });
  }

  score = Math.min(100, score);

  return { foundId: item.id, score, reasons };
}

export function rankMatches(
  report: LostReport,
  items: FoundItem[],
  options?: { includeWeak?: boolean },
): { top: MatchResult[]; weakerCount: number; all: MatchResult[] } {
  const all = items
    .map((item) => computeMatch(report, item))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = all.slice(0, options?.includeWeak ? all.length : 3);
  const weakerCount = Math.max(0, all.length - 3);

  return { top, weakerCount, all };
}

export function distanceFromDemoM(item: FoundItem): number {
  return Math.round(haversineMeters(DEMO_USER, item.coordinates));
}

export function formatDistance(m: number): string {
  if (m < 1000) return `${m}m`;
  return `${(m / 1000).toFixed(1)}km`;
}
