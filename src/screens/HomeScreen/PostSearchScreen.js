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

import DateTimePicker from "@react-native-community/datetimepicker";

import {
  AppImage,
  AppSafeAreaView,
  AppText,
  CustomButton,
  InputGroup,
} from "../../components";

export default function PostSearchScreen({ navigation, route }) {
  const [textNote, setTextNote] = useState("");
  const [start, setStart] = useState({
    date: 0,
    time: 0,
  });
  const [end, setEnd] = useState({
    date: 0,
    time: 0,
  });
  const [showDate, setShowDate] = useState({
    start: false,
    end: false,
  });
  const [showTime, setShowTime] = useState({
    start: false,
    end: false,
  });

  const returnDateTime = (timestamp) => {
    return timestamp ? new Date(timestamp) : new Date();
  };

  return (
    <AppSafeAreaView style={{ paddingHorizontal: 10 }}>

      <View id="header" style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
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
          ĐĂNG BÀI
        </Text>
      </View>

      <ScrollView style={{marginBottom: 10}}>
        <InputGroup
          label={
            <AppText style={{ fontWeight: "bold" }}>Số lượng bé :</AppText>
          }
          row={true}
          placeholder={"Nhập số lượng ..."}
          value={"???"}
        />

        <InputGroup
          label={
            <AppText style={{ fontWeight: "bold" }}>
              Ghi Chú / Yêu cầu :
            </AppText>
          }
          styleInput={{ flex: 1, maxHeight: 100, backgroundColor: "white" }}
          multiline={true}
          placeholder={"Điền ghi chú ..."}
          value={textNote}
          onChangeText={(text) => {
            setTextNote(text);
          }}
        />
        <View id="choose-date">
          <View id="start_datetime">
            <AppText style={{ fontWeight: "bold", marginBottom: 15 }}>
              Thời gian bắt đầu
            </AppText>

            <View style={{ flexDirection: "row", columnGap: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDate((prev) => ({ ...prev, start: !showDate.start }));
                }}
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 15,
                  marginBottom: 15,
                }}
              >
                <Text>{returnDateTime(start.date).toDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowTime((prev) => ({ ...prev, start: !showTime.start }));
                }}
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 15,
                  marginBottom: 15,
                  width: "auto",
                }}
              >
                <Text>
                  {returnDateTime(start.time).toTimeString().split(" ")[0]}
                </Text>
              </TouchableOpacity>
            </View>

            {showDate.start && (
              <DateTimePicker
                value={returnDateTime(start.date)}
                mode="date"
                is24Hour={true}
                display="spinner"
                onChange={({ nativeEvent }) => {
                  setShowDate(!showDate);
                  setStart((prev) => ({
                    ...prev,
                    date: nativeEvent.timestamp,
                  }));
                }}
              />
            )}
            {showTime.start && (
              <DateTimePicker
                value={returnDateTime(start.time)}
                mode="time"
                is24Hour={true}
                display="clock"
                onChange={({ nativeEvent }) => {
                  console.log(nativeEvent);
                  setShowTime(!showTime);
                  setStart((prev) => ({
                    ...prev,
                    time: nativeEvent.timestamp,
                  }));
                }}
              />
            )}
          </View>

          <View id="end_datetime">
            <AppText style={{ fontWeight: "bold", marginBottom: 15 }}>
              Thời gian kết thúc
            </AppText>

            <View style={{ flexDirection: "row", columnGap: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowDate((prev) => ({ ...prev, end: !showDate.end }));
                }}
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 15,
                  marginBottom: 15,
                }}
              >
                <Text>{returnDateTime(end.date).toDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowTime((prev) => ({ ...prev, end: !showTime.end }));
                }}
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 15,
                  marginBottom: 15,
                }}
              >
                <Text>
                  {returnDateTime(end.time).toTimeString().split(" ")[0]}
                </Text>
              </TouchableOpacity>
            </View>

            {showDate.end && (
              <DateTimePicker
                value={returnDateTime(end.date)}
                mode="date"
                is24Hour={true}
                display="spinner"
                onChange={({ nativeEvent }) => {
                  setShowDate(!showDate);
                  setEnd((prev) => ({
                    ...prev,
                    date: nativeEvent.timestamp,
                  }));
                }}
              />
            )}
            {showTime.end && (
              <DateTimePicker
                value={returnDateTime(end.time)}
                mode="time"
                is24Hour={true}
                display="clock"
                onChange={({ nativeEvent }) => {
                  setShowTime(!showTime);
                  setEnd((prev) => ({
                    ...prev,
                    time: nativeEvent.timestamp,
                  }));
                }}
              />
            )}
          </View>
        </View>

        <View>
          <InputGroup
            label={
              <AppText style={{ fontWeight: "bold" }}>Số giờ thuê :</AppText>
            }
            row={true}
            editableInput={false}
            value={'5'}
            styleInput={{maxWidth: 51}}
          />
        </View>

        <InputGroup
          label={
            <AppText style={{ fontWeight: "bold" }}>
              Đặt giá tiền :
            </AppText>
          }
          styleInput={{ flex: 1, backgroundColor: "white" }}
          row={true}
          placeholder={"Điền số tiền ..."}
          inputMode={'numeric'}
          value={textNote}
          onChangeText={(text) => {
            setTextNote(text);
          }}
          iconAfter={<AppImage width={24} height={24} source={require("../../assets/images/money.png")} />}
        />

        <View style={{flexDirection: 'row', columnGap: 15, marginLeft: 'auto'}}>
          <CustomButton label={"Đăng bài"} style={{backgroundColor: COLORS.accent}} onPress={() => {}} />
          <CustomButton label={"Hủy"} style={{borderColor: COLORS.accent, borderWidth: 1, }} styleText={{color: COLORS.accent}} onPress={() => {}} />
        </View>
      </ScrollView>

    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({});
