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

import { useCallback, useContext, useLayoutEffect, useState } from "react";

// FIRE BASE

// CONTEXT
import { AuthContext } from "../../contexts/AuthProvider";

import { Ionicons, AntDesign, FontAwesome } from "react-native-vector-icons";

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
import SelectAddress from "../MapScreen/SelectAddress";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { signOut } from "firebase/auth";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function UserScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [address, setAddress] = useState(user.address ?? "");
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [gender, setGender] = useState(1);
  const [bio, setBio] = useState(user.bio ?? "");
  const [editAble, setEditAble] = useState(false);
  const [showWalletAction, setShowWalletAction] = useState(false);

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

  const handleSelectAddress = useCallback((data) => {
    setAddress(data.text);
  }, []);

  const updateProfile = useCallback(async () => {
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      gender,
      address,
      phone,
      bio,
    });
    setEditAble(false);
  }, [address]);
  return (
    <ScrollView
      style={{
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      {showMap && (
        <View
          style={{
            height: "100%",
            position: "absolute",
            flex: 1,
            zIndex: 10000,
            top: 0,
            right: 0,
            left: 0,
          }}
        >
          <SelectAddress
            onSelectAddress={handleSelectAddress}
            setShowMap={setShowMap}
          />
        </View>
      )}

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

      <View style={{ marginTop: 40, rowGap: 10 }}>
        <View>
          <TouchableOpacity
            style={{
              marginBottom: 15,
              flexDirection: "row",
              columnGap: 10,
              alignItems: "center",
            }}
            onPress={() => {
              setShowWalletAction(!showWalletAction);
            }}
          >
            <AppImage
              width={32}
              height={32}
              source={require("images/wallet.png")}
            />
            <AppText fontSize={20}>Ví BSPay</AppText>
            <AntDesign name="down" size={24} style={{ marginLeft: "auto" }} />
          </TouchableOpacity>

          {showWalletAction && (
            <Row id="actions">
              <CustomButton
                label={"Nạp tiền"}
                style={{ backgroundColor: COLORS.accent }}
                icon={<AntDesign name="plus" size={24} color={"white"} />}
                onPress={() => {
                  navigation.navigate("UserPaymentStack", {
                    paymentType: "BSP",
                    onGoBack: async (code) => {
                      if (code === 500) return;

                      navigation.reset({
                        index: 0,
                        routes: [{ name: "UserScreen" }],
                      });
                    },
                  });
                }}
              />
              <CustomButton
                label={"Các giao dịch"}
                style={{ backgroundColor: "#68A2D4" }}
                icon={<FontAwesome name="exchange" size={24} color={"white"} />}
              />
            </Row>
          )}
        </View>

        <InputGroup
          label={<AppText>Email</AppText>}
          row={true}
          value={email}
          placeholder={"Nhập email của bạn"}
          onChangeText={(text) => setEmail(text)}
          colorTextInput={!editAble ? "black" : null}
          readOnly={!editAble}
          styleRoot={{ columnGap: 30 }}
        />
        <InputGroup
          label={<AppText>Số điện thoại</AppText>}
          row={true}
          value={phone}
          placeholder={"Nhập số điện thoại của bạn"}
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
              onClick={() => {
                if (editAble) {
                  setGender(index);
                }
              }}
            />
          ))}
        </Row>

        <Row>
          <InputGroup
            label={<AppText>Địa chỉ</AppText>}
            row={true}
            value={address}
            // onChangeText={(text) => setAddress(text)}
            placeholder={"Chọn địa chỉ của bạn"}
            colorTextInput={!editAble ? "black" : null}
            readOnly={!editAble}
            styleRoot={{ columnGap: 30, flex: 1 }}
          />
          <TouchableOpacity
            disabled={!editAble}
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

        <InputGroup
          label={<AppText>Mô tả</AppText>}
          row={true}
          value={bio}
          placeholder={"Mô tả về bạn"}
          onChangeText={(text) => setBio(text)}
          colorTextInput={!editAble ? "black" : null}
          readOnly={!editAble}
          styleRoot={{ columnGap: 30 }}
        />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            columnGap: 15,
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 20,
          }}
          onPress={async () => {
            await signOut(auth).catch((err) => console.log(err));
          }}
        >
          <AppImage
            width={24}
            height={24}
            source={require("images/logout.png")}
          />
          <AppText fontSize={17}>Đăng Xuất</AppText>
        </TouchableOpacity>
      </View>

      {editAble && (
        <CustomButton
          label={"Lưu"}
          style={{ backgroundColor: COLORS.accent, paddingVertical: 15 }}
          styleText={{ fontSize: 20 }}
          onPress={updateProfile}
        />
      )}
    </ScrollView>
  );
}
