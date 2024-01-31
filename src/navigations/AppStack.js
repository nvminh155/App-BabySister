
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {FontAwesome5, Ionicons, Meterial} from "react-native-vector-icons"

import AppImage from "../components/AppImage";

import ScheduleStack from "../navigations/ScheduleStack";
import HomeStack from "../navigations/HomeStack";
import ChatStack from "../navigations/ChatStack";
import UserScreen from "../screens/UserScreen";
import PostedScreen from "../screens/PostScreen/Posted";
import PostStack from "./PostStack";

const Tab = createBottomTabNavigator();



export default function AppStack() {
    return (
      <Tab.Navigator
        initialRouteName="HomeStack"
        screenOptions={{
          headerShown: false,
          tabBarItemStyle: { paddingVertical: 5 },
          
        }}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          
          options={{
            title: "Trang Chủ",
            tabBarIcon: () => (
              <FontAwesome5
                name="house-user"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            ),
            
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatStack}
          options={{
            title: "Tin nhắn",
            tabBarIcon: () => (
              <Ionicons
                name="chatbox"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ScheduleBaby"
          component={ScheduleStack}
          options={{
            title: "Lịch Biểu",
            tabBarIcon: () => (
              <AppImage
                width={24}
                height={24}
                source={require("images/task.png")}
              />
            ),
          }}
        />
        <Tab.Screen
          name="PostedScreen"
          component={PostStack}
          options={{
            title: "Lịch sử đăng",
            tabBarIcon: () => (
              <AppImage
                width={24}
                height={24}
                source={require("icons/transaction.png")}
              />
            ),
          }}
        />
        <Tab.Screen
          name="UserScreen"
          component={UserScreen}
          options={{
            title: "Người Dùng",
            tabBarIcon: () => (
              <FontAwesome5
                name="user-circle"
                size={20}
                color="#666"
                style={{ marginRight: 5 }}
              />
            ),
            headerShown: true
          }}
        />
      </Tab.Navigator>
    );
  }