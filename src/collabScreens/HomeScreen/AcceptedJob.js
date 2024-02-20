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

import { useContext, useEffect, useState } from "react";

// FIRE BASE

// CONTEXT
import { AuthContext } from "../../contexts/AuthProvider";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../../constants/COLORS";

import {
  AppSafeAreaView,
  AppText,
  AppImage,
  CustomCard,
  CustomButton,
  Row,
} from "../../components";
import { and, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { formatDateTime, formatMoney } from "../../utils";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [listFollowing, setListFollowing] = useState(null);

  const [jobs, setJobs] = useState([]);
  const fetchJobsAccepted = async () => {};
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      and(where("isDone", ">=", 1), where("userChoosed", "==", user.uid))
    );

    const unsubscribe = onSnapshot(q, (jobSnap) => {
      const jobs = [];
      jobSnap.forEach((doc) => {
        jobs.push({
          ...doc.data(),
          _id: doc.id,
        });
      });

      setJobs(jobs);
    });

    return unsubscribe;
  }, []);
  const headerCardInfoJob = (title, startTimestamp, isDone) => {
    return (
      <View>
        <Row style={{ marginTop: 0, marginBottom: 10, marginLeft: "auto" }}>
          <AppText color={isDone == 1 ? COLORS.textDanger : COLORS.textSuccess}>
            {isDone === 1 ? "Chưa Hoàn Thành" : "Đã Hoàn Thành"}
          </AppText>
        </Row>
        <View>
          <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
            {title.toUpperCase()}
          </AppText>
          <AppText style={{ fontSize: 15 }}>
            Bắt đầu vào lúc:
            <AppText
              style={{ color: COLORS.accent, fontSize: 17, fontWeight: "bold" }}
            >
              {formatDateTime(startTimestamp).DDMYTS}
            </AppText>
          </AppText>
        </View>
      </View>
    );
  };

  const bodyCardInfoJob = (timeJob, money, address, textNote) => {
    return (
      <View style={{ rowGap: 5, paddingHorizontal: 10, flex: 1 }}>
        <View
          id="benifit"
          style={{
            flexDirection: "row",
            borderWidth: 0.5,
            borderColor: "grey",
            borderRadius: 5,
            padding: 10,
            justifyContent: "space-around",
          }}
        >
          <View id="time" style={{ alignItems: "center" }}>
            <AppText>Làm trong (giờ)</AppText>
            <AppText color={COLORS.accent} fontWeight="bold" fontSize={20}>
              {timeJob}
            </AppText>
          </View>

          <View id="money" style={{ alignItems: "center" }}>
            <AppText>Số tiền(VND)</AppText>
            <AppText color={COLORS.accent} fontWeight="bold" fontSize={20}>
              {formatMoney(money)}
            </AppText>
          </View>
        </View>

        <View id="address" style={{ flexDirection: "row" }}>
          <AppText>Tại: </AppText>
          <AppText fontWeight={"bold"}>{address}</AppText>
        </View>
        <View id="note-from-customer" style={{ flexDirection: "row" }}>
          <AppText>Ghi chú: </AppText>
          <AppText style={{ fontWeight: "bold" }}>{textNote}</AppText>
        </View>
      </View>
    );
  };

  const footerCardInfoJob = (job) => {
    return (
      <View>
        <CustomButton
          label={"XEM LẠI CÔNG VIỆC"}
          style={{
            backgroundColor: COLORS.accent,
            alignSelf: "center",
            width: "max-content",
          }}
          onPress={() => {
            navigation.navigate("ViewJob", {job});
          }}
        />
        
      </View>
    );
  };
  return (
    <ScrollView
      style={{ paddingHorizontal: 10, marginTop: 20, marginBottom: 20 }}
      contentContainerStyle={{ rowGap: 15 }}
    >
      {jobs.map((job, i) => (
        <CustomCard
          key={i}
          header={headerCardInfoJob(job.title, job.start, job.isDone)}
          body={bodyCardInfoJob(
            job.timeHire,
            job.money,
            job.address,
            job.textNote
          )}
          footer={footerCardInfoJob(job)}
          style={{
            rowGap: 15,
            backgroundColor: "white",
            paddingHorizontal: 30,
            paddingVertical: 15,
          }}
        />
      ))}
    </ScrollView>
  );
}
