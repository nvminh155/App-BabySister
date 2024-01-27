import { StyleSheet, View } from "react-native";
import React from "react";
import { COLORS } from "../constants/COLORS";

export default function CustomCard({
  children,
  header,
  body,
  footer,
  style,
  width = 'auto',
  height = 'auto',
}) {
  return (
    <View style={[styles.card(width, height), style]}>
      {header}
      {body}
      {children}
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  card: (w, h) => ({
    width: w,
    height: h,
  }),
});
