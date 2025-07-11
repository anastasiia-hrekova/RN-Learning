import { Tabs } from 'expo-router';
import { TowerControl as GameController } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2d3748',
          borderTopColor: '#4a5568',
        },
        tabBarActiveTintColor: '#9BBC0F',
        tabBarInactiveTintColor: '#718096',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Snake',
          tabBarIcon: ({ size, color }) => (
            <GameController size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}