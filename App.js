// REACT NATIVE / REACT
import { StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//firse base
import { onSnapshot } from "firebase/firestore";

// screens
import Home from "./src/screens/HomeScreen";
import Login from "./src/screens/LoginScreen";
import Signup from "./src/screens/RegisterScreen";
import Chat from "./src/screens/ChatScreen";

// context
import AuthProvider from "./src/contexts/AuthProvider";
import { AuthContext } from "./src/contexts/AuthProvider";

const Stack = createStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user } = useContext(AuthContext);

  console.log("A1SDASD", user);

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
