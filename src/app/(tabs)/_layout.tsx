import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";
import { getStatusBarConfig } from "@/utils/responsive";

const TABS = ["about", "form", "index", "profile", "settings"] as const;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const statusBarConfig = getStatusBarConfig(colorScheme);

  return (
    <>
      {/* Renderiza uma View atrás da StatusBar para controlar a cor */}
      <View
        style={{
          height: 32, // ou use StatusBar.currentHeight para Android
          backgroundColor: colorScheme === "dark" ? "#171717" : "#ffffff",
        }}
      />
      <StatusBar
        style={statusBarConfig.style}
        hideTransitionAnimation="slide"
      />

      <Tabs
        initialRouteName="settings"
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        {TABS.map((tab) => (
          <Tabs.Screen
            key={tab}
            name={tab}
            options={{
              headerShown: false,
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
