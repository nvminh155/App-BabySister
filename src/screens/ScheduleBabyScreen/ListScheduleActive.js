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
import EditTimeSchedule from "./EditTimeSchedule";
import { AuthContext } from "../../contexts/AuthProvider";
import { ChatPrivateContext } from "../../contexts/ChatPrivateProvider";

function ListScheduleActive({
  onAddTimeSchedule,
  onRemoveTimeSchedule,
  onEditTimeSchedule,
  timeSchedules,
  readOnly,
  startActive,
  isDone,
  onMarkFinishTimeSchedule,
  finishTimeSchedule,
}) {
  const { user } = useContext(AuthContext);
  const [visiable, setVisiable] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(Date.now());
  const [textNote, setTextNote] = useState("");
  const [images, setImages] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [infoTimeSchedule, setInfoTimeSchedule] = useState(null);

  console.log("render add time");

  useLayoutEffect(() => {
  }, []);
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
          onAddTimeSchedule({
            scheduleID: genShortId(),
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
          setVisiable(false);
        }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {infoTimeSchedule && (
        <EditTimeSchedule
          onSaveEdit={onEditTimeSchedule}
          timeSchedule={infoTimeSchedule}
          setTimeSchedule={setInfoTimeSchedule}
          readOnly={readOnly}
        />
      )}

      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
      >
        <AppText style={{ fontWeight: "bold" }}>Các Khung giờ</AppText>
        {!readOnly && (
          <TouchableOpacity
            onPress={() => {
              setVisiable(true);
            }}
          >
            <Ionicons
              name="add"
              size={30}
              style={{ backgroundColor: COLORS.accent, color: "white" }}
            />
          </TouchableOpacity>
        )}
      </View>

      <CustomModal
        header={header}
        footer={footer}
        modalVisible={visiable}
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
        />

        <View style={{ flexDirection: "row", columnGap: 10 }}>
          <TouchableOpacity>
            <AppImage
              width={40}
              height={40}
              source={require("images/gallery_add.png")}
            />
          </TouchableOpacity>
          <ScrollView horizontal contentContainerStyle={{ columnGap: 10 }}>
            {Array.from({ length: 8 }).map((v, i) => (
              <View key={i}>
                <AppImage
                  width={40}
                  height={40}
                  source={require("images/bbst_1.jpg")}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </CustomModal>

      {!timeSchedules.length && (
        <AppText style={{ color: "grey", fontStyle: "italic" }}>
          Chưa có khung giờ nào !!!
        </AppText>
      )}

      <ScrollView
        contentContainerStyle={{ rowGap: 20 }}
        style={{ marginTop: 20, flex: 1 }}
      >
        {timeSchedules.map((timeSche, i) => (
          <View
            key={i}
            style={{
              backgroundColor: COLORS.secondary,
              borderRadius: 10,
              padding: 10,
              elevation: 3,
            }}
          >
            {startActive && (
              <Row style={{ marginBottom: 10 }}>
                <InputCheckbox
                  edge={20}
                  disable={isDone || user.typeUser === 2}
                  initTick={finishTimeSchedule.some(
                    (timeID) => timeID === timeSche.timeScheduleID
                  )}
                  onToggle={(tick) => {
                    onMarkFinishTimeSchedule(tick, timeSche);
                  }}
                />
                <AppText style={{ fontStyle: "italic" }}>
                  {user.typeUser === 2
                    ? isDone
                      ? "Bảo mẫu chưa hoàn thành"
                      : "BM đã hoàn thành"
                    : "Đánh dấu đã hoàn thành"}
                </AppText>
              </Row>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                columnGap: 10,
                position: "relative",
              }}
            >
              <AppText fontWeight={"bold"} color={COLORS.accent}>
                {formatDateTime(timeSche.time).T}
              </AppText>

              <InputGroup
                label={
                  <AppText style={{ fontWeight: "bold" }}>Ghi Chú :</AppText>
                }
                styleInput={{ backgroundColor: "white" }}
                styleRoot={{ flex: 1 }}
                multiline={true}
                value={timeSche.textNote}
                onChangeText={(text) => {
                  setTextNote(text);
                }}
                readOnly={true}
              />
            </View>

            <View
              id="actions"
              style={{
                flexDirection: "row",
                columnGap: 10,
                marginLeft: "auto",
              }}
            >
              <CustomButton
                label={!readOnly ? "Xem / Chỉnh Sửa" : "Xem"}
                style={{
                  backgroundColor: COLORS.accent,
                }}
                onPress={() => {
                  setInfoTimeSchedule(timeSche);
                }}
              />

              {!readOnly && (
                <CustomButton
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderColor: COLORS.accent,
                    borderWidth: 1,
                  }}
                  styleText={{ color: "black" }}
                  icon={
                    <Ionicons name="trash" size={24} color={COLORS.accent} />
                  }
                  onPress={() => {
                    onRemoveTimeSchedule(timeSche.timeScheduleID);
                  }}
                />
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(ListScheduleActive);