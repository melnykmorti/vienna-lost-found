export const theme = {
  cream: "#F4EFE6",
  ink: "#1A1F2E",
  indigo: "#3A4A7A",
  indigoDark: "#2A365C",
  white: "#FFFFFF",
  muted: "#6B7280",
  border: "#E5DFD4",
  success: "#2D6A4F",
  warning: "#B45309",
  cardShadow: {
    shadowColor: "#1A1F2E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};

import { DefaultTheme } from "@react-navigation/native";

export const navigationTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.indigo,
    background: theme.cream,
    card: theme.white,
    text: theme.ink,
    border: theme.border,
    notification: theme.indigo,
  },
};
