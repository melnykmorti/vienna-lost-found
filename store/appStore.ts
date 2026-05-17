import { create } from "zustand";

import { initApp, resetDemoData } from "@/services/initApp";
import { lostFoundService } from "@/services/lostFoundService";
import type { AppData } from "@/types/models";

interface AppStore extends AppData {
  ready: boolean;
  loading: boolean;
  hydrate: () => Promise<void>;
  refresh: () => Promise<void>;
  resetDemo: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  foundItems: [],
  reports: [],
  claims: [],
  initialized: false,
  ready: false,
  loading: true,

  hydrate: async () => {
    set({ loading: true });
    await initApp();
    const data = await lostFoundService.loadAll();
    set({ ...data, ready: true, loading: false });
  },

  refresh: async () => {
    const data = await lostFoundService.loadAll();
    set({ ...data });
  },

  resetDemo: async () => {
    set({ loading: true });
    await resetDemoData();
    const data = await lostFoundService.loadAll();
    set({ ...data, loading: false });
  },
}));
