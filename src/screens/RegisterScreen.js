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

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebase/config";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

import { Ionicons, MaterialIcons, AntDesign } from "react-native-vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import { COLORS } from "../constants/COLORS";

import {
  AppText,
  AppImage,
  InputField,
  CustomButton,
  AppSafeAreaView,
  InputGroup,
  Row,
  InputRadio,
} from "../components";
import { formatDateTime } from "../utils";

export default function RegisterScreen({ navigation }) {
  const [date, setDate] = useState(Date.now());
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("minhnv@gmail.com");
  const [password, setPassword] = useState("123456");
  const [fullName, setFullName] = useState("Nguyen Van Minh");
  const [phone, setPhone] = useState("0921219640");
  const [typeUser, setTypeUser] = useState(1);
  

  const returnDateTime = (timestamp) => {
    return timestamp ? new Date(timestamp) : new Date();
  };

  const handleSignup = () => {
    console.log(email, password);
    // return;
    if (email !== "" && password !== "") {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          const { user } = res;
          const docRef = await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            displayName: fullName,
            email,
            password,
            phone,
            dob: date,
            address: "",
            typeUser: 2,
            following: [],
            hitoryBooking: [],
            provider: "EmailPassword",
          });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 15 }}
      >
        <View style={{ alignItems: "center" }}>
          <AppImage
            width={380}
            height={250}
            source={require("images/bbst-2.png")}
          />
        </View>
        <AppText
          style={{
            fontFamily: "Roboto",
            fontSize: 28,
            fontWeight: "500",
            color: "#333",
            marginBottom: 30,
          }}
        >
          Đăng ký
        </AppText>

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
              name="lock-closed-outline"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          onChangeText={(text) => setPassword(text)}
          value={password}
          inputType={"password"}
        />

        <InputField
          label={"Số điện thoại"}
          icon={
            <AntDesign
              name="phone"
              size={20}
              color="#666"
              style={{ marginRight: 5 }}
            />
          }
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: 'center',
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 10,
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#666"
            style={{ marginRight: 5 }}
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <AppText style={{ marginLeft: 5, marginTop: 5 }}>
              {formatDateTime(date).DMY}
            </AppText>
          </TouchableOpacity>
        </View>

        {open && (
          <DateTimePicker
            value={date ?? Date.now()}
            mode="date"
            is24Hour={true}
            display="spinner"
            onChange={({ nativeEvent }) => {
              setOpen(false);
              setDate(nativeEvent.timestamp);
            }}
          />
        )}

        {/* <View>
          <AppText fontWeight={'bold'}>Bạn đăng ký làm ? </AppText>
          <Row style={{flexWrap: 'wrap'}}>
            <InputRadio edge={20} label={<AppText>Bảo Mẫu</AppText>} id={1} activeRadio={typeUser} onClick={(ticked) => {setTypeUser(ticked)}} />
            <InputRadio edge={20} label={<AppText>Phụ Huynh</AppText>} id={2} activeRadio={typeUser} onClick={(ticked) => {setTypeUser(ticked)}} />
            <InputRadio edge={20} label={<AppText>Bên Thứ 3</AppText>} id={3} activeRadio={typeUser} onClick={(ticked) => {setTypeUser(ticked)}} />
          </Row>
        </View> */}
        <CustomButton
          label={"Đăng ký"}
          onPress={handleSignup}
          style={{
            backgroundColor: COLORS.accent,
            paddingVertical: 15,
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
          <AppText>Bạn đã có tài khoản? </AppText>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AppText style={{ color: COLORS.accent, fontWeight: "700" }}>
              Đăng nhập
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppSafeAreaView>
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
