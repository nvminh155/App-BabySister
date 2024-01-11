import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import DatePicker from "react-native-date-picker";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebase/config";
import { addDoc, collection } from "firebase/firestore";

import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import RegistrationSVG from "../assets/images/misc/registration.svg";
import GoogleSVG from "../assets/images/misc/google.svg";
import FacebookSVG from "../assets/images/misc/facebook.svg";
import TwitterSVG from "../assets/images/misc/twitter.svg";

import { COLORS } from "../constants/COLORS";

export default function SignupScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [dobLabel, setDobLabel] = useState("Date of Birth");

  const [email, setEmail] = useState("minhnv@gmail.com");
  const [password, setPassword] = useState("123456");
  const [fullName, setFullName] = useState("Nguyen Van Minh");

  const handleSignup = () => {
    console.log(email, password);
    // return;
    if (email !== "" && password !== "") {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          const { user } = res;
          const docRef = await addDoc(collection(db, "users"), {
            uid: user.uid,
            displayName: fullName,
            email,
            password,
            following: [],
            provider: "EmailPassword",
          });

          navigation.navigate("Home");
          console.log("SIGNUP SUCCESS", user);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 15 }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.tinyLogo(380, 250)}
            source={require("../assets/images/bbst-2.png")}
          />
        </View>
        <Text
          style={{
            fontFamily: "Roboto",
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Register
        </Text>

        <InputField
          label={"Enter FullName"}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          onChangeText={(text) => setFullName(text)}
          value={fullName}
        />

        <InputField
          label={"Enter Email"}
          icon={
            <MaterialIcons
              name="alternate-email"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          onChangeText={(text) => setEmail(text)}
          value={email}
        />

        <InputField
          label={"Enter Password"}
          icon={
            <Ionicons
              name="ios-lock-closed-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          onChangeText={(text) => setPassword(text)}
          value={password}
          inputType={"password"}
        />

        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 30,
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={{ color: "#666", marginLeft: 5, marginTop: 5 }}>
              {dobLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          label={"Register"}
          onPress={handleSignup}
          style={{
            backgroundColor: COLORS.primary,
            padding: 20,
            borderRadius: 10,
            marginBottom: 30,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <Text>Already registered?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
              {" "}
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginVertical: 20,
  },
  signUp: {
    fontSize: 20,
    flexDirection: "row",
    marginTop: 20,
  },
  tinyLogo: (w, h) => ({
    width: w,
    height: h,
  }),
});
