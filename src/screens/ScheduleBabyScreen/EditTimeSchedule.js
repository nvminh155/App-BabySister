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
} from "../../components";
import { db } from "../../firebase/config";
import { formatDateTime, genShortId } from "../../utils";

function EditTimeSchedule({
  onSaveEdit,
  timeSchedule,
  setTimeSchedule,
  readOnly,
}) {
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(timeSchedule.time);
  const [textNote, setTextNote] = useState(timeSchedule.textNote);
  const [images, setImages] = useState(timeSchedule.images);

  const header = <View></View>;

  const footer = (
    <>
      {!readOnly && (
        <View
          style={{
            flexDirection: "row",
            columnGap: 10,
            marginLeft: "auto",
            marginTop: 10,
          }}
        >
          <CustomButton
            label={"Lưu thay đổi"}
            style={{
              backgroundColor: COLORS.accent,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => {
              onSaveEdit({
                ...timeSchedule,
                time,
                textNote,
                images,
              });
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
              setTimeSchedule(null);
            }}
          />
        </View>
      )}
    </>
  );

  return (
    <CustomModal
      headerClose={true}
      header={header}
      footer={footer}
      modalVisible={timeSchedule ? true : false}
      setModalVisible={() => {
        setTimeSchedule(null)
      }}
      handleAddTimeSchedule
    >
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
          label={formatDateTime(time).TS}
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
            value={new Date(time)}
            mode="time"
            is24Hour={true}
            onChange={({ nativeEvent }) => {
              setShowTime(false);
              setTime(nativeEvent.timestamp);
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
        value={textNote}
        onChangeText={(text) => {
          setTextNote(text);
        }}
        readOnly={readOnly}
      />

      <View style={{ flexDirection: "row", columnGap: 10 }}>
        {!readOnly && (
          <TouchableOpacity>
            <AppImage
              width={40}
              height={40}
              source={require("images/gallery_add.png")}
            />
          </TouchableOpacity>
        )}
        <ScrollView horizontal contentContainerStyle={{ columnGap: 10 }}>
          {images.map((img, i) => (
            <View key={i}>
              <AppImage
                width={40}
                height={40}
                type="uri"
                source={img.uri}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </CustomModal>
  );
}

export default EditTimeSchedule;
