import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";

import ChatScreen from "../screens/ChatScreen";
import ChatPrivateScreen from "../screens/ChatScreen/ChatPrivate";
import ViewSchedule from "../screens/ScheduleBabyScreen/ViewSchedule";
import ActiveSchedule from "../screens/ScheduleBabyScreen/ActiveSchedule";
import MenuChatPrivate from "../screens/ChatScreen/MenuChatPrivate";

const Stack = createStackNavigator();
const StackChatPrivate = createStackNavigator();
// const Drawer = createDrawerNavigator();


import ChatPrivateProvider from "../contexts/ChatPrivateProvider";

function ChatPrivateStack({ navigation, route }) {
  return (
    <ChatPrivateProvider navigation={navigation} route={route}>
      <StackChatPrivate.Navigator initialRouteName="ChatPrivate">
        <StackChatPrivate.Screen
          name="ChatPrivate"
          component={ChatPrivateScreen}
        />
        <StackChatPrivate.Screen
          name="MenuChatPrivate"
          component={MenuChatPrivate}
        />
        <StackChatPrivate.Screen
          name="ActiveSchedule"
          component={ActiveSchedule}
        />
      </StackChatPrivate.Navigator>
    </ChatPrivateProvider>
  );
}

export default function ChatStack() {
  return (
    <Stack.Navigator
      initialRouteName="ChatScreen"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name="ChatScreen" // index
        component={ChatScreen}
        options={{ title: "Tin nhắn" }}
      />
      <Stack.Screen
        name="ChatPrivateStack"
        component={ChatPrivateStack}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ViewSchedule"
        component={ViewSchedule}
        options={{ title: "Lịch biểu" }}
      />
    </Stack.Navigator>
  );
}
