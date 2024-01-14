import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { COLORS } from "../constants/COLORS";
export default function CustomButton({
  label,
  icon,
  onPress,
  style,
  styleText,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {icon}
      <Text
        style={[
          {
            textAlign: "center",
            fontWeight: "700",
            fontSize: 15,
            color: "#fff",
          },
          styleText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRadius: 7
  },
});
