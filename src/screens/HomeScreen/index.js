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

import messaging from "@react-native-firebase/messaging";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  console.log("🚀 ~ HomeScreen ~ image:", image);
  const [imageName, setImageName] = useState("");
  const [url, setUrl] = useState("");
  const [pass, setPass] = useState("");
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
    await uploadImage("camera").then((result) => {
      console.log("🚀 ~ awaituploadImage ~ result:", result);
    });
  };

  async function requestPermission() {
    const authStatus = await messaging().requestPermission();

    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL;

    if(enabled) {
      getFcmToken();
    }
  }
  async function getFcmToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    if(!fcmToken) {
      try {
        const token = await messaging().getToken();
        console.log(token)

        if(token) {
          await AsyncStorage.setItem('fcmToken', token);
        }
      } catch (err) {
        console.log("An error occurred while getting a token");
      
      }
    }
  }

  const [token, setToken] = useState("");
  useEffect(() => {
    requestPermission();
    getTokenFromAsyncStorage()
  }, [])

  const getTokenFromAsyncStorage = async () => {
    const token = await AsyncStorage.getItem("fcmToken");
    if(token) setToken(token);
  }
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
              marginLeft: "auto",
              marginTop: 10,
              paddingHorizoltal: 10,
              paddingVertical: 15
            }}
          />
        </View>

   

 
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
