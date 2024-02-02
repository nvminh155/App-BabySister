
import { StyleSheet, Text, View, Image } from "react-native";
import { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";

import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import CollabStack from "./CollabStack";

import { AuthContext } from "../contexts/AuthProvider";

export default function RootNavigator() {
    const { user } = useContext(AuthContext);
  
  
    return (
      <NavigationContainer>
        {user ? (user.typeUser === 1 ? <CollabStack /> : <AppStack />) : <AuthStack />}
      </NavigationContainer>
    );
  }