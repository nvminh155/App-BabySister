import React, { useContext, useLayoutEffect } from "react";

import { View, TouchableOpacity } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { useNavigation } from "@react-navigation/native";

import { FontAwesome5, Ionicons } from "react-native-vector-icons";

import { AuthContext } from "../contexts/AuthProvider";

import HomeScreen from "../collabScreens/HomeScreen";
import WaittingJobSreen from "../collabScreens/HomeScreen/WaittingJob";
import AcceptedJobSreen from "../collabScreens/HomeScreen/AcceptedJob";

const Tab = createMaterialTopTabNavigator();

export default function CollabHomeStack({ navigation }) {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Công Việc Hiện Tại"}} />
      <Tab.Screen
        name="WaittingJob"
        component={WaittingJobSreen}
        options={{ title: "Chờ Xác Nhận"}}
      />
      <Tab.Screen
        name="AcceptedJob"
        component={AcceptedJobSreen}
        options={{ title: "Đã Được Nhận" }}
      />
    </Tab.Navigator>
  );
}
