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
} from "../../components";

export default function ViewSchedule({ navigation }) {
  const [visiableModalAdd, setVisiableModalAdd] = useState(false);
  const [showTimeModalAdd, setShowTimeModalAdd] = useState(false);
  const [timeModalAdd, setTimeModalAdd] = useState(new Date());
  const [textNote, setTextNote] = useState("àasafafas");
  const [editAble, setEditAble] = useState(false);

  const headerModalAdd = (
    <View>
      {editAble ? (
        <AppText style={{ fontWeight: "bold" }}>
          Chỉnh sửa mốc thời gian
        </AppText>
      ) : (
        <AppText style={{ fontWeight: "bold" }}>Xem mốc thời gian</AppText>
      )}
    </View>
  );

  const footerModalAdd = (
    <View>
      {editAble ? (
        <View
          style={{
            flexDirection: "row",
            columnGap: 10,
            marginLeft: "auto",
            marginTop: 10,
          }}
        >
          <CustomButton
            label={"Lưu"}
            style={{
              backgroundColor: COLORS.accent,

              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => {}}
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
              setVisiableModalAdd(false);
            }}
          />
        </View>
      ) : (
        <CustomButton
          label={"Thoát"}
          style={{
            backgroundColor: COLORS.accent,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            marginLeft: "auto",
            marginTop: 10,
          }}
          onPress={() => {
            setVisiableModalAdd(false);
          }}
        />
      )}
    </View>
  );

  return (
    <AppSafeAreaView
      style={{
        backgroundColor: COLORS.background,
        flex: 1,
      }}
    >
      <View id="header" style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={30} />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: 700,
            color: COLORS.text,
            fontSize: 20,
          }}
        >
          LỊCH BIỂU
        </Text>

        <CustomButton
          label={editAble ? "Hủy Chỉnh Sửa" : "Chỉnh sửa"}
          style={{ marginTop: 0, marginLeft: "auto" }}
          styleText={{ color: COLORS.accent, fontSize: 18 }}
          onPress={() => {
            setEditAble(!editAble);
          }}
        />
      </View>

      {editAble ? (
        <InputGroup
          label={
            <AppText id="label" style={{ fontWeight: "bold" }}>
              Họ và Tên :
            </AppText>
          }
          row={true}
          placeholder={"Nhập tên ...."}
          styleInput={{ backgroundColor: "white", flex: 1 }}
        />
      ) : (
        <View style={{ flexDirection: "row", columnGap: 15 }}>
          <AppText style={{ fontWeight: "bold" }}>Họ và Tên :</AppText>
          <AppText style={{ fontWeight: "bold" }}>Nguyen Van A</AppText>
        </View>
      )}

      {editAble ? (
        <InputGroup
          label={
            <AppText id="label" style={{ fontWeight: "bold" }}>
              Tuổi :
            </AppText>
          }
          row={true}
          placeholder="Nhập tuổi ..."
          styleInput={{ backgroundColor: "white", flex: 1 }}
        />
      ) : (
        <View style={{ flexDirection: "row", columnGap: 15 }}>
          <AppText style={{ fontWeight: "bold" }}>Tuổi :</AppText>
          <AppText style={{ fontWeight: "bold" }}>1 tuổi</AppText>
        </View>
      )}

      <View>
        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
        >
          <AppText style={{ fontWeight: "bold" }}>Các Khung giờ</AppText>
          {editAble && (
            <TouchableOpacity
              onPress={() => {
                setVisiableModalAdd(true);
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
        <AppText style={{ color: "grey", fontStyle: "italic" }}>
          Chưa có khung giờ nào !!!
        </AppText>
        <CustomModal
          header={headerModalAdd}
          footer={footerModalAdd}
          modalVisible={visiableModalAdd}
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
              label={timeModalAdd.toTimeString().split(" ")[0]}
              style={{
                backgroundColor: "#f5f5f5",
                paddingVertical: 4,
                paddingHorizontal: 5,
              }}
              styleText={{ color: "black" }}
              onPress={() => {
                setShowTimeModalAdd(true);
              }}
            />
            {showTimeModalAdd && (
              <DateTimePicker
                value={timeModalAdd}
                mode="time"
                is24Hour={true}
                onChange={({ nativeEvent }) => {
                  setShowTimeModalAdd(false);
                  setTimeModalAdd(new Date(nativeEvent.timestamp));
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
            readOnly={!editAble}
          />

          <View style={{ flexDirection: "row", columnGap: 10 }}>
            {editAble && (
              <TouchableOpacity>
                <AppImage
                  width={40}
                  height={40}
                  source={require("../../assets/images/gallery_add.png")}
                />
              </TouchableOpacity>
            )}
            <ScrollView horizontal contentContainerStyle={{ columnGap: 10 }}>
              {Array.from({ length: 8 }).map((v, i) => (
                <View key={i}>
                  <AppImage
                    width={40}
                    height={40}
                    source={require("../../assets/images/bbst_1.jpg")}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </CustomModal>

        <ScrollView
          contentContainerStyle={{ rowGap: 20 }}
          style={{ marginTop: 20, maxHeight: 400 }}
        >
          {Array.from({ length: 5 }).map((v, i) => (
            <View
              key={i}
              style={{
                backgroundColor: COLORS.secondary,
                borderRadius: 10,
                padding: 10,
                elevation: 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  columnGap: 10,
                  position: "relative",
                }}
              >
                <AppText>11:05</AppText>

                <InputGroup
                  label={
                    <AppText style={{ fontWeight: "bold" }}>Ghi Chú :</AppText>
                  }
                  styleInput={{ backgroundColor: "white" }}
                  styleRoot={{ flex: 1 }}
                  multiline={true}
                  value={"Data Text note"}
                />
              </View>

              {editAble ? (
                <View
                  id="actions"
                  style={{
                    flexDirection: "row",
                    columnGap: 10,
                    marginLeft: "auto",
                  }}
                >
                  <CustomButton
                    label={`Xem / Chỉnh Sửa`}
                    style={{
                      backgroundColor: COLORS.accent,
                    }}
                    styleText={{}}
                    onPress={() => {
                      setVisiableModalAdd(true);
                    }}
                  />

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
                    onPress={() => {}}
                  />
                </View>
              ) : (
                <View
                  id="actions"
                  style={{
                    flexDirection: "row",
                    columnGap: 10,
                    marginLeft: "auto",
                  }}
                >
                  <CustomButton
                    label={`Xem`}
                    style={{
                      backgroundColor: COLORS.accent,
                    }}
                    styleText={{}}
                    onPress={() => {
                      setVisiableModalAdd(true);
                    }}
                  />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {editAble ? (
          <View
            style={{
              flexDirection: "row",
              columnGap: 10,
              marginTop: 20,
              marginLeft: "auto",
            }}
          >
            <CustomButton
              label={"Lưu lại"}
              style={{
                backgroundColor: COLORS.accent,
              }}
              onPress={() => {}}
            />

            <CustomButton
              label={"Hủy"}
              style={{
                backgroundColor: COLORS.secondary,
              }}
              styleText={{ color: "black" }}
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
        ) : (
          <CustomButton
            label={"Thoát"}
            style={{
              backgroundColor: COLORS.accent,
              marginLeft: "auto",
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        )}
      </View>
    </AppSafeAreaView>
  );
}
