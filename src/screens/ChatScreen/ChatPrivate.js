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
  arrayUnion,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { AuthContext } from "../../contexts/AuthProvider";

import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../../constants/COLORS";
import Spin from "../../components/Spin";

import {
  AppSafeAreaView,
  AppText,
  AppImage,
  CircleItem,
  CustomModal,
  CustomCard,
  CustomButton,
  InputCheckbox,
  Row,
  ChooseDatetime,
} from "../../components";
import { formatDateTime, genShortId } from "../../utils";
import { ChatPrivateContext } from "../../contexts/ChatPrivateProvider";

export default function ChatPrivateScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const { dataChat, setDataChat, fetchChatRef, messages, receiver, schedules } =
  useContext(ChatPrivateContext);
  console.log("🚀 ~ ChatPrivateScreen ~ dataChat:", dataChat)

  const messagesEl = useRef();

  const [textMessage, setTextMessage] = useState("");
  const [isStartSchedule, setIsStartSchedule] = useState(false);
  const [showMenuChatBar, setShowMenuChatBar] = useState(false);
  const [showListSchedule, setShowListSchedule] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [isSelectAll, setIsSellectAll] = useState(false);
  const [startSchedule, setStartSchedule] = useState({
    timestamp: Date.now(),
    showDate: false,
    showTime: false,
  });
  const [endSchedule, setEndSchedule] = useState({
    timestamp: Date.now(),
    showDate: false,
    showTime: false,
  });
  const schedulesRef = useRef([]);

  useLayoutEffect(() => {
    if (receiver) {
      navigation.setOptions({
        headerTitle: () => (
          <Row style={{ alignSelf: "center", marginTop: 0 }}>
            <AppImage
              width={50}
              height={50}
              source={require("images/bbst_1.jpg")}
            />
            <AppText fontWeight={"bold"} fontSize={24}>
              {receiver.displayName}
            </AppText>
          </Row>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingRight: 10 }}
            onPress={() => {
              navigation.navigate("MenuChatPrivate");
            }}
          >
            <AppImage
              width={24}
              height={24}
              source={require("images/menu_bar.png")}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [receiver]);

  const handleChangeSelectSchedule = (tick, schedule) => {
    if (!schedulesRef.current) {
      return;
    }
    if (tick) {
      schedulesRef.current.push(schedule);
    } else {
      schedulesRef.current = schedulesRef.current.filter(
        (v) => v.scheduleID !== schedule.scheduleID
      );
    }
  };

  const onSendMessage = async () => {
    if (textMessage === "") return;

    const dataMessage = {
      messageID: genShortId(),
      senderID: user.uid,
      receiverID: receiver.uid,
      type: "text",
      images: [],
      text: textMessage,
      createdAt: Date.now(),
    };
    if (!dataChat) {
      await setDoc(doc(db, `chats/${user.uid}`), {
        members: [user.uid, receiver.uid],
        createdAt: Date.now(),
      });
      await fetchChatRef();
    }
    await setDoc(
      doc(db, `chats/${dataChat ? dataChat._id : user.uid}/messages/${dataMessage.messageID}`),
      dataMessage
    );

    // console.log(docRef);
    setTextMessage("");
  };

  const handleSendSchedules = () => {
    schedulesRef.current.forEach(async (schedule) => {
      const dataMessage = {
        messageID: genShortId(),
        senderID: user.uid,
        receiverID: receiver.uid,
        type: "schedule",
        scheduleID: schedule.scheduleID,
        finishTimeSchedule: [],
        start: startSchedule.timestamp,
        end: endSchedule.timestamp,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isDone: false,
      };

      if (!dataChat) {
        await setDoc(doc(db, `chats/${user.uid}`), {
          members: [user.uid, receiver.uid],
          createdAt: Date.now(),
        });
        await fetchChatRef();
      }
      await setDoc(
        doc(db, `chats/${dataChat ? dataChat._id : user.uid}/messages/${dataMessage.messageID}`),
        dataMessage
      );

    });
  };

  const bodyCardSchedule = (schedule) => (
    <View style={{ flex: 1 }}>
      <AppText style={{ fontWeight: "bold" }}>{schedule.title}</AppText>
      <AppText style={{ color: "grey" }}>
        Ngày tạo : {formatDateTime(schedule.createdAt).DMY}
      </AppText>
    </View>
  );

  const footerCardSchedule = (schedule) => (
    <View>
      <CustomButton
        label={"Xem"}
        style={{
          backgroundColor: COLORS.accent,
          paddingHorizontal: 15,
          marginTop: 0,
        }}
        onPress={() => {
          setShowListSchedule(false);
          navigation.navigate("ActiveSchedule", {
            scheduleID: schedule.scheduleID,
          });
        }}
      />
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        id="container-chat"
        ref={messagesEl}
        onContentSizeChange={() =>
          messagesEl.current.scrollToEnd({ animated: true })
        }
        style={{ flex: 1 }}
      >
        {messages.map((m, i) => {
          return (
            <View key={m.messageID} >
              {m.type === "text" ? (
                <View
                  style={styles.message(m.senderID === user.uid)}
                  key={m.messageID}
                >
                  <Text style={styles.textMessage(m.senderID === user.uid)}>
                    {m.text}
                  </Text>
                </View>
              ) : (
                <View
                  key={m.messageID}
                  style={{
                    backgroundColor: COLORS.accent,
                    marginHorizontal: 40,
                    marginTop: 15,
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <AppImage
                    width={64}
                    height={64}
                    source={require("images/list_task.png")}
                    style={{ alignSelf: "center" }}
                  />
                  <AppText
                    fontSize={22}
                    fontWeight={"bold"}
                    color={COLORS.secondary}
                    style={{ marginVertical: 15, alignSelf: "center" }}
                  >
                    LỊCH TRÌNH ĐÃ ĐƯỢC BẬT
                  </AppText>

                  <View id="time">
                    <View>
                      <AppText color={COLORS.secondary} fontWeight={"bold"}>
                        Bắt đầu lúc :{" "}
                      </AppText>
                      <AppText color={COLORS.secondary}>
                        {formatDateTime(m.start).DDMYTS}
                      </AppText>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                      <AppText color={COLORS.secondary} fontWeight={"bold"}>
                        Kết thúc lúc :{" "}
                      </AppText>
                      <AppText color={COLORS.secondary}>
                        {formatDateTime(m.end).DDMYTS}
                      </AppText>
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View
        style={{
          position: "relative",
          bottom: 0,
          marginVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            columnGap: 15,
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowMenuChatBar(!showMenuChatBar);
              messagesEl.current.scrollToEnd({ animated: true });
            }}
          >
            <AppImage
              width={30}
              height={30}
              source={require("images/menu_bar_4dot.png")}
            />
          </TouchableOpacity>
          <TextInput
            onFocus={() => {
              messagesEl.current.scrollToEnd({ animated: true });
            }}
            style={{
              borderBottomWidth: 2,
              borderBottomColor: "black",
              flex: 1,
            }}
            value={textMessage}
            placeholder="Enter Text"
            onChangeText={(text) => setTextMessage(text)}
          ></TextInput>
          <Button
            onPress={() => onSendMessage()}
            title="Gửi"
            style={{ marginRight: 10 }}
          />
        </View>

        {showMenuChatBar && (
          <View
            id="menu-chat-bar"
            style={{
              backgroundColor: "white",
              height: 200,
              padding: 10,
              borderRadius: 15,
            }}
          >
            {user.typeUser === 2 && (
              <TouchableOpacity
                onPress={() => {
                  setShowListSchedule(true);
                }}
              >
                <CircleItem
                  edge={90}
                  style={{
                    backgroundColor: COLORS.accent,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 10,
                  }}
                >
                  <AppImage
                    width={24}
                    height={24}
                    source={require("images/task.png")}
                  />
                  <AppText style={{ color: "white" }}>Lịch biểu</AppText>
                </CircleItem>
              </TouchableOpacity>
            )}
          </View>
        )}

        {showMenuChatBar && (
          <CustomModal
            modalVisible={showListSchedule}
            setModalVisible={setShowListSchedule}
            header={
              <Row style={{ marginTop: 0 }}>
                <InputCheckbox
                  edge={22}
                  onToggle={(tick) => {
                    setIsSellectAll(tick);
                  }}
                />
                <AppText>Chọn tất cả</AppText>
              </Row>
            }
            footer={
              <Row>
                <CustomButton
                  label={"Gửi"}
                  style={{
                    backgroundColor: COLORS.accent,
                  }}
                  onPress={() => {
                    handleSendSchedules();
                  }}
                />
                <CustomButton
                  label={"Thoát"}
                  style={{
                    backgroundColor: COLORS.secondary,
                    borderColor: COLORS.accent,
                    borderWidth: 1,
                  }}
                  styleText={{ color: COLORS.accent }}
                  onPress={() => {
                    setShowListSchedule(false);
                  }}
                />
              </Row>
            }
          >
            <View id="contains-schedules" style={{ marginTop: 30, rowGap: 20 }}>
              {schedules.map((schedule, i) => (
                <View key={i} style={{ rowGap: 15 }}>
                  <CustomCard
                    header={
                      <InputCheckbox
                        initTick={isSelectAll}
                        edge={22}
                        onToggle={(tick) => {
                          handleChangeSelectSchedule(tick, schedule);
                        }}
                      />
                    }
                    body={bodyCardSchedule(schedule)}
                    footer={footerCardSchedule(schedule)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 15,
                    }}
                  />
                </View>
              ))}
            </View>

            <View style={{ marginTop: 10 }}>
              <ChooseDatetime
                label={
                  <AppText fontWeight={"bold"}>
                    Thời gian bắt đầu lịch trình
                  </AppText>
                }
                setDatetime={setStartSchedule}
                datetime={startSchedule}
              />

              <ChooseDatetime
                label={
                  <AppText fontWeight={"bold"}>
                    Thời gian kết thúc lịch trình
                  </AppText>
                }
                setDatetime={setEndSchedule}
                datetime={endSchedule}
              />
            </View>
          </CustomModal>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },

  message: (isSender) => ({
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: isSender ? "flex-end" : "flex-start",
    alignItems: "center",
  }),

  textMessage: (isSender) => ({
    backgroundColor: isSender ? "#00B2CE" : "#303030",
    width: "max-content",
    borderRadius: 15,
    paddingHorizontal: 7,
    paddingVertical: 8,
    color: "white",
  }),
});
