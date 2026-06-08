import type { ItemCategory } from "@/types/models";

const CATEGORY_TAGS: Record<ItemCategory, string[]> = {
  wallet: ["wallet", "leather", "cards"],
  keys: ["keys", "keyring", "metal"],
  keychain: ["keychain", "charm", "keyring"],
  id_card: ["id", "card", "student"],
  phone: ["phone", "smartphone", "case"],
  bag: ["bag", "tote", "fabric"],
  glasses: ["glasses", "frames", "optical"],
  umbrella: ["umbrella", "folding", "handle"],
  clothing: ["clothing", "fabric", "wearable"],
  other: ["item", "personal", "found"],
};

const COLOR_WORDS = [
  "black",
  "brown",
  "silver",
  "red",
  "blue",
  "grey",
  "beige",
  "white",
];

export function detectAiTags(
  category: ItemCategory,
  description: string,
): string[] {
  const tags = new Set<string>(CATEGORY_TAGS[category]);
  const lower = description.toLowerCase();
  for (const color of COLOR_WORDS) {
    if (lower.includes(color)) tags.add(color);
  }
  if (lower.includes("automatic")) tags.add("automatic");
  if (lower.includes("leather")) tags.add("leather");
  if (lower.includes("brass")) tags.add("brass");
  return Array.from(tags).slice(0, 5);
}
