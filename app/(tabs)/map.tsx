import { StyleSheet, View } from "react-native";

import { OsmMapView } from "@/components/map/OsmMapView";
import { theme } from "@/constants/theme";
import { useAppData } from "@/hooks/useAppData";

export default function MapScreen() {
  const { foundItems } = useAppData();

  return (
    <View style={styles.container}>
      <OsmMapView items={foundItems} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.cream },
});
