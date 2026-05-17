import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppData, Claim, FoundItem, LostReport } from "@/types/models";

const KEYS = {
  foundItems: "@vlf/foundItems",
  reports: "@vlf/reports",
  claims: "@vlf/claims",
  initialized: "@vlf/initialized",
} as const;

const memory = new Map<string, string>();
let preferMemory = false;

async function getItem(key: string): Promise<string | null> {
  if (preferMemory) return memory.get(key) ?? null;
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    preferMemory = true;
    console.warn(
      "[storage] AsyncStorage unavailable — using in-memory demo store",
    );
    return memory.get(key) ?? null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  if (preferMemory) {
    memory.set(key, value);
    return;
  }
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    preferMemory = true;
    memory.set(key, value);
  }
}

async function removeItem(key: string): Promise<void> {
  memory.delete(key);
  if (!preferMemory) {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      preferMemory = true;
    }
  }
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await setItem(key, JSON.stringify(value));
}

export const storage = {
  usesMemoryFallback: () => preferMemory,

  async getFoundItems(): Promise<FoundItem[]> {
    return readJson(KEYS.foundItems, []);
  },
  async setFoundItems(items: FoundItem[]): Promise<void> {
    await writeJson(KEYS.foundItems, items);
  },
  async getReports(): Promise<LostReport[]> {
    return readJson(KEYS.reports, []);
  },
  async setReports(reports: LostReport[]): Promise<void> {
    await writeJson(KEYS.reports, reports);
  },
  async getClaims(): Promise<Claim[]> {
    return readJson(KEYS.claims, []);
  },
  async setClaims(claims: Claim[]): Promise<void> {
    await writeJson(KEYS.claims, claims);
  },
  async isInitialized(): Promise<boolean> {
    return (await getItem(KEYS.initialized)) === "true";
  },
  async setInitialized(): Promise<void> {
    await setItem(KEYS.initialized, "true");
  },
  async loadAll(): Promise<AppData> {
    const [foundItems, reports, claims, initialized] = await Promise.all([
      this.getFoundItems(),
      this.getReports(),
      this.getClaims(),
      this.isInitialized(),
    ]);
    return { foundItems, reports, claims, initialized };
  },
  async clearAll(): Promise<void> {
    await Promise.all(Object.values(KEYS).map((k) => removeItem(k)));
  },
};
