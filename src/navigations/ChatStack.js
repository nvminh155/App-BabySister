import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ChatScreen from "../screens/ChatScreen";
import ChatPrivateScreen from "../screens/ChatScreen/ChatPrivate";
import ViewSchedule from "../screens/ScheduleBabyScreen/ViewSchedule"
import ActiveSchedule from "../screens/ScheduleBabyScreen/ActiveSchedule";

const Stack = createStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator
      initialRouteName="ChatScreen"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{title: "Tin nhắn"}}/>
      <Stack.Screen name="ChatPrivate" component={ChatPrivateScreen} />
      <Stack.Screen name="ViewSchedule" component={ViewSchedule} options={{title: "Lịch biểu"}} />
      <Stack.Screen name="ActiveSchedule" component={ActiveSchedule} />
    </Stack.Navigator>
  );
}
