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
     

      <ScrollView>
       <Text> ?Á?D:ẠDjasdjkl</Text>
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
