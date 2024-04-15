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
} from "../../components";
import { db } from "../../firebase/config";
import { AuthContext } from "../../contexts/AuthProvider";
import { ScheduleContext } from "../../contexts/ScheduleProvider";
import ListSchedule from "./ListSchedule";
import Spin from "../../components/Spin";
import * as ImagePicker from "expo-image-picker";


export default function ViewSchedule({ navigation, route }) {
  console.log("🚀 ~ ViewSchedule ~ route:", route)
  console.log("🚀 ~ ViewSchedule ~ navigation:", navigation)
  const { user } = useContext(AuthContext);
  const {timeSchedules, setTimeSchedules, childs, setChilds, schedule, setSchedule} = useContext(ScheduleContext);
  const [editAble, setEditAble] = useState(false);
  const [page, setPage] = useState(0);

  const [visiableUpImg, setVisiableUpImg] = useState(false);

  useLayoutEffect(() => {
    if (!editAble) {
      const data = { ...schedule };
      console.log("🚀 ~ useLayoutEffect ~ data:", data)
      setChilds(data.childs);
      setTimeSchedules(data.timeSchedules);
    }
    navigation.setOptions({
      headerRight: () => {
        return (
          <CustomButton
            label={editAble ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
            styleText={{ color: COLORS.accent }}
            onPress={() => {
              setEditAble(!editAble);
            }}
          />
        );
      },
      headerTitle: `Xem Lịch Biểu`,
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
    
  }, []);

  const handleSaveEditSchedule = useCallback(async (data) => {
    await updateDoc(
      doc(db, `users/${user._id}/schedules`, `${data.scheduleID}`),
      {
        ...data,
      }
    );
  }, []);


  const uploadImg = async (mode, childID) => {
    if (mode === "camera") {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        console.log(result.assets[0]);
        setChilds((prev) => {
          console.log(prev);
          return prev.map((v, i) => ({
            ...v,
            image: v.id === childID ? result.assets[0].uri : v.image,
          }));
        });
        setVisiableUpImg(false);
      }
    }
  };





  return (
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
              uploadImg("camera", childs[page].id);
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
              uploadImg("gallery", childs[page].id);
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
          value={schedule.title}
          onChangeText={(text) => {
            setSchedule(prev => ({...prev, title: text}));
          }}
        />
      ) : (
        <View style={{ flexDirection: "row", columnGap: 15 }}>
          <AppText style={{ fontWeight: "bold" }}>Tên lịch biểu :</AppText>
          <AppText style={{ fontWeight: "bold" }}>{schedule.title}</AppText>
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
          value={schedule.numOfChilds}
          onChangeText={(text) => {
            setSchedule(prev => ({...prev, numOfChilds: text}));
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
          <AppText style={{ fontWeight: "bold" }}>{schedule.numOfChilds}</AppText>
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
                        ? childs[page].image.urlFirebase
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
                      ? childs[page].image.urlFirebase
                      : require("images/upload_image.png")
                  }
                  type={childs[page].image ? "uri" : "icon"}
                  style={{ resizeMode: "contain" }}
                />

                <View style={{ flexDirection: "row", columnGap: 15 }}>
                  <AppText style={{ fontWeight: "bold" }}>Họ và Tên :</AppText>
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

          <Row style={{ marginTop: 5, marginBottom: 15, marginLeft: "auto" }}>
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

      <ListSchedule
        readOnly={!editAble}
      />

      {editAble && (
        <Row style={{ marginVertical: 15, marginLeft: "auto" }}>
          <CustomButton
            label={"Lưu Thay Đổi"}
            style={{ backgroundColor: COLORS.accent }}
            onPress={() => {
              handleSaveEditSchedule({
                scheduleID: schedule.scheduleID,
                title: schedule.title,
                childs,
                timeSchedules,
                updatedAt: Date.now(),
                numOfChilds: schedule.numOfChilds,
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
    </View>
  );
}
