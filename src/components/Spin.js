

import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native";
export default function Spin() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
