import { Tabs } from 'expo-router';
import { TabBar } from '@/components/TabBar';

const TABS = ['info', 'form', 'alert', 'profile', 'settings'] as const;

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName='info' // para estilizar (mudar depois pro alert)
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
      {TABS.map(tab => (
        <Tabs.Screen key={tab} name={tab} options={{ headerShown: false, }} />
      ))}
    </Tabs>
  );
}
