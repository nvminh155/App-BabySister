import { StatusBar } from "expo-status-bar";
import {
  useCallback,
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
  setDoc,
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
  AppSafeAreaView,
  Row,
} from "../../components";
import { db } from "../../firebase/config";

import { formatDateTime, genShortId } from "../../utils";

import { AuthContext } from "../../contexts/AuthProvider";

import ListSchedule from "./ListSchedule";

export default function ScheduleBabyScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [numOfChilds, setNumOfChilds] = useState("0");
  const [childs, setChilds] = useState([]);
  const [timeSchedules, setTimeSchedules] = useState([]);
  console.log("🚀 ~ ScheduleBabyScreen ~ timeSchedules:", timeSchedules);
  const [page, setPage] = useState(0);

  const handleAddTimeSchedule = useCallback((data) => {
    setTimeSchedules((prev) => [...prev, data]);
  }, []);

  const handleEditTimeSchedule = useCallback((data) => {
    setTimeSchedules((prev) =>
      prev.map((v, i) => {
        if (v.scheduleID === data.scheduleID) {
          return { ...v, ...data };
        } else return v;
      })
    );
  }, []);

  const handleRemoveTimeSchedule = useCallback((scheduleID) => {
    setTimeSchedules((prev) =>
      prev.filter((v, i) => v.scheduleID !== scheduleID)
    );
  }, []);

  const handleAddSchedule = async () => {
    const data = {
      scheduleID: genShortId(),
      title,
      numOfChilds,
      childs,
      timeSchedules,
    };
    await setDoc(doc(db, `users/${user._id}/schedules`, `${data.scheduleID}`), {
      ...data
    });
  };

  return (
    <AppSafeAreaView
      style={{
        backgroundColor: COLORS.background,
        paddingHorizontal: 10,
        height: "100%",
        flex: 1,
      }}
    >
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
          THÊM MỚI LỊCH BIỂU
        </Text>
      </View>

      <InputGroup
        label={
          <AppText id="label" style={{ fontWeight: "bold" }}>
            Tên lịch biểu :
          </AppText>
        }
        row={true}
        placeholder={"Nhập tên lịch biểu ...."}
        styleInput={{ backgroundColor: "white", flex: 1 }}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
        }}
      />
      <InputGroup
        label={
          <AppText id="label" style={{ fontWeight: "bold" }}>
            Số bé :
          </AppText>
        }
        row={true}
        placeholder={"Nhập số bé ...."}
        styleInput={{ backgroundColor: "white", flex: 1 }}
        value={numOfChilds}
        onChangeText={(text) => {
          setNumOfChilds(text);
          const childs = Array.from({ length: parseInt(text) }).map((v, i) => ({
            fullName: "",
            age: "",
            image: "",
          }));
          setChilds(childs);
        }}
      />

      {childs.length > 0 && (
        <View id="list-child">
          <View>
            <AppImage
              width={64}
              height={64}
              source={require("images/upload_image.png")}
            />

            <InputGroup
              label={
                <AppText id="label" style={{ fontWeight: "bold" }}>
                  Họ và Tên :
                </AppText>
              }
              row={true}
              placeholder={"Nhập tên ...."}
              styleInput={{ backgroundColor: "white", flex: 1 }}
              value={childs[page].fullName}
              onChangeText={(text) => {
                setChilds((prev) =>
                  prev.map((v, indexMp) => ({
                    ...v,
                    fullName: indexMp === page ? text : v.fullName,
                  }))
                );
              }}
            />

            <InputGroup
              label={
                <AppText id="label" style={{ fontWeight: "bold" }}>
                  Tuổi :
                </AppText>
              }
              row={true}
              placeholder="Nhập tuổi ..."
              styleInput={{ backgroundColor: "white", flex: 1 }}
              value={childs[page].age}
              onChangeText={(text) => {
                setChilds((prev) =>
                  prev.map((v, indexMp) => ({
                    ...v,
                    age: indexMp === page ? text : v.age,
                  }))
                );
              }}
            />
          </View>

          <Row style={{ marginTop: 5, marginBottom: 15, marginLeft: "auto" }}>
            <CustomButton
              disable={page === 0 ? true : false}
              label={"Trước đó"}
              style={{ backgroundColor: page === 0 ? "grey" : COLORS.accent }}
              onPress={() => {
                setPage((prev) => prev - 1);
              }}
            />
            <AppText fontWeight={"bold"}>{page + 1}</AppText>
            <CustomButton
              disable={page === childs.length - 1 ? true : false}
              label={"Tiếp theo"}
              style={{
                backgroundColor:
                  page === childs.length - 1 ? "grey" : COLORS.accent,
              }}
              onPress={() => {
                setPage((prev) => prev + 1);
              }}
            />
          </Row>
        </View>
      )}

      <ListSchedule
        onAddTimeSchedule={handleAddTimeSchedule}
        onRemoveTimeSchedule={handleRemoveTimeSchedule}
        timeSchedules={timeSchedules}
        onEditTimeSchedule={handleEditTimeSchedule}
      />
      <View
        style={{
          flexDirection: "row",
          columnGap: 10,
          marginVertical: 15,
          marginLeft: "auto",
        }}
      >
        <CustomButton
          label={"Thêm lịch biểu"}
          style={{
            backgroundColor: COLORS.accent,
            paddingVertical: 5,
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
          onPress={() => {
            handleAddSchedule();
          }}
        />

        <CustomButton
          label={"Hủy"}
          style={{
            backgroundColor: COLORS.secondary,
            paddingVertical: 5,
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
          styleText={{ color: "black" }}
          onPress={() => {}}
        />
      </View>
    </AppSafeAreaView>
  );
}
