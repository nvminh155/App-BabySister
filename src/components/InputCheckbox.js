import { StyleSheet, TouchableOpacity, View } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { useEffect, useState } from "react";

import { COLORS } from "../constants/COLORS";

export default function InputCheckbox({
  children,
  style,
  edge,
  initTick = false,
  onToggle,
  disable,
}) {
  const [isTick, setIsTick] = useState(initTick);

  useEffect(() => {
    setIsTick(initTick);
    if (onToggle) onToggle(initTick);
  }, [initTick]);

  useEffect(() => {
    if (onToggle) onToggle(isTick);
  }, [isTick]);
  return (
    <>
      {!disable ? (
        <TouchableOpacity
          onPress={() => {
            setIsTick(!isTick);
          }}
          style={{
            height: edge,
            width: edge,
            borderColor: COLORS.accent,
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isTick && (
            <Ionicons
              name="checkmark-sharp"
              size={edge - 5}
              color={COLORS.accent}
            />
          )}
        </TouchableOpacity>
      ) : (
        <View
          style={{
            height: edge,
            width: edge,
            borderColor: COLORS.accent,
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isTick && (
            <Ionicons
              name="checkmark-sharp"
              size={edge - 5}
              color={COLORS.accent}
            />
          )}
        </View>
      )}
    </>
  );
}
