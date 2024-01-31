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

import { updateDoc, doc, getDocs, and, onSnapshot, query,  } from "firebase/firestore";

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
  Row,
} from "../../components";

import { formatDateTime } from "../../utils";

export default function EditPostScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [numOfChilds, setNumOfChilds] = useState("0");
  const [textNote, setTextNote] = useState("");
  const [address, setAddress] = useState("");
  const [job, setJob] = useState(route.params.job);
  const [startDate, setStartDate] = useState({
    timestamp: Date.now(),
    showDate: false,
    showTime: false,
  });

  const [endDate, setEndDate] = useState({
    timestamp: Date.now(),
    showDate: false,
    showTime: false,
  });
  const [title, setTitle] = useState("");
  const [timeHire, setTimeHire] = useState("0");
  const [money, setMoney] = useState(0);

  useLayoutEffect(() => {
    setAddress(job.address);
    setEndDate((prev) => ({ ...prev, timestamp: job.end }));
    setStartDate((prev) => ({ ...prev, timestamp: job.start }));
    setTitle(job.title);
    setMoney(job.money);
    setNumOfChilds(job.numOfChilds);
    setTextNote(job.textNote);

    async function saveEditPost() {
      const docData = {
        uid: user.uid,
        title,
        numOfChilds,
        textNote,
        address,
        start: startDate.timestamp,
        end: endDate.timestamp,
        timeHire: calcTimeHire(startDate.timestamp, endDate.timestamp),
        money,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      const postRef = doc(db, "posts", job._id);
      const update = await updateDoc(postRef, { ...docData })
        .then(() => {
          console.log(`UPDATE EDIT POST ${job._id} SUCCESS `);
        })
        .catch((err) => console.log("UPDATE POST ERR"));
    }
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => {
            saveEditPost();
          }}
        >
          <Row style={{ columnGap: 5 }}>
            <AppImage
              width={24}
              height={24}
              source={require("images/save_doc.png")}
            />
            <AppText fontWeight={"bold"} color={COLORS.accent}>
              Lưu
            </AppText>
          </Row>
        </TouchableOpacity>
      ),
    });
  }, []);
  useEffect( () => {
    const unsubPost = onSnapshot(doc(db, "posts", job._id), doc => {
        setJob(prev => ({...prev, ...doc.data()}))
    })

    return unsubPost;
  }, [])
  const returnDateTime = (timestamp) => {
    return timestamp ? new Date(timestamp) : new Date();
  };

  const calcTimeHire = (start, end) => {
    const date1 = new Date(start);
    const date2 = new Date(end);

    const diffInMilliseconds = Math.abs(date2 - date1);
    const hours = diffInMilliseconds / (1000 * 60 * 60);

    // console.log(date1, date2,diffInMilliseconds, hours)

    return Math.ceil(hours);
  };

  const formatCurrency = (amount) => {
    const val = parseInt(amount)
      ? parseInt(amount).toLocaleString("vi-VN")
      : "0";
    return val;
  };

  return (
    <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
      <ScrollView style={{ marginBottom: 10 }}>
        <InputGroup
          label={
            <AppText style={{ fontWeight: "bold" }}>Đặt tiêu đề :</AppText>
          }
          row={true}
          placeholder={"Nhập tiêu đề ..."}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
          }}
          autoFocus={true}
        />

        <InputGroup
          label={
            <AppText style={{ fontWeight: "bold" }}>Số lượng bé :</AppText>
          }
          row={true}
          inputMode={"numeric"}
          placeholder={"Nhập số lượng ..."}
          value={numOfChilds}
          onChangeText={(num) => {
            setNumOfChilds(num);
          }}
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

        <Row>
          <InputGroup
            label={<AppText style={{ fontWeight: "bold" }}>Địa chỉ</AppText>}
            styleRoot={{ flex: 1 }}
            styleInput={{ flex: 1, maxHeight: 100, backgroundColor: "white" }}
            multiline={true}
            placeholder={"Địa chỉ ..."}
            value={address}
            onChangeText={(address) => {
              setAddress(address);
            }}
          />
          <View>
            <TouchableOpacity
              onPress={() => {
                console.log(123);
              }}
              id="address-map"
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <AppImage
                width={32}
                height={32}
                source={require("images/map.png")}
              />
              <AppText fontWeight={"bold"}>ĐẶT VỊ TRÍ</AppText>
            </TouchableOpacity>
          </View>
        </Row>
        <View id="choose-date">
          <View id="start_datetime">
            <AppText style={{ fontWeight: "bold", marginBottom: 15 }}>
              Thời gian bắt đầu
            </AppText>

            <View style={{ flexDirection: "row", columnGap: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setStartDate((prev) => ({
                    ...prev,
                    showDate: !startDate.showDate,
                  }));
                }}
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 15,
                  marginBottom: 15,
                }}
              >
                <AppText>{formatDateTime(startDate.timestamp).DDMYTS}</AppText>
              </TouchableOpacity>
            </View>

            {startDate.showDate && (
              <DateTimePicker
                value={returnDateTime(startDate.timestamp)}
                mode="date"
                is24Hour={true}
                display="spinner"
                onChange={({ nativeEvent }) => {
                  setStartDate((prev) => ({
                    ...prev,
                    timestamp: nativeEvent.timestamp,
                    showDate: !startDate.showDate,
                    showTime: !startDate.showTime,
                  }));
                }}
              />
            )}
            {startDate.showTime && (
              <DateTimePicker
                value={returnDateTime(startDate.timestamp)}
                mode="time"
                is24Hour={true}
                display="clock"
                onChange={({ nativeEvent }) => {
                  console.log(nativeEvent);
                  setStartDate((prev) => ({
                    ...prev,
                    timestamp: nativeEvent.timestamp,
                    showTime: !startDate.showTime,
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
                  setEndDate((prev) => ({
                    ...prev,
                    showDate: !endDate.showDate,
                  }));
                }}
                style={{
                  backgroundColor: "#fff",
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 15,
                  marginBottom: 15,
                }}
              >
                <AppText>{formatDateTime(endDate.timestamp).DDMYTS}</AppText>
              </TouchableOpacity>
            </View>

            {endDate.showDate && (
              <DateTimePicker
                value={returnDateTime(endDate.timestamp)}
                mode="date"
                is24Hour={true}
                display="spinner"
                onChange={({ nativeEvent }) => {
                  setEndDate((prev) => ({
                    ...prev,
                    timestamp: nativeEvent.timestamp,
                    showDate: !endDate.showDate,
                    showTime: !endDate.showTime,
                  }));
                }}
              />
            )}
            {endDate.showTime && (
              <DateTimePicker
                value={returnDateTime(endDate.timestamp)}
                mode="time"
                is24Hour={true}
                display="clock"
                onChange={({ nativeEvent }) => {
                  console.log(nativeEvent);
                  setEndDate((prev) => ({
                    ...prev,
                    timestamp: nativeEvent.timestamp,
                    showTime: !endDate.showTime,
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
            inputMode={"numeric"}
            value={calcTimeHire(
              startDate.timestamp,
              endDate.timestamp
            ).toString()}
            onChangeText={(time) => {
              setTimeHire(time);
            }}
            styleInput={{ width: "max-content" }}
            readOnly={true}
          />
        </View>

        <InputGroup
          label={
            <AppText style={{ fontWeight: "bold" }}>Đặt giá tiền :</AppText>
          }
          styleInput={{ flex: 1, backgroundColor: "white" }}
          row={true}
          placeholder={"Điền số tiền ..."}
          inputMode={"numeric"}
          value={formatCurrency(money)}
          onChangeText={(money) => {
            console.log(money.replace(".", ""));
            setMoney(money.replaceAll(".", ""));
          }}
          iconAfter={
            <AppImage
              width={24}
              height={24}
              source={require("images/money.png")}
            />
          }
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
