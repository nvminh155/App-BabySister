import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  AppImage,
  AppSafeAreaView,
  AppText,
  CustomButton,
  CustomCard,
  Group,
  InputGroup,
} from "../../components";
import { useLayoutEffect, useState } from "react";
import { formatMoney } from "../../utils";
import { COLORS } from "../../constants/COLORS";
import { createURL } from "./createURL";

export default function CreatePayment({ navigation, route }) {
  console.log("🚀 ~ CreatePayment ~ route:", route);
  const [selectedMethod, setSelectedMethod] = useState(-1);
  const [amount, setAmount] = useState(route.params?.amount ?? "0");
  const  paymentType  = route.params?.paymentType;

  const dataAtm = [
    { name: "Ví BSPay", fee: "Miễn phí giao dịch", code: "BSP", id: 1 },
    { name: "Thẻ ATM", fee: "Miễn phí giao dịch", code: "ATM", id: 2 },
  ];

  useLayoutEffect(() => {
 
  }, []);
  const handlePayment = () => {
    if (selectedMethod === "ATM") {
      const url = createURL(amount);
      navigation.navigate("ShowPayment", {
        linkPayment: url,
        onGoBack: route.params?.onGoBack,
      });
    }
  };
  return (
    <View style={{ paddingHorizontal: 15, marginTop: 30, flex: 1 }}>
      <InputGroup
        label={<AppText>Số tiền</AppText>}
        inputMode={"numeric"}
        row={true}
        value={formatMoney(amount)}
        onChangeText={(text) => setAmount(text.replaceAll(".", ""))}
        iconAfter={
          <AppImage
            width={24}
            height={24}
            source={require("images/dong.png")}
          />
        }
      />
      <Group
        label={
          <AppText
            fontSize={20}
            fontWeight={"bold"}
            style={{ marginBottom: 20 }}
          >
            Chọn phương thức thanh toán
          </AppText>
        }
      >
        <View style={{ rowGap: 20 }}>
          {dataAtm.map((atm, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedMethod(atm.code);
              }}
              style={{
                backgroundColor: COLORS.secondary,
                padding: 10,
                borderRadius: 13,
                display: `${paymentType === "BSP" && index === 0 ? "none" : ""}`
              }}
            >
              <CustomCard
                header={
                  <AppImage
                    width={32}
                    height={32}
                    source={require("images/atm_card.png")}
                  />
                }
                body={
                  <View>
                    <AppText fontWeight={"bold"} fontSize={17}>
                      {atm.name}
                    </AppText>
                    <AppText style={{ color: "grey" }}>{atm.fee}</AppText>
                  </View>
                }
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 15,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                  },
                  atm.code === selectedMethod ? styles.activeMethod : null,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </Group>

      <CustomButton
        label={
          <AppText fontSize={20} style={{ color: "white", fontWeight: "bold" }}>
            Thanh Toán
          </AppText>
        }
        style={{
          backgroundColor: COLORS.accent,
          paddingVertical: 15,
          marginTop: "auto",
          marginBottom: 20,
        }}
        onPress={handlePayment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  activeMethod: {
    borderColor: COLORS.accent,
    borderWidth: 1,
    borderRadius: 13,
  },
});
