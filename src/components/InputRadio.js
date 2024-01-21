import { StyleSheet, TouchableOpacity, View } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { useState } from "react";

import { COLORS } from "../constants/COLORS";

export default function InputRadio({ children, style, edge }) {
  const [isTick, setIsTick] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        setIsTick(!isTick);
      }}
      style={{
        height: edge,
        width: edge,
        borderColor: COLORS.accent,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {isTick && <Ionicons name="checkmark-sharp" size={edge-5} color={COLORS.accent} />}
    </TouchableOpacity>
  );
}
