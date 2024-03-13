import { ScrollView, Text, View } from "react-native";
import { COLORS } from "../../constants/COLORS";
import { AppText } from "../../components";

export default function UserWalletScreen() {
  return (
    <ScrollView
      style={{
        backgroundColor: COLORS.background,
        paddingHorizontal: 10,
        paddingTop: 10,
      }}
    >
        <AppText>Hello, usser !!</AppText>
        <View id="wallet">
            <AppText>Số dư hiện tại</AppText>
            <AppText>0 VNĐ</AppText>
        </View>
    </ScrollView>
  );
}
