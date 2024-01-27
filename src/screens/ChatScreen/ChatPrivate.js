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
} from "firebase/firestore"
import { db } from "../../firebase/config";
import { AuthContext } from "../../contexts/AuthProvider";

import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../../constants/COLORS";
import {
  AppSafeAreaView,
  AppText,
  AppImage,
  CircleItem,
  CustomModal,
  CustomCard,
  CustomButton,
  InputCheckbox
} from "../../components";

export default function ChatScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const messagesEl = useRef();
  const [messages, setMessages] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [showMenuChatBar, setShowMenuChatBar] = useState(false);
  const [showListSchedule, setShowListSchedule] = useState(false);

  const onSendMessage = async () => {
    if (textMessage === "") return;
    console.log(textMessage);
    var c = Date(Date.now());
    console.log(typeof c);
    const docRef = await addDoc(collection(db, "conversations"), {
      senderID: user.uid,
      receiverID: route.params.uid,
      text: textMessage,
      createdAt: Date.now(),
    });
    console.log(docRef);
    setTextMessage("");
  };

  const bodyCardSchedule = (text) => (
    <View>
      <AppText style={{ fontWeight: "bold" }}>{text}</AppText>
      <AppText style={{ color: "grey" }}>Ngày tạo : 11/12/2014</AppText>
    </View>
  );

  const footerCardSchedule = () => (
    <View>
      <CustomButton
        label={"Xem"}
        style={{
          backgroundColor: COLORS.accent,
          paddingHorizontal: 15,
          marginTop: 0,
        }}
        onPress={() => {
          navigation.navigate("ViewSchedule");
        }}
      />
    </View>
  );

  useEffect(() => {
    const collectionRef = collection(db, "conversations");
    let q = query(
      collectionRef,
      orderBy("createdAt", "asc"),
      or(
        and(
          where("senderID", "==", user.uid),
          where("receiverID", "==", route.params.uid)
        ),
        and(
          where("senderID", "==", route.params.uid),
          where("receiverID", "==", user.uid)
        )
      )
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("SNAPPPPP SHOT UDATE COLLECTION")
      setMessages(
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          _id: doc.id,
        }))
      );
    });

    return unsubscribe;
  }, []);

  return (
    <AppSafeAreaView
      style={{
        width: "100%",
        height: "100%",
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
          Hello ChatApp
        </Text>
      </View>

      <ScrollView
        id="container-chat"
        ref={messagesEl}
        onContentSizeChange={() =>
          messagesEl.current.scrollToEnd({ animated: true })
        }
        style={{
          maxHeight: "80%",
        }}
      >
        {messages &&
          messages.map((m, i) => {
            return (
              <View style={styles.message(m.senderID === user.uid)} key={i}>
                <Text style={styles.textMessage(m.senderID === user.uid)}>
                  {m.text}
                </Text>
              </View>
            );
          })}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", columnGap: 15 }}>
          <TouchableOpacity
            onPress={() => {
              setShowMenuChatBar(!showMenuChatBar);
            }}
          >
            <AppImage
              width={30}
              height={30}
              source={require("../../assets/images/menu_bar_4dot.png")}
            />
          </TouchableOpacity>
          <TextInput
            style={{
              borderBottomWidth: 2,
              borderBottomColor: "black",
              flex: 1,
            }}
            value={textMessage}
            placeholder="Enter Text"
            onChangeText={(text) => setTextMessage(text)}
          ></TextInput>
          <Button onPress={() => onSendMessage()} title="SEND" />
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
                  source={require("../../assets/images/task.png")}
                />
                <AppText style={{ color: "white" }}>Lịch biểu</AppText>
              </CircleItem>
            </TouchableOpacity>
          </View>
        )}

        <CustomModal
          modalVisible={showListSchedule}
          setModalVisible={setShowListSchedule}
          footer={
            <CustomButton
              label={"Thoát"}
              style={{ backgroundColor: COLORS.accent, marginLeft: "auto" }}
              onPress={() => {
                setShowListSchedule(false);
              }}
            />
          }
        >
          <View id="contains-schedules" style={{ marginTop: 30, rowGap: 20 }}>
            {Array.from({ length: 3 }).map((v, i) => (
              <View key={i} style={{ rowGap: 15 }}>
                <CustomCard
                  header={<InputCheckbox edge={22} />}
                  body={bodyCardSchedule(`Be Nguyen Van ${i}`)}
                  footer={footerCardSchedule()}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 15,
                  }}
                />
              </View>
            ))}
          </View>
        </CustomModal>
      </View>
    </AppSafeAreaView>
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
