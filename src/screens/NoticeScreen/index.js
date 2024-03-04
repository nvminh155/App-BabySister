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
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import { formatDateTime } from "../../utils";

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

function NoticeJobAccepted({ data }) {
  const colorNotice = COLORS.textInfo;
  return (
    <TouchableOpacity
      style={{
        borderLeftColor: colorNotice,
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
          flexDirection: "row",
          alignItems: "center",
          columnGap: 10,
          paddingRight: 25,
          justifyContent: "center",
          marginLeft: 5,
        }}
        body={
          <View>
            <Row style={{ columnGap: 0 }}>
              <AppText
                style={{ marginBottom: 5 }}
                color={colorNotice}
                fontWeight={"bold"}
              >
                {data.text}
                <AppImage
                  width={24}
                  height={24}
                  source={require("images/noticeInfo.png")}
                />
              </AppText>
            </Row>
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
  const [noticePosts, setNoticePosts] = useState([]);

  const fetchNotice = async () => {
    const q = query(collection(db, `notices/${user.uid}/posts`), orderBy('createdAt', 'desc'));
    const docs = (await getDocs(q)).docs;

    setNoticePosts(docs.map((doc) => ({ ...doc.data(), _id: doc.id })));
  };

  useEffect(() => {
    fetchNotice();
    console.log("MOUTED INDEX NOTICE PHU HUYNH");
  }, []);

  return (
    <ScrollView
      style={{
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 10,
        flex: 1,
      }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {noticePosts.map((notice, i) => (
        <NoticeJobAccepted key={i} data={notice} />
      ))}

    </ScrollView>
  );
}
