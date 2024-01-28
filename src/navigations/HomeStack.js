import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Dimensions, TouchableOpacity, View } from "react-native";

import {Ionicons} from "react-native-vector-icons";

import HomeScreen from "../screens/HomeScreen";
import InfoSisterScreen from "../screens/HomeScreen/InfoSisterScreen";
import ChatScreen from "../screens/ChatScreen";
import PostSearchScreen from "../screens/HomeScreen/PostSearchScreen";
import { AuthContext } from "../contexts/AuthProvider";
import { AppImage, AppSafeAreaView, AppText } from "../components";


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

      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}
      >
        <Ionicons name="sunny-outline" size={24} color={"yellow"} />
        <AppText style={{ fontWeight: "bold" }}>{user.displayName} !</AppText>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Notice");
        }}
      >
        <AppImage
          width={24}
          height={24}
          source={require("images/notice.png")}
        />
      </TouchableOpacity>
    </AppSafeAreaView>
  );
}

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: (props) => {
          return <CustomTabHeader props={{ ...props }} />;
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="InfoSister" component={InfoSisterScreen} />
      <Stack.Screen name="ChatSister" component={ChatScreen} />
      <Stack.Screen name="PostSearch" component={PostSearchScreen} />
    </Stack.Navigator>
  );
}
