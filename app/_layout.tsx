import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { navigationTheme } from "@/constants/theme";
import { theme } from "@/constants/theme";
import { useAppStore } from "@/store/appStore";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const { hydrate, ready } = useAppStore();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (loaded && ready) {
      SplashScreen.hideAsync();
    }
  }, [loaded, ready]);

  if (!loaded || !ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.cream,
        }}
      >
        <ActivityIndicator size="large" color={theme.indigo} />
      </View>
    );
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.cream },
          headerTintColor: theme.indigo,
          headerTitleStyle: {
            fontFamily: "serif",
            fontWeight: "600",
          },
          contentStyle: { backgroundColor: theme.cream },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="report/lost" options={{ title: "Report lost" }} />
        <Stack.Screen name="report/found" options={{ title: "Report found" }} />
        <Stack.Screen
          name="matches/[reportId]"
          options={{ title: "Matches" }}
        />
        <Stack.Screen
          name="match/[foundId]"
          options={{ title: "Match detail" }}
        />
        <Stack.Screen
          name="claim/verify"
          options={{ title: "Verify ownership" }}
        />
        <Stack.Screen
          name="claim/progress"
          options={{ title: "Claim status" }}
        />
        <Stack.Screen name="claim/pickup" options={{ title: "Pick up item" }} />
        <Stack.Screen
          name="contact/safe-replies"
          options={{ title: "Safe replies" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
