import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";


const AppImage = ({width, height, source, options}) => {
  return (
    <Image style={[{
      width,
      height,
      
    }, options && options.styles]} source={source} />
  );
};



export default AppImage;
