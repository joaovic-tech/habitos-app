import { Dimensions, Platform } from "react-native";

// Utilitários para responsividade
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get("window");
  return { width, height };
};

export const getScreenCategory = () => {
  const { width } = getScreenDimensions();

  if (width < 380) return "small";
  if (width < 420) return "medium";
  if (width < 500) return "large";
  return "xlarge";
};

export const getScreen = () => {
  const { width } = getScreenDimensions();

  if (width < 380) return "small";
  if (width < 420) return "medium";
  if (width < 500) return "large";
  return "xlarge";
};

export const getTabBarHeight = (
  screenHeight: number,
  insetBottom: number = 0
) => {
  // Altura base dependendo do tamanho da tela
  let baseHeight = 70;

  if (screenHeight < 700) {
    baseHeight = 60;
  } else if (screenHeight < 900) {
    baseHeight = 70;
  } else {
    baseHeight = 80;
  }

  // Limites mínimo e máximo
  const minHeight = 56;
  const maxHeight = Math.min(baseHeight, screenHeight * 0.1);

  return Math.max(minHeight, maxHeight) + insetBottom;
};

export const getIconSize = (screenWidth: number) => {
  if (screenWidth < 380) return 22;
  if (screenWidth < 420) return 26;
  return 32;
};

export const getFontSize = (
  screenWidth: number,
  baseSize: "xs" | "sm" | "base" | "lg"
) => {
  const isSmallScreen = screenWidth < 380;

  const sizes = {
    xs: isSmallScreen ? 10 : 12,
    sm: isSmallScreen ? 12 : 14,
    base: isSmallScreen ? 14 : 16,
    lg: isSmallScreen ? 16 : 18,
  };

  return sizes[baseSize];
};

export const getSpacing = (
  screenWidth: number,
  spacing: "xs" | "sm" | "base" | "lg"
) => {
  const isSmallScreen = screenWidth < 380;

  const spaces = {
    xs: isSmallScreen ? 2 : 4,
    sm: isSmallScreen ? 4 : 8,
    base: isSmallScreen ? 8 : 12,
    lg: isSmallScreen ? 12 : 16,
  };

  return spaces[spacing];
};

// Helper para verificar se o dispositivo é pequeno
export const isSmallDevice = () => {
  const { width } = getScreenDimensions();
  return width < 380;
};

// Helper para verificar se é Android
export const isAndroid = Platform.OS === "android";

// Helper para verificar se é iOS
export const isIOS = Platform.OS === "ios";
