import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ScheduleBabyScreen from "../screens/ScheduleBabyScreen";
import AddSchedule from "../screens/ScheduleBabyScreen/addSchedule";
import ViewSchedule from "../screens/ScheduleBabyScreen/ViewSchedule";

import ScheduleProvider from "../contexts/ScheduleProvider";
const Stack = createStackNavigator();
const ProviderStack = createStackNavigator();

function ProviderScheduleStackScreen({ navigation, route }) {
  console.log("🚀 ~ ProviderScheduleStackScreen ~ route:", route);
  return (
    <ScheduleProvider navigation={navigation} route={route}>
      <ProviderStack.Navigator
        initialRouteName={route.name === "addSchedule" ? "1" : "2"}
        screenOptions={{ headerShown: false }}
      >
        <ProviderStack.Screen name="1" component={AddSchedule} />
        <ProviderStack.Screen
          name="2"
          component={ViewSchedule}
          options={{ headerShown: true }}
        />
      </ProviderStack.Navigator>
    </ScheduleProvider>
  );
}
export default function ScheduleStack() {
  return (
    <Stack.Navigator
      initialRouteName="ScheduleBaby"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ScheduleBaby" component={ScheduleBabyScreen} />
      <Stack.Screen
        name="addSchedule"
        component={ProviderScheduleStackScreen}
      />
      <Stack.Screen
        name="ViewSchedule"
        component={ProviderScheduleStackScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
