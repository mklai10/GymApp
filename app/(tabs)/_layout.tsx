import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={{headerShown: false}}/>
  );
}
