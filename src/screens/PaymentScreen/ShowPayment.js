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

import {WebView} from "react-native-webview";
import { useEffect, useRef, useState } from "react";
import Spin from "../../components/Spin";
import  SuccessPayment  from "./SuccessPayment";

export default function ShowPayment({ navigation, route }) {
  console.log("🚀 ~ ShowPayment ~ route:", route);
  const [linkPayment, setLinkPayment] = useState(
    route.params?.linkPayment ??
      `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1806000&vnp_Command=pay&vnp_CreateDate=20210801153333&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+%3A5&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fdomainmerchant.vn%2FReturnUrl&vnp_TmnCode=DEMOV210&vnp_TxnRef=5&vnp_Version=2.1.0&vnp_SecureHash=3e0d61a0c0534b2e36680b3f7277743e8784cc4e1d68fa7d276e79c23be7d6318d338b477910a27992f5057bb1582bd44bd82ae8009ffaf6d141219218625c42`
  );
  const paymentWeb = useRef();
  console.log("🚀 ~ ShowPayment ~ linkPayment:", linkPayment);

  return (
    <>
      {linkPayment !== "success" && <WebView
      ref={paymentWeb}
      source={
        
          {
              uri: linkPayment,
            }
      }
      renderLoading={<Spin />}
      onNavigationStateChange={(e) => {
        console.log("nav chagne", e);
        if (e.url.includes("example")) {
          setLinkPayment("success");
        }
      }}
      style={{ flex: 1 }}
    />}

    {linkPayment === "success" && <SuccessPayment navigation={navigation} route={route}/>}
    </>
  );
}
