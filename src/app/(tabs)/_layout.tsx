import { TabBar } from '../../components/TabBar';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            initialRouteName="info" // para estilizar (mudar depois pro alert)
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen name="info" options={{ headerShown: false, }} />
            <Tabs.Screen name="form" options={{ headerShown: false, }} />
            <Tabs.Screen name="alert" options={{ headerShown: false, }} />
            <Tabs.Screen name="profile" options={{ headerShown: false, }} />
            <Tabs.Screen name="settings" options={{ headerShown: false, }} />
        </Tabs>
    );
}
