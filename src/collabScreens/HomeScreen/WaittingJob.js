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

import { useContext, useEffect, useRef, useState } from "react";

// FIRE BASE
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  or,
  and,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
// CONTEXT
import { AuthContext } from "../../contexts/AuthProvider";

import { COLORS } from "../../constants/COLORS";

import {
  AppSafeAreaView,
  AppText,
  AppImage,
  CustomCard,
  CustomButton,
  Row,
  InputCheckbox,
} from "../../components";
import { formatDateTime, formatMoney } from "../../utils";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function WaittingJobSreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [listFollowing, setListFollowing] = useState(null);
  const [acceptJob, setAcceptJob] = useState(false);
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    const q = query(
      collection(db, "posts"),
      and(
        where("isDone", "==", 0),
        where("applies", "array-contains-any", [user])
      )
    );
    const querySnap = await getDocs(q);

    setJobs(
      querySnap.docs
        .map((doc) => ({ ...doc.data(), _id: doc.id }))
        .filter((docMap) =>
          docMap.applies.some((apply) => user.uid === apply.uid)
        )
    );
  };
  useEffect(() => {
    // fetchJobs();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      and(
        where("isDone", "==", 0),
        where("applies", "array-contains-any", [user])
      )
    );
    const unsubscribe = onSnapshot(q, (jobSnap) => {
      const jobs = [];
      jobSnap.forEach((doc) => {
        jobs.push({ ...doc.data(), _id: doc.id });
      });

      setJobs(jobs)
    });

    return unsubscribe;
  }, []);
  const headerCardInfoJob = (title, startTimestamp) => {
    return (
      <View style={{ justifyContent: "space-between" }}>
        <Row style={{ marginLeft: "auto", marginBottom: 10 }}>
          <AppImage
            width={32}
            height={32}
            source={require("images/clock_wait.png")}
          />
          <AppText fontWeight={"bold"}>Đang Chờ ...</AppText>
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

  const footerCardInfoJob = () => {
    return (
      <View>
        <AppText color={COLORS.accent}>alsdfjljasdfklajsdlfkj</AppText>
        <TouchableOpacity
          onPress={() => {
            console.log("SET VI TRI GPS");
          }}
          id="address-map"
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderTopColor: "black",
            borderTopWidth: 0.2,
            marginTop: 10,
          }}
        >
          <AppImage width={32} height={32} source={require("images/map.png")} />
          <AppText fontWeight={"bold"}>XEM VỊ TRÍ LÀM VIỆC</AppText>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ScrollView
      style={{ paddingHorizontal: 10, marginVertical: 20 }}
      contentContainerStyle={{ rowGap: 15 }}
    >
      {jobs.map((job, i) => (
        <CustomCard
          key={i}
          header={headerCardInfoJob(job.title, job.start)}
          body={bodyCardInfoJob(
            job.timeHire,
            job.money,
            job.address,
            job.textNote
          )}
          footer={footerCardInfoJob()}
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
