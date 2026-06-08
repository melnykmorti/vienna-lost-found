import { theme } from "@/constants/theme";

export type ScoreTier = "strong" | "possible" | "weak";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 70) return "strong";
  if (score >= 40) return "possible";
  return "weak";
}

export function getScoreColor(tier: ScoreTier): string {
  if (tier === "strong") return theme.success;
  if (tier === "possible") return theme.warning;
  return theme.muted;
}

export function getScoreLabel(tier: ScoreTier): string {
  if (tier === "strong") {
    return "Strong match — same category, place, and description overlap";
  }
  if (tier === "possible") {
    return "Possible match — review details below";
  }
  return "Weak match — compare carefully";
}
