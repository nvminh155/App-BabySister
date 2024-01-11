// REACT NATIVE / REACT
import { StyleSheet, Text, View, Image } from "react-native";
import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//firse base
import { onSnapshot } from "firebase/firestore";

// screens
import Home from "./src/screens/HomeScreen";
import Login from "./src/screens/LoginScreen";
import Signup from "./src/screens/RegisterScreen";
import Chat from "./src/screens/ChatScreen";
import InfoSister from './src/screens/InfoSisterScreen'


// context
import AuthProvider from "./src/contexts/AuthProvider";
import { AuthContext } from "./src/contexts/AuthProvider";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="InfoSister" screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" component={Home} />
      <Stack.Screen name="InfoSister" component={InfoSister} />
      <Stack.Screen name="PostSearch" component={InfoSister} />
    </Stack.Navigator>
  )
}

function AppStack() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false, tabBarItemStyle: {paddingVertical: 5} }}
      
    >
      <Tab.Screen
        name="Home"
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
        component={Chat}
        options={{
          title: "Trang Chủ",
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
        name="Chat1"
        component={Chat}
        options={{
          title: "Lịch Biểu",
          tabBarIcon: () => (
            <Image
              style={styles.tinyLogo(24,24)}
              source={require("./src/assets/images/task.png")} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat2"
        component={Chat}
        options={{
          title: "LS Giao dịch",
          tabBarIcon: () => (
            <Image
              style={styles.tinyLogo(24,24)}
              source={require("./src/assets/icons/transaction.png")} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat3"
        component={Chat}
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
        }}
      />
    </Tab.Navigator>
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
      {user ? <AppStack /> : <AuthStack />}
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
  tinyLogo: (w, h) => ({
    width: w,
    height: h,
  }),
});
