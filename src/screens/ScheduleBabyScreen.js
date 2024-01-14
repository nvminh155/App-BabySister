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
import { db } from "../firebase/config";
import { AuthContext } from "../contexts/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
// import moment from "moment";
// require("moment/locale/vi");

import DateTimePicker from "@react-native-community/datetimepicker";

import { MaterialIcons, Ionicons } from "react-native-vector-icons";

import { COLORS } from "../constants/COLORS";

import {
  CustomButton,
  AppImage,
  AppText,
  InputGroup,
  CustomModal,
  InputField,
} from "../components";

export default function ScheduleBabyScreen({ navigation }) {
  const [visiableModalAdd, setVisiableModalAdd] = useState(false);
  const [showTimeModalAdd, setShowTimeModalAdd] = useState(false);
  const [timeModalAdd, setTimeModalAdd] = useState(new Date());

  const headerModalAdd = (
    <View>
      <AppText style={{ fontWeight: "bold" }}>Thêm mới mốc thời gian</AppText>
    </View>
  );
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        paddingHorizontal: 10,
        height: "100%",
        flex: 1,
      }}
    >
      <View id="header" style={{ flexDirection: "row", alignItems: "center" }}>
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
          QUẢN LÝ LỊCH BIỂU
        </Text>
      </View>

      <InputGroup
        label={
          <AppText id="label" style={{ fontWeight: "bold" }}>
            Họ và Tên :
          </AppText>
        }
        row={true}
        placeholder="Nhập tên ..."
        styleInput={{ backgroundColor: "white", flex: 1 }}
      />

      <InputGroup
        label={
          <AppText id="label" style={{ fontWeight: "bold" }}>
            Tuổi :
          </AppText>
        }
        row={true}
        placeholder="Nhập tuổi ..."
        styleInput={{ backgroundColor: "white", flex: 1 }}
      />

      <View>
        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
        >
          <AppText style={{ fontWeight: "bold" }}>Các Khung giờ</AppText>
          <TouchableOpacity
            onPress={() => {
              setVisiableModalAdd(true);
            }}
          >
            <Ionicons
              name="add"
              size={30}
              style={{ backgroundColor: "blue", color: "white" }}
            />
          </TouchableOpacity>
        </View>
        <CustomModal header={headerModalAdd} modalVisible={!visiableModalAdd}>
          <View
            style={{
              paddingVertical: 0,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 10,
              marginTop: 10,
            }}
          >
            <AppText style={{ fontWeight: "bold" }}>Giờ / Phút :</AppText>
            <CustomButton
              label={timeModalAdd.toTimeString().split(" ")[0]}
              style={{
                backgroundColor: "#f5f5f5",
                paddingVertical: 4,
                paddingHorizontal: 5,
              }}
              styleText={{ color: "black" }}
              onPress={() => {
                setShowTimeModalAdd(true);
              }}
            />
          </View>
          {showTimeModalAdd && (
            <DateTimePicker
              value={timeModalAdd}
              mode="time"
              is24Hour={true}
              onChange={({ nativeEvent }) => {
                setShowTimeModalAdd(false);
                setTimeModalAdd(new Date(nativeEvent.timestamp));
              }}
            />
          )}
          <InputGroup
            label={<AppText style={{ fontWeight: "bold" }}>Ghi Chú</AppText>}
            row={true}
            styleInput={{ flex: 1, maxHeight: 50, backgroundColor: 'white'}}

          />
        </CustomModal>
        {Array.from({ length: 3 }).map((v, i) => (
          <View></View>
        ))}
      </View>
    </SafeAreaView>
  );
}
