import { StatusBar } from "expo-status-bar";
import {
  memo,
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
  InputCheckbox,
} from "../../components";
import { db } from "../../firebase/config";
import { formatDateTime, genShortId, uploadImage } from "../../utils";
import { AuthContext } from "../../contexts/AuthProvider";
import { ScheduleContext } from "../../contexts/ScheduleProvider";

function AddNewTimeSchedule({ onSaveNewTimeSchedule, visiable, setVisiable }) {
  console.log("🚀 ~ ListSchedule ~ setVisiable:", setVisiable);
  console.log("🚀 ~ ListSchedule ~ visiable:", visiable);
  const { user } = useContext(AuthContext);
  const { timeSchedules, setTimeSchedules, childs, setChilds } =
    useContext(ScheduleContext);

  const [showTime, setShowTime] = useState(false);
  const [newTimeSchedule, setNewTimeSchedule] = useState({
    time: Date.now(),
    textNote: "",
    images: [],
  });
  console.log("🚀 ~ AddNewTimeSchedule ~ newTimeSchedule:", newTimeSchedule);
  const [visiableUpImg, setVisiableUpImg] = useState(false);
  const [imgID, setImgID] = useState(null);
  const [typeHandleImg, setTypeHandleImg] = useState("add");

  const handleUploadImage = async (mode) => {
    await uploadImage(mode).then((result) => {
      if (result) {
        setNewTimeSchedule((prev) => ({
          ...prev,
          images: imgID
            ? prev.images.map((img) => {
                if (img.imgID === imgID) {
                  return result;
                } else return img;
              })
            : [...prev.images, result],
        }));
      }
    });
  };
  const header = (
    <View>
      <AppText style={{ fontWeight: "bold" }}>Thêm mới mốc thời gian</AppText>
    </View>
  );

  const footer = (
    <View
      style={{
        flexDirection: "row",
        columnGap: 10,
        marginLeft: "auto",
        marginTop: 10,
      }}
    >
      <CustomButton
        label={"Thêm"}
        style={{
          backgroundColor: COLORS.accent,

          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 5,
        }}
        onPress={() => {
          setTimeSchedules((prev) => [...prev, {...newTimeSchedule, timeScheduleID: genShortId()}]);
        }}
      />
      <CustomButton
        label={"Hủy"}
        style={{
          backgroundColor: COLORS.secondary,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 5,
        }}
        styleText={{ color: "black" }}
        onPress={() => {
          setVisiable(false);
        }}
      />
    </View>
  );

  return (
    <View>
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
              handleUploadImage("camera");
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
              handleUploadImage("gallery");
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

      <CustomModal header={header} footer={footer} modalVisible={visiable}>
        <View
          style={{
            paddingVertical: 0,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 10,
            marginVertical: 10,
          }}
        >
          <AppText style={{ fontWeight: "bold" }}>Thời Gian :</AppText>
          <CustomButton
            label={formatDateTime(newTimeSchedule.time ?? Date.now()).TS}
            style={{
              backgroundColor: "#f5f5f5",
              paddingVertical: 4,
              paddingHorizontal: 5,
            }}
            styleText={{ color: "black" }}
            onPress={() => {
              setShowTime(true);
            }}
          />
          {showTime && (
            <DateTimePicker
              value={new Date(newTimeSchedule.time ?? Date.now())}
              mode="time"
              is24Hour={true}
              onChange={({ nativeEvent }) => {
                setShowTime(false);
                setNewTimeSchedule((prev) => ({
                  ...prev,
                  time: nativeEvent.timestamp,
                }));
              }}
            />
          )}
        </View>

        <InputGroup
          label={<AppText style={{ fontWeight: "bold" }}>Ghi Chú :</AppText>}
          row={true}
          styleInput={{ flex: 1, maxHeight: 100, backgroundColor: "white" }}
          multiline={true}
          placeholder={"Điền ghi chú ..."}
          value={newTimeSchedule.textNote}
          onChangeText={(text) => {
            setNewTimeSchedule((prev) => ({ ...prev, textNote: text }));
          }}
        />

        <View style={{ flexDirection: "row", columnGap: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setVisiableUpImg(true);
            }}
          >
            <AppImage
              width={40}
              height={40}
              source={require("images/gallery_add.png")}
            />
          </TouchableOpacity>
          <ScrollView horizontal contentContainerStyle={{ columnGap: 10 }}>
            {newTimeSchedule.images.map((img, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setImgID(img.imgID);
                  setVisiableUpImg(true);
                }}
              >
                <AppImage width={40} height={40} source={img.uri} type="uri" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </CustomModal>
    </View>
  );
}

export default memo(AddNewTimeSchedule);
