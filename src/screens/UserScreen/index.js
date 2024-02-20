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

import { useContext, useLayoutEffect, useState } from "react";

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

const wWidth = Dimensions.get("window").width;
const wHeight = Dimensions.get("window").height;

export default function UserScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [listFollowing, setListFollowing] = useState(null);
  const [editAble, setEditAble] = useState(false);
  console.log(editAble);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CustomButton
          label={editAble ? "Hủy chỉnh sửa" : "Chỉnh Sửa"}
          style={{ marginTop: 0 }}
          styleText={{ color: COLORS.accent }}
          onPress={() => {
            setEditAble(!editAble);
          }}
        />
      ),
    });
  }, [editAble]);
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <CustomCard
        style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
        header={
          <Row style={{ justifyContent: "center" }}>
            <AppImage
              width={100}
              height={100}
              source={require("images/bbst_1.jpg")}
            />
            <CustomButton
              label={"Chỉnh sửa ảnh"}
              style={{ position: "absolute", bottom: -10 }}
            />
          </Row>
        }
        body={
          <View style={{ alignItems: "flex-start" }}>
            <AppText fontWeight={"bold"} fontSize={20}>
              {user.displayName}
            </AppText>
            <Row>
              <AppImage
                width={32}
                height={32}
                source={require("images/collab.png")}
              />

              <AppText fontSize={20}>{user.typeUser === 1 ? "Cộng Tác Viên" : "Phụ Huynh"}</AppText>
            </Row>
          </View>
        }
      />

      <View style={{ marginTop: 40 }}>
        <InputGroup
          label={<AppText>Email</AppText>}
          row={true}
          value={"??"}
          colorTextInput={!editAble ? "black" : null}
          readOnly={!editAble}
          styleRoot={{ columnGap: 30 }}
        />
        <InputGroup
          label={<AppText>Số điện thoại</AppText>}
          row={true}
          value={"??"}
          colorTextInput={!editAble ? "black" : null}
          readOnly={!editAble}
          styleRoot={{ columnGap: 30 }}
        />
        <InputGroup
          label={<AppText>Giới tính</AppText>}
          row={true}
          value={"??"}
          colorTextInput={!editAble ? "black" : null}
          readOnly={!editAble}
          styleRoot={{ columnGap: 30 }}
        />
      </View>

      {editAble && (
        <CustomButton
          label={"Lưu"}
          style={{ backgroundColor: COLORS.accent, paddingVertical: 15 }}
          styleText={{ fontSize: 20 }}
        />
      )}
    </View>
  );
}
