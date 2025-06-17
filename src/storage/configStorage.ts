import AsyncStorage from "@react-native-async-storage/async-storage";

export const CONFIG_STORAGE_KEY = "@habits:userConfig";

export type ThemeMode = "light" | "dark" | "system";

export type ConfigUser = {
  animation: boolean;
  theme: ThemeMode;
  permissionNotification: boolean | null;
};

export const DEFAULT_CONFIG: ConfigUser = {
  animation: true,
  theme: "system",
  permissionNotification: null,
};

export async function saveConfig(config: ConfigUser): Promise<void> {
  try {
    const jsonValue = JSON.stringify(config);
    await AsyncStorage.setItem(CONFIG_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving user config:", error);
    throw error;
  }
}

export async function getConfig(): Promise<ConfigUser> {
  try {
    const jsonValue = await AsyncStorage.getItem(CONFIG_STORAGE_KEY);
    if (jsonValue !== null) {
      const parsedConfig = JSON.parse(jsonValue);
      return { ...DEFAULT_CONFIG, ...parsedConfig };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error("Error getting user config:", error);
    return DEFAULT_CONFIG;
  }
}

export async function clearConfig(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing user config:", error);
    throw error;
  }
}
