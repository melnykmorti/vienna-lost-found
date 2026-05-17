import seedFound from "@/data/seed/foundItems.json";
import seedLost from "@/data/seed/demoLostReport.json";
import { registerCachedPlace } from "@/services/geocoding";
import { storage } from "@/services/storage";
import type { FoundItem, LostReport } from "@/types/models";

export async function initApp(force = false): Promise<void> {
  if (!force && (await storage.isInitialized())) {
    return;
  }

  const foundItems = seedFound as FoundItem[];
  const reports: LostReport[] = [seedLost as LostReport];

  for (const item of foundItems) {
    registerCachedPlace({
      label: item.locationLabel,
      coordinates: item.coordinates,
    });
  }
  if (reports[0]?.coordinates) {
    registerCachedPlace({
      label: reports[0].locationLabel,
      coordinates: reports[0].coordinates,
    });
  }

  await storage.setFoundItems(foundItems);
  await storage.setReports(reports);
  await storage.setClaims([]);
  await storage.setInitialized();
}

export async function resetDemoData(): Promise<void> {
  await storage.clearAll();
  await initApp(true);
}
