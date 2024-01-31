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
import { db } from "../../firebase/config";
import { AuthContext } from "../../contexts/AuthProvider";
// import moment from "moment";
// require("moment/locale/vi");

import DateTimePicker from "@react-native-community/datetimepicker";

import { MaterialIcons, Ionicons } from "react-native-vector-icons";

import { COLORS } from "../../constants/COLORS";

import { CustomButton, AppImage, CustomModal, InputField, AppSafeAreaView } from "../../components";

export default function InfoSisterScreen({ navigation }) {
  const [visiableRate, setVisiableRate] = useState(false);
  const [visiableBooking, setVisiableBooking] = useState(false);
  const [numStar, setNumStar] = useState(0);
  const [textRate, setTextRate] = useState("");
  const [start, setStart] = useState({
    date: new Date(),
    time: new Date().toTimeString().split(" ")[0],
  });
  const [end, setEnd] = useState({
    date: new Date(),
    time: new Date().toTimeString().split(" ")[0],
  });
  const [showDate, setShowDate] = useState({
    start: false,
    end: false,
  });
  const [showTime, setShowTime] = useState({
    start: false,
    end: false,
  });

  const footerRate = (
    <View style={{ flexDirection: "row", columnGap: 10 }}>
      <CustomButton
        label={"Gửi"}
        style={{
          backgroundColor: COLORS.primary,
          paddingHorizontal: 15,
          paddingVertical: 4,
          borderRadius: 5,
        }}
      />
      <CustomButton
        label={"Hủy"}
        style={{
          backgroundColor: COLORS.secondary,
          paddingHorizontal: 15,
          paddingVertical: 4,
          borderRadius: 5,
        }}
        styleText={{ color: "black", fontWeight: "normal" }}
        onPress={() => {
          setVisiableRate(!visiableRate);
        }}
      />
    </View>
  );

  const footerBooking = (
    <View style={{ flexDirection: "row", columnGap: 10 }}>
      <CustomButton
        label={"Gửi"}
        style={{
          backgroundColor: COLORS.primary,
          paddingHorizontal: 15,
          paddingVertical: 4,
          borderRadius: 5,
        }}
        onPress={() => {
          console.log(`DATE BOOKKING ===> START: ${start} /// END: ${end}`);
        }}
      />
      <CustomButton
        label={"Hủy"}
        style={{
          backgroundColor: COLORS.secondary,
          paddingHorizontal: 15,
          paddingVertical: 4,
          borderRadius: 5,
        }}
        styleText={{ color: "black", fontWeight: "normal" }}
        onPress={() => {
          setVisiableBooking(!visiableBooking);
        }}
      />
    </View>
  );

  return (
    <AppSafeAreaView
      style={{
        backgroundColor: COLORS.background,
        paddingHorizontal: 10,
        height: "100%",
      }}
    >
      <CustomModal
        modalVisible={visiableRate}
        setModalVisible={setVisiableRate}
        footer={footerRate}
      >
        <View
          id="stars"
          style={{ flexDirection: "row", columnGap: 10, marginBottom: 10 }}
        >
          {Array.from({ length: 5 }).map((v, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setNumStar(i + 1 === numStar ? i : i + 1);
                }}
              >
                <AppImage
                  width={24}
                  height={24}
                  source={
                    i + 1 <= numStar
                      ? require("images/star.png")
                      : require("images/star_empty.png")
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <AppImage
            width={60}
            height={60}
            source={require("images/bbst_1.jpg")}
            options={{ styles: { borderRadius: 30, marginRight: 10 } }}
          />
          <TextInput
            style={{
              backgroundColor: COLORS.secondary,
              width: "100%",
              color: "black",
              paddingVertical: 15,
              paddingHorizontal: 10,
              borderRadius: 20,
            }}
            multiline={true}
            placeholder="Bạn cảm thấy thế nào về bảo mẫu ?"
            value={textRate}
            onChangeText={(text) => {
              setTextRate(text);
            }}
          />
        </View>
      </CustomModal>

      <CustomModal
        modalVisible={visiableBooking}
        setModalVisible={setVisiableBooking}
        footer={footerBooking}
      >
        <View id="start_datetime">
          <Text style={{ fontWeight: "bold", color: "#333" }}>
            Thời gian bắt đầu
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowDate((prev) => ({ ...prev, start: !showDate.start }));
            }}
            style={{
              backgroundColor: "#f5f5f5",
              padding: 10,
              paddingHorizontal: 20,
              borderRadius: 15,
              marginBottom: 15,
            }}
          >
            <Text>{start.date.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowTime((prev) => ({ ...prev, start: !showTime.start }));
            }}
            style={{
              backgroundColor: "#f5f5f5",
              padding: 10,
              paddingHorizontal: 20,
              borderRadius: 15,
              marginBottom: 15,
            }}
          >
            <Text>{start.time}</Text>
          </TouchableOpacity>

          {showDate.start && (
            <DateTimePicker
              value={start.date}
              mode="date"
              is24Hour={true}
              display="spinner"
              onChange={({ nativeEvent }) => {
                setShowDate(!showDate);
                setStart((prev) => ({
                  ...prev,
                  date: new Date(nativeEvent.timestamp),
                }));
              }}
            />
          )}
          {showTime.start && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={true}
              display="clock"
              onChange={({ nativeEvent }) => {
                console.log(nativeEvent);
                setShowTime(!showTime);
                setStart((prev) => ({
                  ...prev,
                  time: new Date(nativeEvent.timestamp)
                    .toTimeString()
                    .split(" ")[0],
                }));
              }}
            />
          )}
        </View>

        <View id="end_datetime">
          <Text style={{ fontWeight: "bold", color: "#333" }}>
            Thời gian kết thúc
          </Text>

          <TouchableOpacity
            onPress={() => {
              setShowDate((prev) => ({ ...prev, end: !showDate.end }));
            }}
            style={{
              backgroundColor: "#f5f5f5",
              padding: 10,
              paddingHorizontal: 20,
              borderRadius: 15,
              marginBottom: 15,
            }}
          >
            <Text>{end.date.toDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowTime((prev) => ({ ...prev, end: !showTime.end }));
            }}
            style={{
              backgroundColor: "#f5f5f5",
              padding: 10,
              paddingHorizontal: 20,
              borderRadius: 15,
              marginBottom: 15,
            }}
          >
            <Text>{end.time}</Text>
          </TouchableOpacity>

          {showDate.end && (
            <DateTimePicker
              value={end.date}
              mode="date"
              is24Hour={true}
              display="spinner"
              onChange={({ nativeEvent }) => {
                setShowDate(!showDate);
                setEnd((prev) => ({
                  ...prev,
                  date: new Date(nativeEvent.timestamp),
                }));
              }}
            />
          )}
          {showTime.end && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={true}
              display="clock"
              onChange={({ nativeEvent }) => {
                console.log(nativeEvent);
                setShowTime(!showTime);
                setEnd((prev) => ({
                  ...prev,
                  time: new Date(nativeEvent.timestamp)
                    .toTimeString()
                    .split(" ")[0],
                }));
              }}
            />
          )}
        </View>
      </CustomModal>

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
          Thông Tin Bảo Mẫu
        </Text>
      </View>

      <ScrollView>
        <View style={{ flexDirection: "row", columnGap: 20, marginTop: 20 }}>
          <AppImage
            width={100}
            height={200}
            options={{
              styles: { borderWidth: 1, borderColor: "grey" },
            }}
            source={require("images/bbst_1.jpg")}
          />
          <View style={{ width: 150, rowGap: 15 }}>
            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <Text style={{ fontWeight: "700", color: COLORS.text }}>
                Họ và tên :
              </Text>
              <Text numberOfLines={2}>Nguyen Thi Van Van A</Text>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <Text style={{ fontWeight: "700" }}>Địa chỉ :</Text>
              <Text numberOfLines={2}>
                Hẻm 322/9 Huỳnh Văn Lũy, Phú Lợi, Thủ Dầu Một, Bình Dương
              </Text>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <Text style={{ fontWeight: "700" }}>Số điện thoại :</Text>
              <Text numberOfLines={2}>03xxxxxxxx</Text>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <Text style={{ fontWeight: "700" }}>Cách xa bạn :</Text>
              <Text numberOfLines={2}>40km</Text>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <Text style={{ fontWeight: "700" }}>Kinh nghiệm :</Text>
              <Text numberOfLines={2}>4 năm</Text>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <Text style={{ fontWeight: "700" }}>Đánh giá :</Text>
              <Text numberOfLines={2}>4.5 *****</Text>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <Text style={{ fontWeight: "700" }}>Bằng cấp :</Text>
              <Text numberOfLines={2}>GDTH</Text>
            </View>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginVertical: 20,
            }}
          >
            CÁC ĐÁNH GIÁ
          </Text>

          <CustomButton
            label={"Đánh Giá"}
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 3,
              paddingVertical: 3,
              width: 100,
              borderRadius: 15,
              marginLeft: "auto",
              marginBottom: 10,
            }}
            onPress={() => {
              setVisiableRate(!visiableRate);
            }}
          />

          <ScrollView
            id="reviewer"
            style={{ height: 200, paddingVertical: 10 }}
            nestedScrollEnabled
          >
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <View
                key={v}
                style={{
                  flexDirection: "row",
                  columnGap: 20,
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <AppImage
                  width={60}
                  height={60}
                  options={{
                    styles: {
                      borderRadius: 30,
                      borderWidth: 1,
                      borderColor: "black",
                    },
                  }}
                  source={require("images/bbst_1.jpg")}
                />
                <View style={{ rowGap: 10, paddingRight: 100 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 5,
                    }}
                  >
                    <Text style={{ fontWeight: "600" }}>
                      Nguyen Nguyen Thi Van {v}
                    </Text>
                    <View style={{ flexDirection: "row", columnGap: 4 }}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <View key={v}>
                          <AppImage
                            width={10}
                            height={10}
                            source={require("images/star.png")}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                  <Text style={{ color: "grey" }}>
                    Ban nay tuyet voi lam Ban nay tuyet voi lam Ban nay tuyet
                    voi lam Ban nay tuyet voi lam
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              marginLeft: "auto",
              marginTop: 10,
              columnGap: 10,
            }}
          >
            {["Đặt Lịch", "Liên Hệ"].map((label, i) => (
              <CustomButton
                key={i}
                label={label}
                style={{
                  backgroundColor: i === 0 ? COLORS.primary : COLORS.secondary,
                  paddingHorizontal: 3,
                  paddingVertical: 3,
                  width: 100,
                  borderRadius: 15,
                  marginLeft: "auto",
                  marginBottom: 10,
                }}
                styleText={{
                  color: i === 0 ? "white" : "black",
                }}
                onPress={() => {
                  if (i === 0) setVisiableBooking(!visiableBooking);
                  else {
                    navigation.navigate("ChatSister", {
                      uid: "gRKgLqOU71UzqVcoXulrt62pp0F3",
                    });
                  }
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  whImg: (w, h) => ({
    width: w,
    height: h,
  }),
});
