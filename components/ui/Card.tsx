import { ReactNode } from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

import { theme } from "@/constants/theme";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accent?: boolean;
};

export function Card({ children, onPress, style, accent }: Props) {
  const content = (
    <View style={[styles.card, accent && styles.accent, style]}>
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...theme.cardShadow,
  },
  accent: { backgroundColor: theme.indigo },
  pressed: { opacity: 0.92 },
});
