import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";
import { StatusBar } from "expo-status-bar";

const TABS = ["about", "form", "index", "profile", "settings"] as const;

export default function TabLayout() {
  return (
    <>
      <StatusBar style="auto" hideTransitionAnimation="slide" />
      <Tabs
        initialRouteName="index"
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        {TABS.map((tab) => (
          <Tabs.Screen key={tab} name={tab} options={{ headerShown: false }} />
        ))}
      </Tabs>
    </>
  );
}