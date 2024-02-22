import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

const AppImage = ({ width, height, source, options, style, type = "source" }) => {


  return (
    <Image
      style={[
        {
          width,
          height,
        },
        style,
      ]}
      source={type === "uri" ? { uri: source } : source }
    />
  );
};

export default AppImage;
