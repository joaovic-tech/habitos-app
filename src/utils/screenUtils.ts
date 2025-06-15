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

// Helper para verificar se o dispositivo é pequeno
export const isSmallDevice = () => {
  const { width } = getScreenDimensions();
  return width < 380;
};
