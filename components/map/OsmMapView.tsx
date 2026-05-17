import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import { Card } from "@/components/ui/Card";
import { DEMO_USER } from "@/constants/locations";
import { theme } from "@/constants/theme";
import { distanceFromDemoM, formatDistance } from "@/services/matching";
import type { FoundItem } from "@/types/models";

type Props = {
  items: FoundItem[];
};

function buildMapHtml(items: FoundItem[]): string {
  const markers = items.map((item, i) => ({
    lat: item.coordinates.lat,
    lng: item.coordinates.lng,
    title: item.title.replace(/'/g, "\\'"),
    n: i + 1,
  }));
  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{margin:0;height:100%;} .pin{font-weight:bold;}</style>
</head><body>
<div id="map"></div>
<script>
var map = L.map('map').setView([${DEMO_USER.lat}, ${DEMO_USER.lng}], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);
L.circleMarker([${DEMO_USER.lat}, ${DEMO_USER.lng}], {radius:8,color:'#3A4A7A',fillColor:'#3A4A7A',fillOpacity:0.5}).addTo(map).bindPopup('You (demo): Karlsplatz');
var markers = ${JSON.stringify(markers)};
markers.forEach(function(m) {
  var icon = L.divIcon({className:'pin', html:"<div style='background:#3A4A7A;color:#fff;width:26px;height:26px;border-radius:13px;line-height:22px;text-align:center;border:2px solid #fff;font-size:12px;'>"+m.n+"</div>", iconSize:[26,26], iconAnchor:[13,13]});
  L.marker([m.lat, m.lng], {icon: icon}).addTo(map).bindPopup(m.title);
});
</script>
</body></html>`;
}

export function OsmMapView({ items }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<FoundItem | null>(null);
  const mapHtml = useMemo(() => buildMapHtml(items), [items]);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => distanceFromDemoM(a) - distanceFromDemoM(b)),
    [items],
  );

  return (
    <View style={styles.wrap}>
      <WebView
        style={styles.map}
        originWhitelist={["*"]}
        source={{ html: mapHtml }}
        javaScriptEnabled
        domStorageEnabled
      />

      {selected ? (
        <View style={styles.sheet}>
          <Card
            onPress={() =>
              router.push({
                pathname: "/match/[foundId]",
                params: {
                  foundId: selected.id,
                  reportId: "browse",
                },
              })
            }
          >
            <Text style={styles.sheetTitle}>{selected.title}</Text>
            <Text style={styles.sheetMeta}>
              {selected.locationLabel} ·{" "}
              {formatDistance(distanceFromDemoM(selected))}
            </Text>
          </Card>
          <Pressable onPress={() => setSelected(null)}>
            <Text style={styles.dismiss}>Dismiss</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.drawer}>
        <Text style={styles.drawerTitle}>Lost near you — 1. Bezirk</Text>
        <DrawerList
          items={sorted.slice(0, 6)}
          selected={selected}
          onSelect={setSelected}
          onOpen={(item) =>
            router.push({
              pathname: "/match/[foundId]",
              params: { foundId: item.id, reportId: "browse" },
            })
          }
        />
        <Text style={styles.osm}>
          © OpenStreetMap contributors · Expo Go map
        </Text>
      </View>
    </View>
  );
}

function DrawerList({
  items,
  selected,
  onSelect,
  onOpen,
}: {
  items: FoundItem[];
  selected: FoundItem | null;
  onSelect: (i: FoundItem) => void;
  onOpen: (i: FoundItem) => void;
}) {
  return (
    <>
      {items.map((item) => (
        <Pressable
          key={item.id}
          style={[styles.row, selected?.id === item.id && styles.rowActive]}
          onPress={() => {
            onSelect(item);
            onOpen(item);
          }}
        >
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.rowMeta}>
            {formatDistance(distanceFromDemoM(item))}
          </Text>
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  map: { flex: 1, minHeight: 260, backgroundColor: theme.cream },
  sheet: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
  },
  sheetTitle: { fontWeight: "600", color: theme.ink },
  sheetMeta: { color: theme.muted, marginTop: 4 },
  dismiss: { textAlign: "center", color: theme.indigo, marginTop: 8 },
  drawer: {
    backgroundColor: theme.cream,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    maxHeight: 240,
  },
  drawerTitle: {
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "serif",
    color: theme.ink,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  rowActive: { backgroundColor: "rgba(58,74,122,0.08)" },
  rowTitle: { color: theme.ink, flex: 1 },
  rowMeta: { color: theme.muted },
  osm: { fontSize: 10, color: theme.muted, marginTop: 8 },
});
