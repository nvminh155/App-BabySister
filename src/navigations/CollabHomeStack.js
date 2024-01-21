import React, { useContext } from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import HomeScreen from "../collabScreens/HomeScreen";

const Tab = createMaterialTopTabNavigator();

export default function CollabHomeStack() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Home1" component={HomeScreen} />
      <Tab.Screen name="Home2" component={HomeScreen} />
    </Tab.Navigator>
  );
}
