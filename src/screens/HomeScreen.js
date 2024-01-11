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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// FIRE BASE
import { auth } from "../firebase/config";
import { db } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  getDocs,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";

// CONTEXT
import { AuthContext } from "../contexts/AuthProvider";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import CustomButton from "../components/CustomButton";
import CustomCard from "../components/CustomCard";

import { COLORS } from "../constants/COLORS";

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
    <SafeAreaView
      style={{
        paddingHorizontal: 10,
        backgroundColor: COLORS.background,
        height: "100%",
      }}
    >
      <ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}
          >
            <Ionicons name="sunny-outline" size={24} color={"yellow"} />
            <Text style={{ fontWeight: "bold" }}>{user.displayName} !</Text>
          </View>
          <View>
            <Ionicons name="search" size={24} />
          </View>
        </View>

        <View style={{ borderWidth: 1, borderColor: "black", marginTop: 10 }}>
          <Image
            style={styles.tinyLogo(359, 153)}
            source={require("../assets/images/stay-home-take-care.png")}
          />
        </View>

        <View style={styles.walletAndGift}>
          <View id="Vi BSPAY">
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="wallet" />
              <Text style={{ fontSize: 15 }}>Ví BSPay</Text>
            </View>
            <Text>800.000 VNĐ</Text>
          </View>
          <View
            style={{ width: 1, backgroundColor: "black", height: "100%" }}
          ></View>
          <View id="uu dai">
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="gift" />
              <Text style={{ fontSize: 15 }}>Ưu Đãi</Text>
            </View>
            <Text>Chưa có ưu đãi nào</Text>
          </View>
        </View>

        <View>
          <Text style={{ fontWeight: "bold", marginBottom: 10, fontSize: 17 }}>
            Đăng bài tìm kiếm
          </Text>
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
            }}
          />
          <CustomButton
            label={"Đăng Ngay"}
            onPress={() => {}}
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 10,
              borderRadius: 10,
              marginBottom: 30,
              width: 100,
              marginLeft: "auto",
              marginTop: 10,
              paddingHorizontal: 10,
            }}
          />
        </View>

        <View>
          <Text style={{ fontWeight: "bold", marginBottom: 10, fontSize: 17 }}>
            Gần nhà bạn
          </Text>

          <ScrollView style={{ flexDirection: "row" }} horizontal={true}>
            {[1, 2, 3].map((v, i) => {
              const header = (
                <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={[
                      styles.tinyLogo(100, 50),
                      { borderColor: "black", borderWidth: 1 },
                    ]}
                    source={require("../assets/images/stay-home-take-care.png")}
                  />
                </View>
              );

              const body = (
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{fontWeight:'bold'}}>Họ và Tên: </Text>
                    <Text ellipsizeMode="tail" numberOfLines={1}>
                      Nguyễn Văn A{" "}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{fontWeight:'bold'}}>Địa chỉ: </Text>
                    <Text ellipsizeMode="tail" numberOfLines={1}>
                      322/9 Huỳnh Văn Lũy, Phú Lợi, Thủ Dầu Một, Bình Dương{" "}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{fontWeight:'bold'}}>4.7 *****</Text>
                  </View>
                </View>
              );

              const footer = 
                (<CustomButton
                
                    label={"Thông Tin"}
                    onPress={() => {navigation.navigate('InfoSister')}}
                    style={{
                      backgroundColor: COLORS.primary,
                      padding: 2,
                      borderRadius: 7,
                      paddingHorizontal: 7,
                      marginLeft: 'auto'
                    }}
                  />
              );
              return <CustomCard header={header} body={body} footer={footer} />;
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
                <Image
                  style={[styles.tinyLogo(35, 35), { borderRadius: 17 }]}
                  source={{
                    uri: "https://png.pngtree.com/thumb_back/fw800/background/20230523/pngtree-sad-pictures-for-desktop-hd-backgrounds-image_2690576.jpg",
                  }}
                />
                <View
                  style={{
                    rowGap: 5,
                  }}
                >
                  <Text style={{ color: "blue", fontWeight: "bold" }}>
                    {f.displayName}
                  </Text>
                  <Text>Last Message</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Text>GO TO CHAT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            await signOut(auth).catch((err) => console.log(err));
          }}
        >
          <Text>SIGN OUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    borderRadius: 15,
    elevation: 10,
    width: 320,
    alignSelf: "center",
    marginTop: -15,
    marginBottom: 25,
  },
});
