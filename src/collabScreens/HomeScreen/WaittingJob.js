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
  updateDoc,
  deleteDoc,
  doc,
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
import { formatDateTime, formatMoney, markerDistance } from "../../utils";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function WaittingJobSreen({ navigation }) {
  const { user, yourLocation } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), where("isDone", "==", 0));
    const unsubscribe = onSnapshot(q, async (jobSnap) => {
      const jobs = [];
      const promise = jobSnap.docs.map(async (docJob) => {
        const appllies = await getDocs(collection(docJob.ref, "applies"));
        if (appllies.docs.some((doc) => doc.data().uid === user.uid)) {
          jobs.push({ ...docJob.data(), _id: docJob.id });
        }
      });

      await Promise.all(promise);
      setJobs(
        jobs.map((job, i) => ({
          ...job,
          _id: job._id,
          distance: markerDistance(
            { lat: job.address2.lat, lon: job.address2.lon },
            { lat: yourLocation.latitude, lon: yourLocation.longitude }
          ),
        }))
      );
    });

    return unsubscribe;
  }, []);

  const handleCancelJob = async (job) => {
    await deleteDoc(doc(db, `posts/${job._id}/applies/${user.uid}`));
    await updateDoc(doc(db, `posts/${job._id}`), {
      numOfApplies: job.numOfApplies - 1,
    });
  };
  const headerCardInfoJob = (title, startTimestamp, distance) => {
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
          <Row
            style={{ alignItems: "center", justifyContent: "space-between" }}
          >
            <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
              {title.toUpperCase()}
            </AppText>
            <Row style={{ columnGap: 5, alignItems: "center" }}>
              <AppImage
                width={32}
                height={32}
                source={require("images/distance.png")}
              />
              <AppText>{distance}</AppText>
            </Row>
          </Row>
          <AppText style={{ fontSize: 15 }}>
            Thời gian làm:
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
            <AppText>Số giờ</AppText>
            <AppText color={COLORS.accent} fontWeight="bold" fontSize={20}>
              {timeJob}
            </AppText>
          </View>

          <View id="money" style={{ alignItems: "center" }}>
            <AppText>Tiền công (VND)</AppText>
            <AppText color={COLORS.accent} fontWeight="bold" fontSize={20}>
              {formatMoney(money)}
            </AppText>
          </View>
        </View>

        <View id="address" style={{ flexDirection: "row" }}>
          <AppText>Địa điểm: </AppText>
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
        <Row style={{ marginHorizontal: "auto" }}>
          <CustomButton
            label={"Xem công việc"}
            style={{ backgroundColor: COLORS.accent }}
            onPress={() => {
              navigation.navigate("ViewJob", { job, isWaitting: true });
            }}
          />
          <CustomButton
            label={"Hủy công việc này"}
            style={{ backgroundColor: COLORS.accent }}
            onPress={() => {
              handleCancelJob(job);
            }}
          />
        </Row>
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
          header={headerCardInfoJob(job.title, job.start, job.distance ?? 0)}
          body={bodyCardInfoJob(
            job.timeHire,
            job.money,
            job.address2.text,
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
