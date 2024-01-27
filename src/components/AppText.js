import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/COLORS";

const AppText = ({
  children,
  style,
  heading,
  fontSize,
  fontWeight,
  color,
  numberOfLines = 0,
  ellipsizeMode = 'tail'
}) => {
  return (
    <Text
      style={[
        {
          fontSize: (fontSize || 16),
          color: (color || COLORS.text),
          fontWeight: (fontWeight || 'normal')
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
};

export default AppText;
