// REACT ( NATIVE )
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";

import { useContext, useEffect, useLayoutEffect, useState } from "react";

// FIRE BASE

// CONTEXT
import { AuthContext } from "../../contexts/AuthProvider";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../../constants/COLORS";

import PayForJob from "./PayForJob";
import WalletDeposit from "./WalletDeposit";

export default function Index({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const paymentType = route.params?.paymentType ?? "wallet";


  const handlePayment = (params) => {
    navigation.navigate("CreatePayment", {
      ...params
    }); 
  }

  return (
    <View>
      {paymentType === "wallet" && <WalletDeposit />}
      {paymentType === "payForJob" && <PayForJob />}
    </View>
  );
}
