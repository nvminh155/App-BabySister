import { View } from "react-native";

export default function Row({ children, style }) {
  return (
    <View style={[{ flexDirection: "row", alignItems: "center", columnGap: 15, marginTop: 10 }, style || ""]}>{children}</View>
  );
}
