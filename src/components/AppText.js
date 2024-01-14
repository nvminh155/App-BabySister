import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/COLORS";

const AppText = ({ children, style }) => {
  return (
    <Text
      style={[
        {
          fontSize: 16,
          color: COLORS.text
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default AppText;
