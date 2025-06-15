import { useCallback, useEffect, useState } from "react";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import * as configStorage from "@/storage/configStorage";
import { router } from "expo-router";

export function useTheme() {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [loading, setLoading] = useState(true);
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(
    configStorage.DEFAULT_CONFIG.animation // Valor inicial padrão
  );

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const storedConfig = await configStorage.getConfig();
      const themeToApply = storedConfig.theme === "light" ? "light" : "dark";
      setColorScheme(themeToApply);
      setIsAnimationEnabled(storedConfig.animation); // Carrega a preferência de animação
      setLoading(false);
    }
    loadSettings();
  }, []); // Alterado para [] para garantir execução única no mount

  const toggleTheme = useCallback(async () => {
    const nextTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(nextTheme);
    const currentConfig = await configStorage.getConfig();
    await configStorage.saveConfig({ ...currentConfig, theme: nextTheme });
  }, [colorScheme, setColorScheme]);

  const setTheme = useCallback(
    async (theme: "light" | "dark") => {
      setColorScheme(theme);
      const currentConfig = await configStorage.getConfig();
      await configStorage.saveConfig({ ...currentConfig, theme: theme });
    },
    [setColorScheme]
  );

  const toggleAnimation = useCallback(async () => {
    const newAnimationValue = !isAnimationEnabled;
    setIsAnimationEnabled(newAnimationValue); // Atualiza o estado local
    const currentConfig = await configStorage.getConfig();
    await configStorage.saveConfig({
      ...currentConfig,
      animation: newAnimationValue, // Salva a nova preferência
    });
  }, [isAnimationEnabled]);

  return {
    colorScheme,
    setColorScheme: setTheme,
    toggleTheme,
    loading,
    isAnimationEnabled, // Exporta o estado da animação
    toggleAnimation, // Exporta a função para alternar a animação
  };
}
