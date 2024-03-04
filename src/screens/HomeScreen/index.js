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
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";

// FIRE BASE
import { auth, db } from "../../firebase/config";
import { signOut } from "firebase/auth";
import {
  getDocs,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";

// CONTEXT
import { AuthContext } from "../../contexts/AuthProvider";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import CustomButton from "../../components/CustomButton";
import CustomCard from "../../components/CustomCard";
import AppImage from "../../components/AppImage";

import { COLORS } from "../../constants/COLORS";
import { AppSafeAreaView, AppText, Row } from "../../components";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

import * as ImagePicker from "expo-image-picker";
import { storage } from "../../firebase/config";
import { uploadImage } from "../../utils";

import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  console.log("🚀 ~ HomeScreen ~ image:", image);
  const [imageName, setImageName] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState(
    "Bạn muốn nhờ người hỗ trợ ? Hãy gửi bài đăng kèm các yêu cầu của bạn ..."
  );

  const saveImage = async () => {
    if (!image) return;

    const fetchUri = await fetch(image.uri);
    const theBlob = await fetchUri.blob();

    const storageRef = ref(storage, `images/${imageName}`);
    await uploadBytes(storageRef, theBlob).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
    });
  };
  // const uploadImage = async () => {
  //   await ImagePicker.requestCameraPermissionsAsync();
  //   let result = await ImagePicker.launchCameraAsync({
  //     cameraType: ImagePicker.CameraType.front,
  //     allowsEditing: true,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setImage(result.assets[0]);
  //   }
  // };

  const dowloadURL = async () => {
    await uploadImage("camera").then( (result) => {
      console.log("🚀 ~ awaituploadImage ~ result:", result);
    });
    
  };
  return (
    <View
      style={{
        paddingHorizontal: 10,
        backgroundColor: COLORS.background,
        height: "100%",
      }}
    >
      <ScrollView>
        <View style={{ borderWidth: 1, borderColor: "black", marginTop: 10 }}>
          <AppImage
            width={359}
            height={153}
            source={require("images/stay-home-take-care.png")}
          />
        </View>

        {/* <View style={[styles.walletAndGift, { paddingHorizontal: 40 }]}>
          <View id="Vi BSPAY">
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="wallet" />
              <AppText>Ví BSPay</AppText>
            </View>
            <AppText>800.000 VNĐ</AppText>
          </View>
          <View
            style={{ width: 1, backgroundColor: "black", height: "100%" }}
          ></View>
          <View id="uu dai">
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="gift" />
              <AppText style={{ fontSize: 15 }}>Ưu Đãi</AppText>
            </View>
            <AppText>Chưa có ưu đãi nào</AppText>
          </View>
        </View> */}

        <View>
          <AppText
            style={{
              fontWeight: "bold",
              marginBottom: 10,
              marginTop: 30,
              fontSize: 17,
            }}
          >
            Đăng bài tìm kiếm
          </AppText>
          <TextInput
            value={text}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => {
              setText(text);
            }}
            editable={false}
            style={{
              borderWidth: 1,
              borderColor: "grey",
              borderRadius: 5,
              paddingHorizontal: 10,
              fontSize: 15,
              backgroundColor: COLORS.secondary,
              elevation: 10,
            }}
          />
          <CustomButton
            label={"Đăng Ngay"}
            onPress={() => {
              navigation.navigate("PostSearch", { user });
            }}
            style={{
              backgroundColor: COLORS.accent,
              marginBottom: 30,
              width: 100,
              marginLeft: "auto",
              marginTop: 10,
            }}
          />
        </View>

        {/* gan nha ban */}
        {/* <View>
          <AppText
            style={{ fontWeight: "bold", marginBottom: 10, fontSize: 17 }}
          >
            Gần nhà bạn
          </AppText>

          <ScrollView style={{ flexDirection: "row" }} horizontal={true}>
            {[1, 2, 3].map((v, i) => {
              const header = (
                <View>
                  <AppImage
                    width={"100%"}
                    height={50}
                    options={{
                      styles: { borderColor: "black", borderWidth: 1 },
                    }}
                    source={require("images/stay-home-take-care.png")}
                  />
                </View>
              );

              const body = (
                <View style={{ maxWidth: wWidth / 2 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AppText style={{ fontWeight: "bold" }}>
                      Họ và Tên:{" "}
                    </AppText>
                    <AppText ellipsizeMode="tail" numberOfLines={1}>
                      Nguyễn Văn A{" "}
                    </AppText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AppText style={{ fontWeight: "bold" }}>Địa chỉ: </AppText>
                    <AppText ellipsizeMode="tail" numberOfLines={1}>
                      322/9 Huỳnh Văn Lũy, Phú Lợi, Thủ Dầu Một, Bình Dương{" "}
                    </AppText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AppText style={{ fontWeight: "bold" }}>4.7 *****</AppText>
                  </View>
                </View>
              );

              const footer = (
                <CustomButton
                  label={"Thông Tin"}
                  onPress={() => {
                    navigation.navigate("InfoSister");
                  }}
                  style={{
                    backgroundColor: COLORS.accent,
                    marginLeft: "auto",
                  }}
                />
              );
              return (
                <CustomCard
                key={i}
                  header={header}
                  body={body}
                  footer={footer}
                  style={{ width: wWidth / 2, height: 200 }}
                />
              );
            })}
          </ScrollView>
        </View> */}
        <View>
          {url && <Image width={200} height={200} source={{ uri: url }} />}
          <CustomButton
            label={"Camera"}
            style={{ backgroundColor: COLORS.accent }}
            onPress={() => {
              // uploadImage();
              dowloadURL();
            }}
          />

          {image && (
            <View>
              <Image
                source={{ uri: image.uri }}
                style={{ width: 200, height: 200, resizeMode: "contain" }}
              />

              <Row>
                <TextInput
                  value={imageName}
                  onChangeText={setImageName}
                  style={{
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                />
                <CustomButton
                  label={"Lưu"}
                  onPress={() => {
                    saveImage();
                  }}
                />
              </Row>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={async () => {
            await signOut(auth).catch((err) => console.log(err));
          }}
        >
          <AppText>SIGN OUT</AppText>
        </TouchableOpacity>

        <CustomButton label={"Test notification"} style={{
          backgroundColor: COLORS.accent,
          
        }} onPress={() => {
          navigation.navigate("Test_notification");
        }} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: (w, h) => ({
    width: w,
    height: h,
  }),
  walletAndGift: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 40,
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    borderRadius: 15,
    elevation: 10,
    width: 330,
    alignSelf: "center",
    marginTop: -15,
    marginBottom: 25,
    paddingHorizoltal: 10,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
});
