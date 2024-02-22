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

import { checkExpire, formatDateTime, formatMoney } from "../../utils";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function PostedScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [test, setTest] = useState([]);

  const fetchJobs = async () => {
    const q = query(collection(db, "posts"), where("uid", "==", user.uid));
    const querySnap = await getDocs(q);

    setJobs(
      querySnap.docs
        .map((doc) => ({ ...doc.data(), _id: doc.id }))
        .filter((docMap) => !docMap.applies.some((uid) => user.uid === uid))
    );
  };
  useEffect(() => {
    // fetchJobs();
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (postSnap) => {
      const posts = [];
      postSnap.forEach((doc) => {
        // console.log("SNAP POST IN POSTED" , doc.data())
        posts.push({
          ...doc.data(),
          _id: doc.id,
        });
      });
      setTest(posts);
      console.log("CHANGE VALUE POST POSTED");
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(collection(db, "posts"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (postSnap) => {
      const posts = [];
      postSnap.forEach((doc) => {
        // console.log("SNAP POST" , doc.data())
        posts.push({
          ...doc.data(),
          _id: doc.id,
        });
      });
      setJobs(posts);
      console.log("CHANGE VALUE POST");
    });

    return unsubscribe;
  }, []);

  const removePost = () => {};

  const headerCardInfoJob = (job) => {
    const isJobDone = () => {
      if (job.isDone === 0) return "Đang đợi bảo mẫu";
      else if (job.isDone === 1) {
        if (checkExpire(job.start, job.end).lt) return "Sắp bắt đầu";
        if (checkExpire(job.start, job.end).process) return "Đang diễn ra";
        return "Đã kết thúc - Bảo mẫu chưa hoàn thành công việc";
      }
      return "Đã kết thúc - Bảo mẫu hoàn thành công việc";
    };
    const colorStatus = () => {
      if (job.isDone === 0) return "yellow";
      else if (job.isDone === 1) return "blue";
      return COLORS.accent;
    };
    return (
      <View>
        <AppText
          style={{ fontStyle: "italic", marginBottom: 10 }}
          color={colorStatus()}
        >
          {isJobDone()}
        </AppText>
        <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
          {job.title.toUpperCase()}
        </AppText>
        <AppText style={{ fontSize: 15 }}>
          Bắt đầu vào lúc:
          <AppText
            style={{ color: COLORS.accent, fontSize: 17, fontWeight: "bold" }}
          >
            {formatDateTime(job.start).DDMYTS}
          </AppText>
        </AppText>
      </View>
    );
  };

  const bodyCardInfoJob = (job) => {
    return (
      <View style={{ rowGap: 5, paddingHorizontal: 10 }}>
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
              {job.timeHire}
            </AppText>
          </View>

          <View id="money" style={{ alignItems: "center" }}>
            <AppText>Số tiền(VND)</AppText>
            <AppText color={COLORS.accent} fontWeight="bold" fontSize={20}>
              {formatMoney(job.money)}
            </AppText>
          </View>
        </View>

        <View id="address" style={{ flexDirection: "row" }}>
          <AppText>Tại: </AppText>
          <AppText fontWeight={"bold"}>{job.address2.text}</AppText>
        </View>
        <View id="note-from-customer" style={{ flexDirection: "row" }}>
          <AppText>Ghi chú: </AppText>
          <AppText style={{ fontWeight: "bold" }}>{job.textNote}</AppText>
        </View>
      </View>
    );
  };

  const footerCardInfoJob = (job) => {
    return (
      <>
        {job.isDone === 0 && (
          <Row style={{ marginLeft: "auto" }}>
            <CustomButton
              label={"XEM THÊM"}
              style={{
                backgroundColor: COLORS.accent,
                alignSelf: "center",
                width: "max-content",
              }}
              onPress={() => {
                navigation.navigate("ViewPost", { docIdJob: job._id, job });
              }}
            />
            <CustomButton
              label={"HỦY ĐĂNG"}
              style={{
                backgroundColor: COLORS.secondary,
                alignSelf: "center",
                width: "max-content",
                borderColor: COLORS.accent,
                borderWidth: 1,
              }}
              styleText={{ color: COLORS.accent }}
              onPress={() => {
                navigation.navigate("ViewJob", { job });
              }}
            />
          </Row>
        )}
        {job.isDone !== 0 && (
          <Row style={{ marginLeft: "auto" }}>
            <CustomButton
              label={"XEM THÊM"}
              style={{
                backgroundColor: COLORS.accent,
                alignSelf: "center",
                width: "max-content",
              }}
              onPress={() => {
                navigation.navigate("ViewPost", { docIdJob: job._id, job });
              }}
            />
          </Row>
        )}
      </>
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
          header={headerCardInfoJob(job)}
          body={bodyCardInfoJob(job)}
          footer={footerCardInfoJob(job)}
          style={{
            rowGap: 15,
            backgroundColor: "white",
            paddingHorizontal: 30,
            paddingVertical: 20,
            borderTopLeftRadius: 15,
            borderBottomLeftRaidus: 15,
            borderLeftColor: COLORS.accent, // red: end, green: done, blue: wait
            borderLeftWidth: 4,
          }}
        />
      ))}
    </ScrollView>
  );
}
