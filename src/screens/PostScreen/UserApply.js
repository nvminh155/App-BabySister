// REACT ( NATIVE )
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";

import { useContext, useEffect, useState } from "react";

// FIRE BASE
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  or,
  and,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

// CONTEXT
import { AuthContext } from "../../contexts/AuthProvider";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../../constants/COLORS";

import {
  AppSafeAreaView,
  AppText,
  AppImage,
  CustomCard,
  CustomButton,
  Row,
  CustomModal,
} from "../../components";
import { formatDateTime, formatMoney } from "../../utils";

import InfoSisterScreen from "./InfoSisterScreen";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function UserApply({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [job, setJob] = useState(route.params.job);
  const [choosed, setChoosed] = useState(null);
  const [showInfoSister, setShowInfoSister] = useState(false);
  const [infoSister, setInfoSister] = useState(null);


  const onChooseSister = async (uid) => {
    console.log("CHOSSED SISTER", uid, choosed);

    
    let confirm = false;
    await Alert.alert(
      "Bạn có chắc ? ",
      `Bạn đã đọc kỹ thông tin và muốn ${uid ? "chọn" : "hủy chọn"} SISTER: ${infoSister.displayName} ? `,
      [
        {
          text: `Có, Tôi muốn ${uid ? "chọn" : "hủy chọn"} !`,
          onPress: () => {
            if (choosed && uid) {
             
              return;
            }

            setChoosed(uid);
          },
          style: "destructive",
        },
        {
          text: "Không",
          onPress: () => {},
          style: "cancel",
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ paddingHorizontal: 10, marginTop: 20, marginBottom: 20 }}
      contentContainerStyle={{ rowGap: 15 }}
    >
      <CustomModal
        modalVisible={infoSister ? true : false}
        header={
          <TouchableOpacity
            onPress={() => {
              setInfoSister(null);
            }}
          >
            <AppImage
              width={24}
              height={24}
              source={require("images/close_x.png")}
            />
          </TouchableOpacity>
        }
      >
        <InfoSisterScreen
          sister={infoSister}
          onChooseSister={onChooseSister}
          choosedUid={choosed}
        />
      </CustomModal>
      {job.applies.map((sister, i) => (
        <CustomCard
          key={i}
          style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}
          header={
            <AppImage
              width={50}
              height={50}
              source={require("images/bbst_1.jpg")}
            />
          }
          body={
            <View style={{ flex: 1 }}>
              <AppText fontWeight={"bold"}>{sister.displayName}</AppText>
              <AppText style={{ fontStyle: "italic", opacity: 0.5 }}>
                Chưa từng thuê trước đây
              </AppText>
            </View>
          }
          footer={
            <View>
              <CustomButton
                label={"Xem"}
                style={{ backgroundColor: COLORS.accent }}
                onPress={() => {
                  console.log(123);
                  setInfoSister(sister);
                }}
              />
            </View>
          }
        />
      ))}
    </ScrollView>
  );
}
