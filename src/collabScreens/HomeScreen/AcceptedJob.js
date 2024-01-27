// REACT ( NATIVE )
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";

import { useContext, useState } from "react";

// FIRE BASE

// CONTEXT
import { AuthContext } from "../../contexts/AuthProvider";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../../constants/COLORS";

import {
  AppSafeAreaView,
  AppText,
  AppImage,
  CustomCard,
  CustomButton,
  Row,
} from "../../components";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [listFollowing, setListFollowing] = useState(null);

  const headerCardInfoJob = () => {
    return (
      <View>
        <Row style={{marginTop: 0, marginBottom: 10, marginLeft: 'auto'}}>
          <AppText color={COLORS.textDanger}  >Chưa Hoàn Thành</AppText>
        </Row>
        <View>
          <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
            DỌN DẸP NHÀ - QUẬN 7
          </AppText>
          <AppText style={{ fontSize: 15 }}>
            Bắt đầu vào lúc:{" "}
            <AppText
              style={{ color: COLORS.accent, fontSize: 17, fontWeight: "bold" }}
            >
              Ngày mai lúc 10:00
            </AppText>
          </AppText>
        </View>
      </View>
    );
  };

  const bodyCardInfoJob = () => {
    return (
      <View style={{ rowGap: 5, paddingHorizontal: 10 }}>
        <View
          id="benifit"
          style={{
            flexDirection: "row",
            borderWidth: 0.5,
            borderColor: "grey",
            borderRadius: 5,
            padding: 10,
            justifyContent: "space-around",
          }}
        >
          <View id="time" style={{ alignItems: "center" }}>
            <AppText>Làm trong</AppText>
            <AppText color={COLORS.accent} fontWeight="bold" fontSize={20}>
              2h
            </AppText>
          </View>

          <View id="money" style={{ alignItems: "center" }}>
            <AppText>Số tiền(VND)</AppText>
            <AppText color={COLORS.accent} fontWeight="bold" fontSize={20}>
              100,000
            </AppText>
          </View>
        </View>

        <View id="address" style={{ flexDirection: "row" }}>
          <AppText>Tại: </AppText>
          <AppText fontWeight={"bold"}>
            322/41 Huỳnh Văn Lũy, Phú Lợi, Thủ Dầu Một, Bình Dương
          </AppText>
        </View>
        <View id="note-from-customer" style={{ flexDirection: "row" }}>
          <AppText>Ghi chú: </AppText>
          <AppText style={{ fontWeight: "bold" }}>15b 03 sky garden 2</AppText>
        </View>
      </View>
    );
  };

  const footerCardInfoJob = () => {
    return (
      <View>
        <CustomButton
          label={"XEM LẠI CÔNG VIỆC"}
          style={{
            backgroundColor: COLORS.accent,
            alignSelf: "center",
            width: "max-content",
          }}
          onPress={() => {
            navigation.navigate("ViewJob");
          }}
        />
      </View>
    );
  };
  return (
    <ScrollView
      style={{ paddingHorizontal: 10, marginTop: 20, marginBottom: 20 }}
      contentContainerStyle={{ rowGap: 15 }}
    >
      {Array.from({ length: 5 }).map((v, i) => (
        <CustomCard
          key={i}
          header={headerCardInfoJob()}
          body={bodyCardInfoJob()}
          footer={footerCardInfoJob()}
          style={{
            rowGap: 15,
            backgroundColor: "white",
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        />
      ))}
    </ScrollView>
  );
}
