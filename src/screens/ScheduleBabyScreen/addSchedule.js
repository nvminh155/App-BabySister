import { StatusBar } from "expo-status-bar";
import {
  createContext,
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


import { AuthContext } from "../../contexts/AuthProvider";

import ListSchedule from "./ListSchedule";

import { ScheduleContext } from "../../contexts/ScheduleProvider";
import { genShortId, uploadImage } from "../../utils";

export default function ScheduleBabyScreen({ navigation, children }) {
  const { user } = useContext(AuthContext);
  const { timeSchedules, setTimeSchedules, childs, setChilds } =
    useContext(ScheduleContext);
  console.log("🚀 ~ ScheduleBabyScreen ~ ScheduleContext:", ScheduleContext);
  const [title, setTitle] = useState("");
  const [numOfChilds, setNumOfChilds] = useState("0");
  const [visiableUpImg, setVisiableUpImg] = useState(false);
  console.log("🚀 ~ ScheduleBabyScreen ~ timeSchedules:1", timeSchedules);
  const [page, setPage] = useState(0);

  const handleUploadImgChild = async (mode, childID) => {
      await uploadImage(mode).then(res => {
        if(!res) return;
        setChilds((prev) => {
          console.log(prev);
          return prev.map((v, i) => ({
            ...v,
            image: v.id === childID ? {...res} : v.image,
          }));
        });
        setVisiableUpImg(false);
      })

    
  };



  const handleAddSchedule = async () => {
    const data = {
      scheduleID: genShortId(),
      title,
      numOfChilds,
      childs,
      timeSchedules,
    };
    await setDoc(doc(db, `users/${user._id}/schedules`, `${data.scheduleID}`), {
      ...data,
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

      <CustomModal
        modalVisible={visiableUpImg}
        setModalVisible={setVisiableUpImg}
      >
        <Row
          style={{
            alignSeft: "center",
            marginTop: 0,
            margin: "0 auto",
            justifyContent: "center",
          }}
        >
          <CustomButton
            label={"Máy ảnh"}
            style={{
              borderRadius: 15,
              padding: 10,
              borderColor: COLORS.accent,
              borderWidth: 1,
            }}
            styleText={{ color: COLORS.accent }}
            onPress={() => {
              handleUploadImgChild("camera", childs[page].id);
            }}
          />
          <CustomButton
            label={"Thư viện ảnh"}
            style={{
              borderRadius: 15,
              padding: 10,
              borderColor: COLORS.accent,
              borderWidth: 1,
            }}
            styleText={{ color: COLORS.accent }}
            onPress={() => {
              handleUploadImgChild("gallery", childs[page].id);
            }}
          />
          <CustomButton
            label={"Hủy"}
            style={{
              borderRadius: 15,
              padding: 10,
              borderColor: COLORS.accent,
              borderWidth: 1,
            }}
            styleText={{ color: COLORS.accent }}
            onPress={() => {
              setVisiableUpImg(false);
            }}
          />
        </Row>
      </CustomModal>
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
            id: genShortId(),
          }));
          setChilds(childs);
        }}
      />

      {childs.length > 0 && (
        <View id="list-child">
          <View>
            <TouchableOpacity
              onPress={() => {
                setVisiableUpImg(true);
              }}
            >
              <AppImage
                width={64}
                height={64}
                source={
                  childs[page].image
                    ? childs[page].image.uri
                    : require("images/upload_image.png")
                }
                type={childs[page].image ? "uri" : "icon"}
                style={{ resizeMode: "contain" }}
              />
            </TouchableOpacity>

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

      <ListSchedule />

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
