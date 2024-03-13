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
  Alert,
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
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { Ionicons } from "react-native-vector-icons";
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
import { AuthContext } from "../../contexts/AuthProvider";
import ListScheduleActive from "./ListScheduleActive";
import Spin from "../../components/Spin";
import { ChatPrivateContext } from "../../contexts/ChatPrivateProvider";
import { formatDateTime } from "../../utils";

export default function ActiveSchedule({ navigation, route, isDone }) {
  const { user } = useContext(AuthContext);
  const { receiver, dataChat } = useContext(ChatPrivateContext);
  const [editAble, setEditAble] = useState(false);
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState("");
  const [numOfChilds, setNumOfChilds] = useState("0");
  const [childs, setChilds] = useState([]);
  console.log("🚀 ~ ViewSchedule ~ childs:", childs);
  const [timeSchedules, setTimeSchedules] = useState([]);
  console.log("🚀 ~ ViewSchedule ~ timeSchedules:", timeSchedules);
  const [schedule, setSchedule] = useState({});
  console.log("🚀 ~ ViewSchedule ~ schedule:", schedule);
  const [loadingData, setLoadingData] = useState(true);
  const [finishTimeSchedule, setFinishTimeSchedule] = useState([]);
  const [visiableUpImg, setVisiableUpImg] = useState(false);
  const [isNoticeForParent, setIsNoticeForParent] = useState(null);

  console.log(isNoticeForParent);
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Prevent default action
      console.log(isNoticeForParent);
      if (isNoticeForParent !== 1) return;

      e.preventDefault();

      Alert.alert(
        "Chưa gửi thông báo cho phụ huynh",
        'Bạn vừa  cập nhật quá trình làm việc của mình ! Vui lòng nhấn "Cập nhật quá trình" để thông báo cho phụ huynh trước khi rời khỏi màn hình này!',
        [
          {
            text: "Tôi sẽ thông báo ngay !",
            style: "cancel",
            onPress: () => {},
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, isNoticeForParent]);

  useLayoutEffect(() => {
    if (!editAble) {
      const data = { ...schedule };
      setTitle(data.title);
      setNumOfChilds(data.numOfChilds);
      setChilds(data.childs);
      setTimeSchedules(data.timeSchedules);
    }
    navigation.setOptions({
      headerRight: () => {
        return (
          <>
            {user.typeUser === 2 && (
              <CustomButton
                label={editAble ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
                styleText={{ color: COLORS.accent }}
                onPress={() => {
                  setEditAble(!editAble);
                }}
              />
            )}
          </>
        );
      },
      headerTitle: `Lịch Trình Hiện Tại`,
      // headerLeft: () => (
      //   <TouchableOpacity
      //     onPress={() => {
      //       const dataEdit = {
      //         ...schedule,
      //         title,
      //         childs,
      //         timeSchedules,
      //         numOfChilds
      //       }
      //       console.log(schedule, dataEdit)

      //       if(dataEdit !== schedule) {
      //         Alert.alert("ASLDJlkjsad")
      //         return;
      //       }
      //       navigation.goBack();
      //     }}
      //     style={{ paddingLeft: 10 }}
      //   >
      //     <Ionicons name="arrow-back" size={24} />
      //   </TouchableOpacity>
      // ),
    });
  }, [editAble]);

  useLayoutEffect(() => {
    const messageDoc = doc(
      db,
      `chats/${dataChat._id}/messages/${route.params.messageID}`
    );
    const unsubcribe = onSnapshot(messageDoc, (message) => {
      const data = { ...message.data() };
      console.log("🚀 ~ unsubcribe ~ data:", data);
      setFinishTimeSchedule(data.finishTimeSchedule);
    });

    return unsubcribe;
  }, []);
  useLayoutEffect(() => {
    console.log(route);
    const uid = user.typeUser === 2 ? user._id : receiver._id;
    const q = doc(db, `users/${uid}/schedules/${route.params.scheduleID}`);
    const unsubcribe = onSnapshot(q, (snap) => {
      console.log("🚀 ~ unsubcribe ~ snap: ABCDEFGHK", snap);
      const data = { ...snap.data() };

      console.log("🚀 ~ unsubcribe ~ data:", data);
      setSchedule(data);
      setTitle(data.title);
      setNumOfChilds(data.numOfChilds);
      setChilds(data.childs);
      setTimeSchedules(data.timeSchedules);

      // console.log(data, doc.data())
    });

    return unsubcribe;
  }, []);

  const handleSaveEditSchedule = useCallback(async (data) => {
    await updateDoc(
      doc(db, `users/${user._id}/schedules`, `${data.scheduleID}`),
      {
        ...data,
      }
    );
  }, []);

  useEffect(() => {
    const un = setTimeout(() => {
      setLoadingData(false);
    }, 2000);

    return () => {
      clearTimeout(un);
    };
  }, []);
  const handleAddTimeSchedule = useCallback((data) => {
    setTimeSchedules((prev) => [...prev, data]);
  }, []);

  const handleEditTimeSchedule = useCallback((data) => {
    setTimeSchedules((prev) =>
      prev.map((v, i) => {
        if (v.timeScheduleID === data.timeScheduleID) {
          return { ...v, ...data };
        } else return v;
      })
    );
  }, []);

  const handleRemoveTimeSchedule = useCallback((timeScheduleID) => {
    setTimeSchedules((prev) =>
      prev.filter((v, i) => v.timeScheduleID !== timeScheduleID)
    );
  }, []);

  const handleMarkFishTimeSchedule = useCallback(async (tick, timeSche) => {
    console.log("🚀 ~ handleMarkFishTimeSchedule ~ tick:", tick);
    const messageDoc = doc(
      db,
      `chats/${dataChat._id}/messages/${route.params.messageID}`
    );
    await updateDoc(messageDoc, {
      finishTimeSchedule: tick
        ? arrayUnion(timeSche.timeScheduleID)
        : arrayRemove(timeSche.timeScheduleID),
    }).then(() => {
      console.log("123213");
      setIsNoticeForParent(1);
    });
  }, []);

  const handleSendNoticeMarkDoneToParent = async () => {
    const timeDone = "Bảo mẫu đã hoàn thành các mốc thời gian: ";
    for(time in finishTimeSchedule) {
      const findTime = timeSchedules.find((v) => v.timeScheduleID === time);
      timeDone += formatDateTime(findTime.time).T + ", ";
    }
    timeDone += " !!!";
    
    
  }
  const handleUploadImgChild = async (mode, childID) => {
    await uploadImage(mode).then((res) => {
      if (!res) return;
      setChilds((prev) => {
        console.log(prev);
        return prev.map((v, i) => ({
          ...v,
          image: v.id === childID ? { ...res } : v.image,
        }));
      });
      setVisiableUpImg(false);
    });
  };

  const handleFinishSchedule = async () => {
    const messageDoc = doc(
      db,
      `chats/${dataChat._id}/messages/${route.params.messageID}`
    );
    await updateDoc(messageDoc, {
      isDone: true,
    });
  };
  return (
    <>
      {loadingData ? (
        <Spin />
      ) : (
        <View
          style={{
            backgroundColor: COLORS.background,
            flex: 1,
            paddingHorizontal: 10,
            marginTop: 20,
          }}
        >
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
          {editAble ? (
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
          ) : (
            <View style={{ flexDirection: "row", columnGap: 15 }}>
              <AppText style={{ fontWeight: "bold" }}>Tên lịch biểu :</AppText>
              <AppText style={{ fontWeight: "bold" }}>{title}</AppText>
            </View>
          )}

          {editAble ? (
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
                const childs = Array.from({ length: parseInt(text) }).map(
                  (v, i) => ({ fullName: "", age: "", image: "" })
                );
                setChilds((prev) => [
                  ...prev,
                  ...childs.slice(0, Math.abs(prev.length - childs.length)),
                ]);
              }}
            />
          ) : (
            <View style={{ flexDirection: "row", columnGap: 15 }}>
              <AppText style={{ fontWeight: "bold" }}>Số bé :</AppText>
              <AppText style={{ fontWeight: "bold" }}>{numOfChilds}</AppText>
            </View>
          )}

          {childs.length > 0 && (
            <View id="list-childs">
              <View>
                {editAble ? (
                  <View id="edit-able" style={{ rowGap: 10 }}>
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
                ) : (
                  <View id="edit-unable" style={{ rowGap: 10 }}>
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

                    <View style={{ flexDirection: "row", columnGap: 15 }}>
                      <AppText style={{ fontWeight: "bold" }}>
                        Họ và Tên :
                      </AppText>
                      <AppText style={{ fontWeight: "bold" }}>
                        {childs[page].fullName}
                      </AppText>
                    </View>

                    <View style={{ flexDirection: "row", columnGap: 15 }}>
                      <AppText style={{ fontWeight: "bold" }}>Tuổi :</AppText>
                      <AppText style={{ fontWeight: "bold" }}>
                        {childs[page].age}
                      </AppText>
                    </View>
                  </View>
                )}
              </View>

              <Row
                style={{ marginTop: 5, marginBottom: 15, marginLeft: "auto" }}
              >
                <CustomButton
                  disable={page === 0 ? true : false}
                  label={"Trước đó"}
                  style={{
                    backgroundColor: page === 0 ? "grey" : COLORS.accent,
                  }}
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

          <ListScheduleActive
            onAddTimeSchedule={handleAddTimeSchedule}
            onRemoveTimeSchedule={handleRemoveTimeSchedule}
            timeSchedules={timeSchedules}
            finishTimeSchedule={finishTimeSchedule}
            onEditTimeSchedule={handleEditTimeSchedule}
            readOnly={!editAble}
            isDone={isDone}
            startActive={true}
            onMarkFinishTimeSchedule={handleMarkFishTimeSchedule}
          />

          {editAble && (
            <Row style={{ marginVertical: 15, marginLeft: "auto" }}>
              <CustomButton
                label={"Lưu Thay Đổi"}
                style={{ backgroundColor: COLORS.accent }}
                onPress={() => {
                  handleSaveEditSchedule({
                    scheduleID: schedule.scheduleID,
                    title,
                    childs,
                    timeSchedules,
                    updatedAt: Date.now(),
                    numOfChilds,
                  });
                  setEditAble(!editAble);
                }}
              />
              <CustomButton
                label={"Hủy"}
                style={{ backgroundColor: COLORS.secondary }}
                styleText={{ color: COLORS.accent }}
              />
            </Row>
          )}

          {user.typeUser === 2 && !editAble && (
            <View style={{ marginVertical: 10 }}>
              <Row>
                <InputCheckbox edge={15} />
                <AppText>Xác nhận bảo mẫu hoàn thành lịch trình</AppText>
              </Row>
              <CustomButton
                label={"Cập nhật"}
                style={{ backgroundColor: COLORS.accent }}
                onPress={() => {
                  handleFinishSchedule();
                }}
              />
            </View>
          )}

          {user.typeUser === 1 && (
            <CustomButton
              label={"Cập nhật quá trình"}
              style={{
                backgroundColor: COLORS.accent,
                marginBottom: 10,
                marginTop: "auto",
              }}
              onPress={() => {
                setIsNoticeForParent(2);
                handleSendNoticeMarkDoneToParent();
              }}
            />
          )}
        </View>
      )}
    </>
  );
}
