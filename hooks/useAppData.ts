import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useAppStore } from "@/store/appStore";

export function useAppData() {
  const store = useAppStore();

  useFocusEffect(
    useCallback(() => {
      void store.refresh();
    }, [store.refresh]),
  );

  return store;
}
