import React, { useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { FontAwesome5, Ionicons, Meterial } from "react-native-vector-icons";

import CollabHomeStack from "./CollabHomeStack";

import { TouchableOpacity, View } from "react-native";
import { AppText, AppImage } from "../components";
import { AuthContext } from "../contexts/AuthProvider";

const Stack = createStackNavigator();

const CustomTabHeader = ({props}) => {
  console.log(props)
  const { user } = useContext(AuthContext);
  return (
    <View
      id="header"
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <TouchableOpacity onPress={() => {}}>
        <AppImage
          width={24}
          height={24}
          source={require("../assets/images/menu_bar.png")}
        />
      </TouchableOpacity>

      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}
      >
        <Ionicons name="sunny-outline" size={24} color={"yellow"} />
        <AppText style={{ fontWeight: "bold" }}>{user.displayName} !</AppText>
      </View>

      <TouchableOpacity>
        <AppImage
          width={24}
          height={24}
          source={require("../assets/images/gift.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function CollabStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={CollabHomeStack}
        options={{ headerTitle: (props) => <CustomTabHeader {...props} /> }}
      />
      <Stack.Screen name="Home13" component={CollabHomeStack} options={{headerTitle: (props) => <CustomTabHeader {...props} />}} />
      <Stack.Screen name="Home234" component={CollabHomeStack} />
    </Stack.Navigator>
  );
}
