import React, { useContext, useLayoutEffect } from "react";

import { View, TouchableOpacity } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import { FontAwesome5, Ionicons } from "react-native-vector-icons";

import { AuthContext } from "../contexts/AuthProvider";

import NoticeScreen from "../collabScreens/NoticeScreen";

const Stack = createStackNavigator();

export default function CollabNoticeStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{
    }}>
      <Stack.Screen name="Notice" component={NoticeScreen} />
    </Stack.Navigator>
  );
}
