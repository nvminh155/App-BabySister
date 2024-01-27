// REACT NATIVE / REACT
import 'react-native-gesture-handler';

import { StyleSheet, Text, View, Image } from "react-native";
import { useContext, useEffect, useState } from "react";

//firse base
import { onSnapshot } from "firebase/firestore";

// context
import AuthProvider from "./src/contexts/AuthProvider";

import RootNavigator from "./src/navigations";

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
