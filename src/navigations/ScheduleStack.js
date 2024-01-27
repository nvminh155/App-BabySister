import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ScheduleBabyScreen from "../screens/ScheduleBabyScreen";
import AddSchedule from "../screens/ScheduleBabyScreen/addSchedule"
import ViewSchudule from "../screens/ScheduleBabyScreen/ViewSchedule"

const Stack = createStackNavigator();

export default function ScheduleStack() {
  return (
    <Stack.Navigator
      initialRouteName="ScheduleBaby"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="ScheduleBaby" component={ScheduleBabyScreen} />
      <Stack.Screen name="addSchedule" component={AddSchedule} />
      <Stack.Screen name="ViewSchedule" component={ViewSchudule} />
    </Stack.Navigator>
  );
}
