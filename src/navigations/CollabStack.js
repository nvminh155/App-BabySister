import React, { useContext, useEffect, useLayoutEffect, useRef } from "react";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import { FontAwesome5, Ionicons, AntDesign } from "react-native-vector-icons";

import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";

import { Button, Dimensions, TouchableOpacity, View, Text } from "react-native";

import CollabHomeStack from "./CollabHomeStack";
import ViewJobScreen from "../collabScreens/HomeScreen/ViewJob";
import UserScreen from "../collabScreens/UserScreen";

import { AuthContext } from "../contexts/AuthProvider";

import {
  AppText,
  AppImage,
  AppSafeAreaView,
  CustomButton,
} from "../components";
import { COLORS } from "../constants/COLORS";
import NoticeScreen from "../collabScreens/NoticeScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const wWidth = Dimensions.get("window").width;

function CustomTabHeader(props) {
  const { user } = useContext(AuthContext);
  const { navigation } = props.props;

  return (
    <AppSafeAreaView
      id="header"
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: wWidth,
        paddingHorizontal: 10,
        backgroundColor: "white",
        height: "max-content",
        paddingVertical: 15,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.openDrawer();
        }}
      >
        <AppImage
          width={24}
          height={24}
          source={require("images/menu_bar.png")}
        />
      </TouchableOpacity>

      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}
      >
        <Ionicons name="sunny-outline" size={24} color={"yellow"} />
        <AppText style={{ fontWeight: "bold" }}>{user.displayName} !</AppText>
      </View>

      <TouchableOpacity onPress={() => {navigation.navigate("Notice")}}>
        <AppImage width={24} height={24} source={require("images/notice.png")} />
      </TouchableOpacity>
    </AppSafeAreaView>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

function ContentDrawerHome(props) {
  const { navigation } = props;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ height: "100%" }}
    >
      <DrawerItemList {...props} />
      <DrawerItem
        {...props}
        
        label={"Thông Tin Cá Nhân"}
        icon={() => <AntDesign name="user" size={24} />}
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate("UserScreen");
        }}
      />

      <TouchableOpacity
        style={{
          flexDirection: "row",
          columnGap: 15,
          alignItems: "center",
          marginTop: "auto",
          paddingHorizontal: 15,
          paddingVertical: 20,
          borderTopWidth: 0.5,
          borderTopColor: "#333",
        }}
        onPress={async () => {
          await signOut(auth).catch((err) => console.log(err));
        }}
      >
        <AppImage
          width={24}
          height={24}
          source={require("images/logout.png")}
        />
        <AppText fontSize={17}>Đăng Xuất</AppText>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}
function DrawerHome() {
  return (
    <Drawer.Navigator
      initialRouteName="CollabHome"
      screenOptions={{
        header: (props) => {
          return <CustomTabHeader props={{ ...props }} />;
        },
        headerLeft: () => <View style={{ display: "none" }}></View>,
      }}
      drawerContent={(props) => <ContentDrawerHome {...props} />}
    >
      <Drawer.Screen
        name="CollabHome"
        component={CollabHomeStack}
        options={{
          title: "Trang Chủ",
          drawerIcon: ({ focused, size }) => (
            <AntDesign name="home" size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: "Thông Báo",
          drawerIcon: ({ focused, size }) => (
            <Ionicons name="notifications" size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
export default function CollabStack() {
  const draw = useRef();

  return (
    <Stack.Navigator initialRouteName="DrawerHome">
      <Stack.Screen
        name="DrawerHome"
        component={DrawerHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ViewJob" component={ViewJobScreen} options={{title: "Xem công việc"}} />
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          title: "Thông Tin Cá Nhân",
          
        }}
      />
      <Stack.Screen
        name="Notice"
        component={NoticeScreen}
        options={{
          title: "Thông Báo",
          
        }}
      />
    </Stack.Navigator>
  );
}
