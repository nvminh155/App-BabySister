
import {
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";


export default function AppSafeAreaView ({ children, style }) {
  return (
    <SafeAreaView style={[{ paddingHorizontal: 10, height: '100%', width: '100%'}, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
