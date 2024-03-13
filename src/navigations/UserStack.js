import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import UserScreen from "../screens/UserScreen";
import UserWalletScreen from "../screens/UserScreen/UserWalletScreen";
import PaymentStack from "./PaymentStack";

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator initialRouteName="info" screenOptions={{}}>
      <Stack.Screen
        name="info"
        component={UserScreen}
        options={{
          title: "Thông Tin Cá Nhân",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="UserWallet"
        component={UserWalletScreen}
        options={{
          title: "Ví BSPay",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="UserPaymentStack"
        component={PaymentStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
