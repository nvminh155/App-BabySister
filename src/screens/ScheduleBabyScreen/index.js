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
  doc,
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
  AppSafeAreaView,
} from "../../components";
import { formatDateTime } from "../../utils";
import { AuthContext } from "../../contexts/AuthProvider";
import { db } from "../../firebase/config";

export default function ScheduleBabyScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);

  useLayoutEffect(() => {
    const q = query(collection(db, `users/${user._id}/schedules`));
    const unsubcribe = onSnapshot(q, (snap) => {
      const schedules = [];
      snap.docs.forEach((doc) => {
        schedules.push({ ...doc.data(), _id: doc.id });
      });
      setSchedules(schedules);
    });

    return unsubcribe;
  }, []);

  const bodyCardSchedule = (schedule) => (
    <View>
      <AppText style={{ fontWeight: "bold" }}>{schedule.title}</AppText>
      <AppText style={{ color: "grey" }}>
        Ngày tạo : {formatDateTime(schedule.createdAt).DMY}
      </AppText>
    </View>
  );

  const footerCardSchedule = (schedule) => (
    <View>
      <CustomButton
        label={"Xem"}
        style={{
          backgroundColor: COLORS.accent,
          paddingHorizontal: 15,
        }}
        onPress={() => {
          navigation.navigate("ViewSchedule", {
            scheduleID: schedule.scheduleID,
          });
        }}
      />
    </View>
  );
  return (
    <AppSafeAreaView
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.background,
      }}
    >
      <View id="header" style={{ paddingHorizontal: 10 }}>
        <CustomButton
          label={"Thêm mới"}
          style={{
            paddingHorizontal: 0,
          }}
          styleText={{
            fontWeight: 700,
            color: COLORS.accent,
            fontSize: 17,
            marginLeft: "auto",
          }}
          onPress={() => {
            navigation.navigate("addSchedule");
          }}
        />
      </View>

      {schedules.length > 0 ? (
        <View id="contains-schedules" style={{ marginTop: 25, rowGap: 20 }}>
          {schedules.map((schedule, i) => (
            <View
              key={i}
              style={{
                backgroundColor: COLORS.secondary,
                padding: 5,
                borderRadius: 10,
                elevation: 2
              }}
            >
              <CustomCard
                body={bodyCardSchedule(schedule)}
                footer={footerCardSchedule(schedule)}
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
      ) : (
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
            source={require("images/empty_data.png")}
          />
          <AppText style={{ marginTop: 10 }}>Chưa có dữ liệu</AppText>
        </View>
      )}
    </AppSafeAreaView>
  );
}
