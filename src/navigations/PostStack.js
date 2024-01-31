import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PostedScreen from "../screens/PostScreen/Posted";
import ViewPostScreen from "../screens/PostScreen/ViewPost";
import EditPostScreen from "../screens/PostScreen/EditPost";
import InfoSisterScreen from "../screens/PostScreen/InfoSisterScreen";
import UserApply from "../screens/PostScreen/UserApply";
import ChatPrivateScreen from "../screens/ChatScreen/ChatPrivate";

const Stack = createStackNavigator();

export default function PostStack() {
  return (
    <Stack.Navigator initialRouteName="PostedScreen" screenOptions={{}}>
      <Stack.Screen
        name="Posted"
        component={PostedScreen}
        options={{ title: "Bài đã đăng" }}
      />
      <Stack.Screen name="ViewPost" component={ViewPostScreen} />
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
        name="ChatPrivate"
        component={ChatPrivateScreen}
        options={{ title: "Nhắn Tin",  }}
      />
    </Stack.Navigator>
  );
}
