import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { COLORS } from "../constants/COLORS";
import AppText from "./AppText";
export default function CustomButton({
  label,
  icon,
  onPress,
  style = {},
  styleText,
  type = 'primary',
  disable
}) {
  return (
    <TouchableOpacity disabled={disable} onPress={onPress} style={[styles.button, style]}>
      {icon}
      <AppText
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
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRadius: 7,
    marginTop: 10
  },
});
