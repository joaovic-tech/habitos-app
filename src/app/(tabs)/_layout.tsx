import { Tabs } from "expo-router";
import { TabBar } from "@/components/TabBar";
import { ToastProvider } from "@/components/shared/Toast";

const TABS = ["about", "form", "index", "profile", "settings"] as const;

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="profile" // para estilizar (mudar depois pro alert)
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen key={tab} name={tab} options={{ headerShown: false }} />
      ))}
    </Tabs>
  );
}
