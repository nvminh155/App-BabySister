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

import { useContext, useLayoutEffect, useState } from "react";

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
  InputGroup,
  InputRadio,
} from "../../components";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function UserScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [gender, setGender] = useState(1);
  const [editAble, setEditAble] = useState(false);
  console.log(editAble);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CustomButton
          label={editAble ? "Hủy chỉnh sửa" : "Chỉnh Sửa"}
          style={{ marginTop: 0 }}
          styleText={{ color: COLORS.accent }}
          onPress={() => {
            setEditAble(!editAble);
          }}
        />
      ),
    });
  }, [editAble]);
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <CustomCard
        style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
        header={
          <Row style={{ justifyContent: "center" }}>
            <AppImage
              width={100}
              height={100}
              source={require("images/bbst_1.jpg")}
            />
            <CustomButton
              label={"Chỉnh sửa ảnh"}
              style={{ position: "absolute", bottom: -10 }}
            />
          </Row>
        }
        body={
          <View style={{ alignItems: "flex-start" }}>
            <AppText fontWeight={"bold"} fontSize={20}>
              {user.displayName}
            </AppText>
            <Row>
              <AppImage
                width={32}
                height={32}
                source={require("images/collab.png")}
              />

              <AppText fontSize={20}>
                {user.typeUser === 1 ? "Cộng Tác Viên" : "Phụ Huynh"}
              </AppText>
            </Row>
          </View>
        }
      />

      <View style={{ marginTop: 40 }}>
        <InputGroup
          label={<AppText>Email</AppText>}
          row={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
          colorTextInput={!editAble ? "black" : null}
          readOnly={!editAble}
          styleRoot={{ columnGap: 30 }}
        />
        <InputGroup
          label={<AppText>Số điện thoại</AppText>}
          row={true}
          value={phone}
          onChangeText={(text) => setPhone(text)}
          colorTextInput={!editAble ? "black" : null}
          readOnly={!editAble}
          styleRoot={{ columnGap: 30 }}
        />
        <Row id="gender">
          {["Nam", "Nữ", "other"].map((val, index) => (
            <InputRadio
              key={index}
              edge={20}
              label={<AppText>{val}</AppText>}
              id={index}
              activeRadio={gender}
            />
          ))}
        </Row>

        <Row>
          <InputGroup
            label={<AppText>Địa chỉ</AppText>}
            row={true}
            value={"??"}
            colorTextInput={!editAble ? "black" : null}
            readOnly={!editAble}
            styleRoot={{ columnGap: 30 }}
          />
          <TouchableOpacity
            onPress={() => {
              console.log(123);
              setShowMap(true);
            }}
            id="address-map"
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <AppImage
              width={32}
              height={32}
              source={require("images/map.png")}
            />
            <AppText fontWeight={"bold"}>ĐẶT VỊ TRÍ</AppText>
          </TouchableOpacity>
        </Row>
      </View>

      {editAble && (
        <CustomButton
          label={"Lưu"}
          style={{ backgroundColor: COLORS.accent, paddingVertical: 15 }}
          styleText={{ fontSize: 20 }}
        />
      )}
    </View>
  );
}
