import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";

const STORAGE_KEY = "user-theme";

export function useTheme() {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [loading, setLoading] = useState(true);

  // Carrega o tema salvo ou define dark como padrão
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      setColorScheme(stored === "light" ? "light" : "dark");
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Troca e salva o tema
  const toggleTheme = useCallback(() => {
    const next = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, [colorScheme, setColorScheme]);

  // Seta o tema diretamente e salva
  const setTheme = useCallback(
    (theme: "light" | "dark") => {
      setColorScheme(theme);
      AsyncStorage.setItem(STORAGE_KEY, theme);
    },
    [setColorScheme]
  );

  return { colorScheme, setColorScheme: setTheme, toggleTheme, loading };
}