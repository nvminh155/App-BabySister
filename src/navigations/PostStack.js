import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PostedScreen from "../screens/PostScreen/Posted";
import ViewPostScreen from "../screens/PostScreen/ViewPost";
import EditPostScreen from "../screens/PostScreen/EditPost";

const Stack = createStackNavigator();

export default function PostStack() {
  return (
    <Stack.Navigator
      initialRouteName="PostedScreen"
      screenOptions={{ }}
    >
      <Stack.Screen name="Posted" component={PostedScreen} />
      <Stack.Screen name="ViewPost" component={ViewPostScreen} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
    </Stack.Navigator>
  );
}
