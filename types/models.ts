export type ItemCategory =
  | "wallet"
  | "keys"
  | "phone"
  | "bag"
  | "glasses"
  | "umbrella"
  | "clothing"
  | "other";

export type LostReportStatus =
  | "searching"
  | "matched"
  | "at_depot"
  | "claimed"
  | "returned";

export type HandoffType = "depot" | "staff";

export type ClaimStatus = "pending" | "verified" | "ready_pickup" | "completed";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FoundItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  locationLabel: string;
  coordinates: Coordinates;
  foundAt: string;
  aiTags: string[];
  handoff: HandoffType;
  photoUri?: string | null;
}

export interface LostReport {
  id: string;
  title: string;
  category: ItemCategory;
  description: string;
  locationLabel: string;
  coordinates?: Coordinates;
  lostAt: string;
  photoUri?: string | null;
  notifyOnMatch: boolean;
  status: LostReportStatus;
  createdAt: string;
}

export interface MatchReason {
  label: string;
  points: number;
}

export interface MatchResult {
  foundId: string;
  score: number;
  reasons: MatchReason[];
}

export interface ClaimStep {
  id: string;
  label: string;
  status: "done" | "current" | "waiting";
  timestamp?: string;
}

export interface Claim {
  id: string;
  lostReportId: string;
  foundId: string;
  secretDetail: string;
  status: ClaimStatus;
  steps: ClaimStep[];
  qrPayload: string;
  safeReply?: string;
  createdAt: string;
}

export interface AppData {
  foundItems: FoundItem[];
  reports: LostReport[];
  claims: Claim[];
  initialized: boolean;
}

export interface CreateLostReportInput {
  category: ItemCategory;
  description: string;
  locationLabel: string;
  coordinates: Coordinates;
  lostAt: string;
  photoUri?: string | null;
  notifyOnMatch: boolean;
}

export interface CreateFoundItemInput {
  category: ItemCategory;
  description: string;
  locationLabel: string;
  coordinates: Coordinates;
  foundAt: string;
  photoUri?: string | null;
  handoff: HandoffType;
  aiTags: string[];
}
