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
  Alert,
} from "react-native";

import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AntDesign } from "react-native-vector-icons";
// FIRE BASE
import {
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";

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
  CustomModal,
} from "../../components";

import { formatDateTime, formatMoney } from "../../utils";

import InfoSisterScreen from "./InfoSisterScreen";
import Spin from "../../components/Spin";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function ViewPostScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const { docIdJob } = route.params;
  const [job, setJob] = useState(null);
  const [editAble, setEditAble] = useState(false);
  const [infoSister, setInfoSister] = useState(null);
  const [choosed, setChoosed] = useState(true);
  const [sisterChoosed, setSisterChoosed] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const q = doc(db, "posts", docIdJob);
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = { ...snap.data() };
      setJob({ ...data, _id: docIdJob });
      setSisterChoosed(
        data.applies.find((apply) => apply.uid === data.userChoosed)
      );
      setChoosed(data.userChoosed ? true : false);
    });

    return unsubscribe;
  }, [docIdJob]);

  useLayoutEffect(() => {
    const unsubscribeTimeout = setTimeout(() => {
      setLoadingData(false);
      console.log("STOP");
    }, 1000);

    return () => {
      clearTimeout(unsubscribeTimeout);
    };
  }, []);

  useLayoutEffect(() => {
    if (!choosed) {
      console.log("HELLO CHOOSED")
      navigation.setOptions({
        headerRight: () => (
          <CustomButton
            label={editAble ? "Hủy chỉnh sửa" : "Chỉnh Sửa"}
            style={{ marginTop: 0 }}
            styleText={{ color: COLORS.accent }}
            onPress={() => {
              navigation.navigate("EditPost", { job });
            }}
          />
        ),
      });
    }
  }, [editAble]);

  const headerCardInfoJob = (title, startTimestamp) => {
    return (
      <View>
        <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
          {title.toUpperCase()}
        </AppText>
        <AppText style={{ fontSize: 15 }}>
          Bắt đầu vào lúc:
          <AppText
            style={{
              color: COLORS.accent,
              fontSize: 17,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            {formatDateTime(startTimestamp).DDMYTS}
          </AppText>
        </AppText>
      </View>
    );
  };

  const bodyCardInfoJob = (timeJob, money, address, textNote) => {
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
        <AppText color={COLORS.accent}>alsdfjljasdfklajtdlfkj</AppText>
      </View>
    );
  };

  const handleSendNotice = async (uid, type, data) => {
    const noticeRef = collection(db, `notices/${uid}/${type}`);
    await addDoc(noticeRef, { ...data });
  };

  const handleChoosedUser = async (sister) => {
    const jobRef = doc(db, "posts", job._id);
    const update = await updateDoc(jobRef, {
      ...job,
      userChoosed: sister.uid,
      isDone: 1,
    });
    console.log("UPDATE USERCHOOSED SUCCESS FULL");

    job.applies.forEach(async (sisterApplyed) => {
      const dataSendNoticeSister = {
        type: sisterApplyed.uid === sister.uid ? "accepted" : "rejected",
        text:
          sisterApplyed.uid === sister.uid
            ? `Bạn đã được chọn đảm nhận công việc ${job.title}`
            : `Oops! Có lẽ đã có người khác đảm nhận công việc ${job.title}... Bạn vui lòng chọn công việc khác nhé !`,
        address: job.address,
        time: job.start,
      };
      await handleSendNotice(sisterApplyed.uid, "jobs", dataSendNoticeSister);
    });

    await handleSendNotice(user.uid, "posts", {
      type: "notice",
      text: `Bạn đã chọn SISTER: ${sister.displayName} để chăm bé`,
      address: job.address,
      time: job.start,
    });

    console.log("SEND NOTICE FOR SESSTERAPPLYED SUCCESS FULL");
  };
  const onChooseSister = async (uid, sister) => {
    console.log("CHOSSED SISTER", uid, choosed);

    await Alert.alert(
      "Bạn có chắc ? ",
      `Bạn đã đọc kỹ thông tin và muốn ${uid ? "chọn" : "hủy chọn"} SISTER: ${
        sister.displayName
      } ? `,
      [
        {
          text: `Có, Tôi muốn ${uid ? "chọn" : "hủy chọn"} !`,
          onPress: () => {
            handleChoosedUser(sister);
            setChoosed(uid);
          },
          style: "destructive",
        },
        {
          text: "Không",
          onPress: () => {},
          style: "cancel",
        },
      ]
    );
  };

  return (
    <>
      {loadingData ? (
        <Spin />
      ) : (
        <ScrollView
          style={{
            paddingHorizontal: 10,
            backgroundColor: COLORS.secondary,
            flex: 1,
          }}
        >
          <CustomModal
            modalVisible={infoSister ? true : false}
            header={
              <TouchableOpacity
                onPress={() => {
                  setInfoSister(null);
                }}
              >
                <AppImage
                  width={24}
                  height={24}
                  source={require("images/close_x.png")}
                />
              </TouchableOpacity>
            }
          >
            <InfoSisterScreen
              sister={infoSister}
              onChooseSister={onChooseSister}
              choosedUid={choosed}
            />
          </CustomModal>
          <CustomCard
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

          {!sisterChoosed && (
            <View id="list-applies" style={{ flex: 1 }}>
              <AppText
                style={{ marginLeft: "auto", marginBottom: 20 }}
                fontSize={20}
                fontWeight={"bold"}
              >
                Đã có{" "}
                <AppText
                  color={COLORS.accent}
                  fontSize={20}
                  fontWeight={"bold"}
                >
                  {job.applies.length}
                </AppText>{" "}
                người nộp đơn
              </AppText>

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ rowGap: 10 }}
              >
                {job.applies.map((sister, i) => (
                  <CustomCard
                    key={i}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 15,
                    }}
                    header={
                      <AppImage
                        width={50}
                        height={50}
                        source={require("images/bbst_1.jpg")}
                      />
                    }
                    body={
                      <View style={{ flex: 1 }}>
                        <AppText fontWeight={"bold"}>
                          {sister.displayName}
                        </AppText>
                        <AppText style={{ fontStyle: "italic", opacity: 0.5 }}>
                          Chưa từng thuê trước đây
                        </AppText>
                      </View>
                    }
                    footer={
                      <View>
                        <CustomButton
                          label={"Xem"}
                          style={{ backgroundColor: COLORS.accent }}
                          onPress={() => {
                            console.log(123);
                            setInfoSister(sister);
                          }}
                        />
                      </View>
                    }
                  />
                ))}
              </ScrollView>
            </View>
          )}
          {sisterChoosed && (
            <View>
              <AppText fontWeight={"bold"}>
                {"Bạn đã chọn".toUpperCase()}
              </AppText>
              <InfoSisterScreen sister={sisterChoosed} choosed={true} navigation={navigation} />
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
}
