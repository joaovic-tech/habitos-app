import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";

const TABS = ["about", "form", "index", "profile", "settings"];

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      tabBar={(props: any) => <TabBar {...props} />}
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
  );
}
