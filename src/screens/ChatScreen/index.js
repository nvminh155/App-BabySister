import { StatusBar } from "expo-status-bar";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import {
  addDoc,
  orderBy,
  collection,
  query,
  onSnapshot,
  or,
  where,
  getDocs,
  and,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { AuthContext } from "../../contexts/AuthProvider";

import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../../constants/COLORS";

import {
  AppImage,
  AppSafeAreaView,
  AppText,
  CustomCard,
} from "../../components";

export default function ChatScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const friends = [];
    for (var i = 0; i < 5; i++) {
      friends.push(`Nguyen Van ${i}`);
    }
    setFriends(friends);
  }, []);

  return (
    <AppSafeAreaView
      style={{
        width: "100%",
        height: "100%",
        paddingVertical: 20,
        paddingHorizontal: 10,
      }}
    >
      <View
        id="header"
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 70,
            fontWeight: 700,
            color: COLORS.text,
            fontSize: 20,
          }}
        >
          Hello ChatApp
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ rowGap: 20 }}>
        {friends.map((f, i) => (
          <TouchableOpacity
          key={i} 
            onPress={() => {
              navigation.navigate("ChatPrivate", {
                uid: "rCxZsTbDlbNqrjYkSQ6hythJttt2",
              });
            }}
          >
            <CustomCard
              header={
                <AppImage
                  width={50}
                  height={50}
                  source={require("../../assets/images/bbst_1.jpg")}
                  options={{ styles: { borderRadius: 25 } }}
                />
              }
              body={
                <View style={{}}>
                  <AppText style={{ fontWeight: "bold" }}>{f}</AppText>
                  <AppText style={{ color: "grey" }}>last message {i} </AppText>
                </View>
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 15,
              }}
            ></CustomCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({});
