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
import { AppSafeAreaView, AppText } from "../../components";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;
export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [listFollowing, setListFollowing] = useState(null);

  const [text, setText] = useState(
    "Bạn muốn nhờ người hỗ trợ ? Hãy gửi bài đăng kèm các yêu cầu của bạn ..."
  );
  useEffect(() => {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, (ref) => ref.orderBy("uid", "desc"));
    const unsubcribe = onSnapshot(q, (snapshot) => {
      const snapshotMap = snapshot.docs.map((doc) => ({
        displayName: doc.data().displayName,
        uid: doc.data().uid,
        _id: doc.id,
      }));
      setListFollowing(
        snapshotMap.filter((doc) =>
          user.following.find((uid) => uid === doc.uid)
        )
      );
    });
    return unsubcribe;
  }, []);

  return (
    <AppSafeAreaView
      style={{
        paddingHorizontal: 10,
        backgroundColor: COLORS.background,
        height: "100%",
      }}
    >
      <View id="header" style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}
        >
          <Ionicons name="sunny-outline" size={24} color={"yellow"} />
          <AppText style={{ fontWeight: "bold" }}>{user.displayName} !</AppText>
        </View>
        <View>
          <Ionicons name="search" size={24} />
        </View>
      </View>

      <ScrollView>
        <View style={{ borderWidth: 1, borderColor: "black", marginTop: 10 }}>
          <AppImage
            width={359}
            height={153}
            source={require("../../assets/images/stay-home-take-care.png")}
          />
        </View>

        <View style={[styles.walletAndGift, { paddingHorizontal: 40 }]}>
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
        </View>

        <View>
          <AppText
            style={{ fontWeight: "bold", marginBottom: 10, fontSize: 17 }}
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
              navigation.navigate("PostSearch");
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

        <View>
          <AppText
            style={{ fontWeight: "bold", marginBottom: 10, fontSize: 17 }}
          >
            Gần nhà bạn
          </AppText>

          <ScrollView style={{ flexDirection: "row" }} horizontal={true}>
            {[1, 2, 3].map((v, i) => {
              const header = (
                <View key={i}>
                  <AppImage
                    width={"100%"}
                    height={50}
                    options={{
                      styles: { borderColor: "black", borderWidth: 1 },
                    }}
                    source={require("../../assets/images/stay-home-take-care.png")}
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
                  header={header}
                  body={body}
                  footer={footer}
                  style={{ width: wWidth / 2, height: 200 }}
                />
              );
            })}
          </ScrollView>
        </View>

        <View id="list-followindg">
          {listFollowing &&
            listFollowing.map((f) => (
              <TouchableOpacity
                key={f.uid}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "black",
                  paddingVertical: 5,
                  paddingHorizontal: 3,
                }}
                onPress={() => navigation.navigate("Chat", f)}
              >
                <AppImage
                  width={35}
                  height={35}
                  options={{
                    styles: { borderRadius: 17 },
                  }}
                  source={{
                    uri: "https://png.pngtree.com/thumb_back/fw800/background/20230523/pngtree-sad-pictures-for-desktop-hd-backgrounds-image_2690576.jpg",
                  }}
                />
                <View
                  style={{
                    rowGap: 5,
                  }}
                >
                  <AppText style={{ color: "blue", fontWeight: "bold" }}>
                    {f.displayName}
                  </AppText>
                  <AppText>Last Message</AppText>
                </View>
              </TouchableOpacity>
            ))}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <AppText>GO TO CHAT</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await signOut(auth).catch((err) => console.log(err));
          }}
        >
          <AppText>SIGN OUT</AppText>
        </TouchableOpacity>
      </ScrollView>
    </AppSafeAreaView>
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
});
