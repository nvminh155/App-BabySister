import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Dimensions, TouchableOpacity, View } from "react-native";

import { Ionicons } from "react-native-vector-icons";

import CreatePayment from "../screens/PaymentScreen/CreatePayment";
import ShowPayment from "../screens/PaymentScreen/ShowPayment";
import Index from "../screens/PaymentScreen";
const Stack = createStackNavigator();

const wWidth = Dimensions.get("window").width;

export default function PaymentStack({ navigation, route }) {
  return (
    <Stack.Navigator initialRouteName="CreatePayment">
      <Stack.Screen
        name="CreatePayment"
        component={CreatePayment}
        initialParams={{ ...route.params }}
        options={{
          title: ""
        }}
      />
      <Stack.Screen
        name="ShowPayment"
        component={ShowPayment}
        options={{
          title: "",
        }}
      />
    </Stack.Navigator>
  );
}
