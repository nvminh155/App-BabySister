import { StyleSheet, TouchableOpacity, View } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { useEffect, useState } from "react";

import { COLORS } from "../constants/COLORS";

export default function InputCheckbox({ children, style, edge, onToggle }) {
  const [isTick, setIsTick] = useState(false);

  useEffect( () => {  
    if(onToggle) onToggle(isTick)
  }, [isTick] )
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
