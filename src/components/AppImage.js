import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

const AppImage = ({ width, height, source, options, style }) => {


  return (
    <Image
      style={[
        {
          width,
          height,
        },
        style,
      ]}
      source={source}
    />
  );
};

export default AppImage;
