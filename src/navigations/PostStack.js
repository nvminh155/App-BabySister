import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PostedScreen from "../screens/PostScreen/Posted";
import ViewPostScreen from "../screens/PostScreen/ViewPost";
import EditPostScreen from "../screens/PostScreen/EditPost";
import InfoSisterScreen from "../screens/PostScreen/InfoSisterScreen";
import UserApply from "../screens/PostScreen/UserApply";

import ChatPrivateScreen from "../screens/ChatScreen/ChatPrivate";
import MenuChatPrivate from "../screens/ChatScreen/MenuChatPrivate";
import ActiveSchedule from "../screens/ScheduleBabyScreen/ActiveSchedule";
import ChatPrivateProvider from "../contexts/ChatPrivateProvider";

const Stack = createStackNavigator();
const StackChatPrivate = createStackNavigator();

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


export default function PostStack() {
  return (
    <Stack.Navigator initialRouteName="PostedScreen" screenOptions={{}}>
      <Stack.Screen
        name="Posted"
        component={PostedScreen}
        options={{ title: "Bài đã đăng" }}
      />
      <Stack.Screen name="ViewPost" component={ViewPostScreen} options={{title: ""}} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
      <Stack.Screen
        name="UserApply"
        component={UserApply}
        options={{ title: "Thành Viên Nộp Đơn" }}
      />
      <Stack.Screen
        name="InfoSister"
        component={InfoSisterScreen}
        options={{ title: "Thông tin về Sister" }}
      />
      <Stack.Screen
        name="ChatPrivateStack"
        component={ChatPrivateStack}
        options={{ title: "Nhắn Tin", headerShown: false }}
      />
    </Stack.Navigator>
  );
}
