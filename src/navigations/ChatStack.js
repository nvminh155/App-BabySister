import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ChatScreen from "../screens/ChatScreen";
import ChatPrivate from "../screens/ChatScreen/ChatPrivate";
import ViewSchedule from "../screens/ChatScreen/ViewSchedule";

const Stack = createStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator
      initialRouteName="index"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="index" component={ChatScreen} />
      <Stack.Screen name="ChatPrivate" component={ChatPrivate} />
      <Stack.Screen name="ViewSchedule" component={ViewSchedule} />
    </Stack.Navigator>
  );
}
