import type { ItemCategory } from "@/types/models";

export const CATEGORIES: { id: ItemCategory; label: string }[] = [
  { id: "wallet", label: "Wallet" },
  { id: "keys", label: "Keys" },
  { id: "phone", label: "Phone" },
  { id: "bag", label: "Bag" },
  { id: "glasses", label: "Glasses" },
  { id: "umbrella", label: "Umbrella" },
  { id: "clothing", label: "Clothing" },
  { id: "other", label: "Other" },
];

export function categoryLabel(id: ItemCategory): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
