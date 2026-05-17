import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useFocusEffect } from "@react-navigation/native";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { PICKUP_OFFICE } from "@/constants/locations";
import { theme } from "@/constants/theme";
import { lostFoundService } from "@/services/lostFoundService";
import type { Claim, FoundItem } from "@/types/models";

export default function PickupScreen() {
  const { claimId } = useLocalSearchParams<{ claimId: string }>();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [item, setItem] = useState<FoundItem | null>(null);

  const load = useCallback(async () => {
    if (!claimId) return;
    const c = await lostFoundService.getClaim(claimId);
    setClaim(c ?? null);
    if (c) {
      const f = await lostFoundService.getFoundItem(c.foundId);
      setItem(f ?? null);
    }
  }, [claimId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!claim) {
    return (
      <Screen title="Pick up item">
        <Text style={styles.muted}>Loading…</Text>
      </Screen>
    );
  }

  return (
    <Screen title="Pick it up — your item is waiting" subtitle={item?.title}>
      <View style={styles.qrWrap}>
        <QRCode
          value={claim.qrPayload}
          size={200}
          color={theme.ink}
          backgroundColor={theme.white}
        />
        <Text style={styles.qrLabel}>{claim.qrPayload}</Text>
      </View>

      <Text style={styles.section}>Pickup at</Text>
      <Text style={styles.office}>{PICKUP_OFFICE.name}</Text>
      <Text style={styles.meta}>{PICKUP_OFFICE.address}</Text>
      <Text style={styles.meta}>{PICKUP_OFFICE.hours}</Text>

      <Text style={styles.section}>Bring with you</Text>
      <Text style={styles.check}>• Photo ID</Text>
      <Text style={styles.check}>• QR code (this screen)</Text>
      <Text style={styles.check}>• Proof of ownership</Text>

      <View style={styles.actions}>
        <PrimaryButton
          label="Directions"
          onPress={() => void Linking.openURL(PICKUP_OFFICE.mapsUrl)}
        />
        <PrimaryButton
          label="Mark as collected (demo)"
          variant="secondary"
          onPress={() => void lostFoundService.completeClaim(claim.id)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  qrWrap: {
    alignItems: "center",
    backgroundColor: theme.white,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    ...theme.cardShadow,
  },
  qrLabel: { marginTop: 12, fontSize: 12, color: theme.muted },
  section: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "serif",
    color: theme.ink,
  },
  office: { fontSize: 17, fontWeight: "600", color: theme.ink },
  meta: { color: theme.muted, marginBottom: 4 },
  check: { color: theme.ink, marginBottom: 6 },
  actions: { marginTop: 24, gap: 10 },
  muted: { color: theme.muted },
});
