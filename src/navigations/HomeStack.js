import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import InfoSisterScreen from "../screens/HomeScreen/InfoSisterScreen";
import ChatScreen from "../screens/ChatScreen";
import PostSearchScreen from "../screens/HomeScreen/PostSearchScreen";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="index" component={HomeScreen} />
      <Stack.Screen name="InfoSister" component={InfoSisterScreen} />
      <Stack.Screen name="ChatSister" component={ChatScreen} />
      <Stack.Screen name="PostSearch" component={PostSearchScreen} />
    </Stack.Navigator>
  );
}
