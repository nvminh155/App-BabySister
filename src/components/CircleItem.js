import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

const CircleItem = ({ children, style, edge = 30}) => {
  return (
    <View
      style={[
        {
          width: edge,
          height: edge,
          borderRadius: edge/2
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default CircleItem;
