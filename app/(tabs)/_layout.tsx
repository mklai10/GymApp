import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen
          name="index"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <Entypo name="home" size={30} color="white" />
            )
          }}
        />
      <Tabs.Screen
          name="excercises"
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => (
              <FontAwesome5 name="dumbbell" size={24} color="white" />
            )
          }}
        />
    </Tabs>
  );
}
