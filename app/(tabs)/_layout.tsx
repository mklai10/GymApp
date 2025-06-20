// import { Tabs } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {
  MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions, createMaterialTopTabNavigator
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from 'expo-router';
import { useColorScheme } from "react-native";

const {Navigator} = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator); 

export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      style={{marginBottom: 20}}
    >
      <MaterialTopTabs.Screen 
        name="index"
        options={{
          tabBarActiveTintColor: 'white',
          tabBarShowLabel: false,
          tabBarIndicatorStyle: {opacity: 0},
          tabBarIcon: ({color}) => (
            <Entypo name="home" size={30} color={color} />
          )
        }}
      />
      <MaterialTopTabs.Screen 
        name="excercises"
        options={{
          tabBarActiveTintColor: 'white',
          tabBarShowLabel: false,
          tabBarIndicatorStyle: {opacity: 0},
          tabBarIcon: ({color}) => (
            <FontAwesome5 name="dumbbell" size={30} color={color} />
          )
        }}
      />
    </MaterialTopTabs>
  );
}
