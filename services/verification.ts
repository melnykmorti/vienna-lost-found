import { tokenize } from "@/services/matching";
import type { VerifyResult } from "@/types/models";

const GENERIC_WORDS = new Set([
  "wallet",
  "black",
  "brown",
  "leather",
  "keys",
  "key",
  "phone",
  "item",
  "card",
  "bag",
  "the",
  "and",
  "with",
  "inside",
]);

export function evaluateSecretDetail(
  userInput: string,
  foundDescription: string,
): { result: VerifyResult; message: string } {
  const inputTokens = tokenize(userInput);
  const foundTokens = tokenize(foundDescription);

  if (inputTokens.size === 0) {
    return {
      result: "rejected",
      message:
        "Too general — try engraving, receipt, scratch, or a unique mark.",
    };
  }

  let hits = 0;
  for (const word of inputTokens) {
    if (foundTokens.has(word)) hits += 1;
  }

  const onlyGeneric = [...inputTokens].every((w) => GENERIC_WORDS.has(w));

  if (hits >= 2) {
    return {
      result: "accepted",
      message: "Detail accepted — verification in progress.",
    };
  }

  if (hits === 1 && !onlyGeneric) {
    return {
      result: "partial",
      message:
        "Accepted — detail is somewhat general; a more specific mark helps.",
    };
  }

  if (hits === 1 && onlyGeneric) {
    return {
      result: "partial",
      message:
        "Accepted — detail is somewhat general; a more specific mark helps.",
    };
  }

  return {
    result: "rejected",
    message: "Too general — try engraving, receipt, scratch, or a unique mark.",
  };
}
