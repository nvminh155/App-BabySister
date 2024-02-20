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
} from "react-native";

import { useContext, useEffect, useLayoutEffect, useState } from "react";

// FIRE BASE

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
  InputGroup,
} from "../../components";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import { formatDateTime } from "../../utils";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

function NoticeJobAccepted({ data }) {
  const colorNotice = () => {
    const type = data.type;
    if(type === "accepted") return COLORS.textInfo
    else if(type === "donejob") return COLORS.accent
    return COLORS.textDanger
  }
    

  return (
    <TouchableOpacity
      style={{
        borderLeftColor: colorNotice(),
        borderLeftWidth: 5,
        borderRadius: 5,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,

        marginTop: 10,
        backgroundColor: COLORS.secondary,
        paddingVertical: 10,
        paddingLeft: 15,
      }}
    >
      <CustomCard
        style={{
          alignItems: "center",
          columnGap: 10,
          paddingRight: 25,
          justifyContent: "center",
          marginLeft: 5,
        }}
        header={
          <Row style={{ flexWrap: "wrap", columnGap: 0,marginBottom: 10 }}>
            <AppText
              style={{ marginBottom: 5 }}
              color={colorNotice()}
              fontWeight={"bold"}
            >
              {data.text}
            </AppText>
            <AppImage
              width={24}
              height={24}
              source={
                data.type === "accepted" || data.type === "donejob"
                  ? require("images/tick.png")
                  : require("images/untick.png")
              }
            />
          </Row>
        }
        body={
          <View>
            <AppText>
              Tại: <AppText fontWeight={"bold"}>{data.address}</AppText>
            </AppText>
            <AppText>
              Vào lúc:{" "}
              <AppText fontWeight={"bold"} numberOfLines={2}>
                {formatDateTime(data.time).DDMYTS}
              </AppText>
            </AppText>
            <AppText color={'grey'} style={{marginTop: 20}}>
              {formatDateTime(data.createdAt).DDMYTS}
            </AppText>
          </View>
        }
      />
    </TouchableOpacity>
  );
}

export default function NoticeScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [noticeJobs, setNoticeJobs] = useState([]);

  const fetchNotice = async () => {
    const q = query(collection(db, `notices/${user.uid}/jobs`));
    const docs = (await getDocs(q)).docs;

    setNoticeJobs(docs.map((doc) => ({ ...doc.data(), _id: doc.id })));
  };

  useEffect(() => {
    fetchNotice();
    // console.log("MOUTED INDEX NOTICE");
  }, []);

  return (
    <ScrollView
      style={{
        paddingHorizontal: 10,
        flex: 1,
        marginVertical: 15 
      }}
    >
      {noticeJobs.map((notice, i) => (
        <NoticeJobAccepted key={i} data={notice} />
      ))}
    </ScrollView>
  );
}
