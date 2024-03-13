import { View, Text } from "react-native";
import { AppImage, InputGroup } from "../../components";
import { useState } from "react";

export default function WalletDeposit({ navigation, onPayment }) {
  const [amount, setAmount] = useState("0");

  return (
    <View>
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
    </View>
  );
}
