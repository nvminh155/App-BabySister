import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ChatScreen from "../screens/ChatScreen";
import ChatPrivate from "../screens/ChatScreen/ChatPrivate";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="index" component={ChatScreen} />
      <Stack.Screen name="ChatPrivate" component={ChatPrivate} />
    </Stack.Navigator>
  );
}
