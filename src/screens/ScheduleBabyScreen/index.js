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
  Modal,
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

import DateTimePicker from "@react-native-community/datetimepicker";

import { MaterialIcons, Ionicons } from "react-native-vector-icons";

import { COLORS } from "../../constants/COLORS";

import {
  CustomButton,
  AppImage,
  AppText,
  InputGroup,
  CustomModal,
  InputField,
  CustomCard,
  AppSafeAreaView
} from "../../components";

export default function ScheduleBabyScreen({ navigation }) {
  const bodyCardSchedule = (text) => (
    <View>
      <AppText style={{ fontWeight: "bold" }}>{text}</AppText>
      <AppText style={{ color: "grey" }}>Ngày tạo : 11/12/2014</AppText>
    </View>
  );

  const footerCardSchedule = () => (
    <View>
      <CustomButton
        label={"Xem"}
        style={{
          backgroundColor: COLORS.accent,
          paddingHorizontal: 15,
        }}
        onPress={() => {navigation.navigate("ViewSchedule")}}
      />
    </View>
  );
  return (
    <AppSafeAreaView style={{ height: "100%", width: "100%" }}>
      <View id="header" style={{ paddingHorizontal: 10 }}>
        <CustomButton
          label={"Thêm mới"}
          style={{
            paddingHorizontal: 0
          }}
          styleText={{
            fontWeight: 700,
            color: COLORS.accent,
            fontSize: 17,
            marginLeft: "auto",
          }}
          onPress={() => {navigation.navigate('addSchedule')}}
        />
      </View>

      <View id="contains-schedules" style={{ marginTop: 30, rowGap: 20 }}>
        {Array.from({ length: 3 }).map((v, i) => (
          <View key={i}>
            <CustomCard
              body={bodyCardSchedule(`Be Nguyen Van ${i}`)}
              footer={footerCardSchedule()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            />
          </View>
        ))}
      </View>
            
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <AppImage
          width={64}
          height={64}
          source={require("../../assets/images/empty_data.png")}
        />
        <AppText style={{ marginTop: 10 }}>Chưa có dữ liệu</AppText>
      </View>
      
    </AppSafeAreaView>
  );
}
