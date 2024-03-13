import { View } from "react-native";
import { AppImage, AppText, CustomButton, CustomModal } from "../../components";
import { COLORS } from "../../constants/COLORS";

export default function SuccessPayment({navigation, route}) {
  return (
    <CustomModal
      footer={
        <CustomButton
          label={"Hoàn tất"}
          style={{
            backgroundColor: COLORS.accent,
          }}
          onPress={() => {
            route.params?.onGoBack(200);
          }}
        />
      }
    >
      <View
        style={{ alignItems: "center", justifyContent: "center", rowGap: 15 }}
      >
        <AppImage
          width={64}
          height={64}
          source={require("images/checked.png")}
        />
        <AppText color={COLORS.accent} fontSize={18} fontWeight={600}>
          Thanh toán thành công
        </AppText>
        <AppText color={"grey"}>Cảm ơn bạn đã sử dụng dịch vụ</AppText>
      </View>
    </CustomModal>
  );
}
