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
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// FIRE BASE
import {
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  getDocs,
  collection,
  setDoc,
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
} from "../../components";
import { formatDateTime, formatMoney, markerDistance } from "../../utils";
import ViewAddress from "../../screens/MapScreen/ViewAddress";
import SelectAddress from "../../screens/MapScreen/SelectAddress";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function ViewJobScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [acceptJob, setAcceptJob] = useState(false);
  const { yourLocation } = useContext(AuthContext);
  console.log("🚀 ~ ViewJobScreen ~ yourLocation:", yourLocation);
  const [address, setAddress] = useState({ text: "", lon: 123, lat: 123 });
  const [isWaitting, setIsWaitting] = useState(
    route.params.isWaitting ?? false
  );
  const [apply, setApply] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [job, setJob] = useState(route.params.job);

  useLayoutEffect(() => {
    async function fetchJob() {
      const jobRef = doc(db, `posts/${route.params.job._id}`);
      const jobDoc = await getDoc(jobRef);
      setJob({ ...jobDoc.data(), _id: jobDoc.id });
      const applies = await getDocs(collection(db, `posts/${job._id}/applies`));
      setApply(
        applies.docs
          .map((apply) => ({
            ...apply.data(),
            _id: apply.id,
            distance: markerDistance(
              { lat: apply.data().lat, lon: apply.data().lon },
              { lat: job.address2.lat, lon: job.address2.lon }
            ),
          }))
          .find((apply) => apply.uid === user.uid)
      );
    }
    fetchJob();
  }, []);
  useEffect(() => {
    setAddress({
      text: "",
      lat: yourLocation.latitude,
      lon: yourLocation.longitude,
    });
  }, []);

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
    console.log("🚀 ~ bodyCardInfoJob ~ address:", address);
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
          <AppText fontWeight={"bold"}>{address.text}</AppText>
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
        <AppText style={{ marginLeft: "auto", marginTop: 10 }}>
          Đã có{" "}
          <AppText color={COLORS.accent} fontWeight={"bold"}>
            {job.numOfApplies}
          </AppText>{" "}
          người nộp đơn
        </AppText>

        <Row
          style={{
            borderTopColor: "black",
            borderTopWidth: 0.2,
            paddingTop: 10,
            marginTop: 10,
            alignItems: "center",
              justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowMap(true);
            }}
            id="address-map"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppImage
              width={32}
              height={32}
              source={require("images/map.png")}
            />
            <AppText fontWeight={"bold"}>XEM VỊ TRÍ LÀM VIỆC</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ChatStack", {receiverID: job.postedBy})
            }}
            id="address-map"
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppImage
              width={32}
              height={32}
              source={require("images/chat_now.png")}
            />
            <AppText fontWeight={"bold"}>Liên hệ ngay</AppText>
          </TouchableOpacity>
        </Row>
      </View>
    );
  };

  const handleAcceptJob = async () => {
    if (!acceptJob) {
      Alert.alert(
        "CẢNH BÁO",
        "Vui lòng đọc kỹ yêu cầu và nhấn vào nút Xác Nhận bên dưới trước khi nhận việc"
      );
      return;
    }

    const postRef = doc(db, `posts/${job._id}/applies/${user.uid}`);

    await setDoc(postRef, {
      ...user,
      ...address,
    })
      .then(() => {
        console.log("YOU ACCEPTED JOB");
      })
      .catch((err) => console.log(err));

    await updateDoc(doc(db, `posts/${job._id}`), {
      numOfApplies: job.numOfApplies + 1,
    });

    navigation.goBack();
  };
  return (
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      {showMap && (
        <View
          style={{
            position: "absolute",
            zIndex: 100,
            width: "100%",
            height: "100%",
            alignSelf: "center",
          }}
        >
          <ViewAddress
            setShowMap={setShowMap}
            markers={[
              { ...job.address2, text: "Vị trí làm việc" },
              {
                lat: apply ? apply.lat : yourLocation.latitude,
                lon: apply ? apply.lon : yourLocation.longitude,
                text: "Vị trí của bạn",
                color: "blue",
                distance: apply ? apply.distance : 0,
              },
            ]}
          />
        </View>
      )}

      <CustomCard
        header={headerCardInfoJob(job.title, job.start)}
        body={bodyCardInfoJob(
          job.timeHire,
          job.money,
          job.address2,
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

      {job.isDone === 0 && (
        <View style={{ flex: 1 }}>
          {!isWaitting && (
            <Row>
              <InputCheckbox
                edge={20}
                onToggle={(val) => {
                  setAcceptJob(val);
                }}
              />
              <AppText>Bạn đã đọc kỹ thông tin và muốn nhận việc ? </AppText>
            </Row>
          )}

          {isWaitting ? (
            <CustomButton
              label={"Bạn đã nộp đơn cho công việc này"}
              disable={true}
              style={{
                backgroundColor: COLORS.accent,
                marginTop: "auto",
                marginBottom: 15,
              }}
            />
          ) : (
            <Row
              style={{
                width: wWidth,
                columnGap: 0,
                position: "absolute",
                bottom: 0,
                left: 0,
              }}
            >
              <CustomButton
                label={"NHẬN VIỆC"}
                style={{
                  backgroundColor: COLORS.accent,
                  borderRadius: 0,
                  flex: 1,
                  paddingVertical: 15,
                }}
                styleText={{ fontSize: 20 }}
                onPress={() => {
                  handleAcceptJob();
                }}
              />
              <CustomButton
                label={"BỎ QUA"}
                style={{
                  backgroundColor: COLORS.secondary,
                  borderRadius: 0,
                  borderColor: COLORS.accent,
                  borderWidth: 0.5,
                  flex: 1,
                  paddingVertical: 15,
                }}
                styleText={{ color: COLORS.accent, fontSize: 20 }}
              />
            </Row>
          )}
        </View>
      )}
    </View>
  );
}
