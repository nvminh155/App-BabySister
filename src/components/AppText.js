import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

const AppText = ({ children, style }) => {
  return (
    <Text
      style={[
        {
          fontSize: 16,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default AppText;
