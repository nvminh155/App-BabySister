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
import { db } from "../../firebase/config";
import { AuthContext } from "../../contexts/AuthProvider";
// import moment from "moment";
// require("moment/locale/vi");

import DateTimePicker from "@react-native-community/datetimepicker";

import { MaterialIcons, Ionicons } from "react-native-vector-icons";

import { COLORS } from "../../constants/COLORS";

import {
  CustomButton,
  AppImage,
  CustomModal,
  InputField,
  AppSafeAreaView,
  AppText,
} from "../../components";

export default function InfoSisterScreen({
  navigation,
  route,
  onChooseSister,
  style,
  sister,
  choosedUid,
  choosed = false,
  onReview,
  isRated
}) {
  const [visiableRate, setVisiableRate] = useState(false);
  const [numStar, setNumStar] = useState(0);
  const [textRate, setTextRate] = useState("");

  const footerRate = (
    <View style={{ flexDirection: "row", columnGap: 10 }}>
      <CustomButton
        label={"Gửi"}
        style={{
          backgroundColor: COLORS.accent,
          paddingHorizontal: 15,
          paddingVertical: 4,
          borderRadius: 5,
        }}
        onPress={() => {
          onReview(sister.uid, numStar, textRate);
        }}
      />
      <CustomButton
        label={"Hủy"}
        style={{
          backgroundColor: COLORS.secondary,
          paddingHorizontal: 15,
          paddingVertical: 4,
          borderRadius: 5,
        }}
        styleText={{ color: "black", fontWeight: "normal" }}
        onPress={() => {
          setVisiableRate(!visiableRate);
        }}
      />
    </View>
  );

  return (
    <View
      style={[
        {
          paddingHorizontal: 10,
          marginBottom: 10,
        },
        style,
      ]}
    >
      <CustomModal
        modalVisible={visiableRate}
        setModalVisible={setVisiableRate}
        footer={footerRate}
      >
        <View
          id="stars"
          style={{ flexDirection: "row", columnGap: 10, marginBottom: 10 }}
        >
          {Array.from({ length: 5 }).map((v, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setNumStar(i + 1 === numStar ? i : i + 1);
                }}
              >
                <AppImage
                  width={24}
                  height={24}
                  source={
                    i + 1 <= numStar
                      ? require("images/star.png")
                      : require("images/star_empty.png")
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <AppImage
            width={60}
            height={60}
            source={require("images/bbst_1.jpg")}
            options={{ styles: { borderRadius: 30, marginRight: 10 } }}
          />
          <TextInput
            style={{
              backgroundColor: COLORS.secondary,
              width: "100%",
              color: "black",
              paddingVertical: 15,
              paddingHorizontal: 10,
              borderRadius: 20,
            }}
            multiline={true}
            placeholder="Bạn cảm thấy thế nào về bảo mẫu ?"
            value={textRate}
            onChangeText={(text) => {
              setTextRate(text);
            }}
          />
        </View>
      </CustomModal>

      <ScrollView>
        <View style={{ flexDirection: "row", columnGap: 20, marginTop: 20 }}>
          <AppImage
            width={100}
            height={200}
            options={{
              styles: { borderWidth: 1, borderColor: "grey" },
            }}
            source={require("images/bbst_1.jpg")}
          />
          <View style={{ width: 150, rowGap: 15 }}>
            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <AppText style={{ fontWeight: "700", color: COLORS.text }}>
                Họ và tên :
              </AppText>
              <AppText numberOfLines={2}>{sister.displayName}</AppText>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <AppText style={{ fontWeight: "700" }}>Địa chỉ :</AppText>
              <AppText numberOfLines={2}>
                {sister.address ? sister.address : "Chưa có"}
              </AppText>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10, flexWrap: 'wrap' }}>
              <AppText style={{ fontWeight: "700" }}>Số điện thoại :</AppText>
              <AppText numberOfLines={2}>{sister.phone}</AppText>
            </View>



            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <AppText style={{ fontWeight: "700" }}>Kinh nghiệm :</AppText>
              <AppText numberOfLines={2}>???</AppText>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <AppText style={{ fontWeight: "700" }}>Đánh giá :</AppText>
              <AppText numberOfLines={2}>COMPUTING</AppText>
            </View>

            <View style={{ flexDirection: "row", columnGap: 10, flexWrap: 'wrap' }}>
              <AppText style={{ fontWeight: "700" }}>Bằng cấp :</AppText>
              <AppText numberOfLines={2}>?????</AppText>
            </View>
          </View>
        </View>

        <View style={{flex: 1}}>
          <AppText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
              marginVertical: 20,
            }}
          >
            CÁC ĐÁNH GIÁ
          </AppText>

          {!isRated && <CustomButton
            label={"Đánh Giá"}
            style={{
              backgroundColor: COLORS.accent,
              paddingHorizontal: 3,
              paddingVertical: 3,
              width: 100,
              borderRadius: 15,
              marginLeft: "auto",
              marginBottom: 10,
            }}
            onPress={() => {
              setVisiableRate(!visiableRate);
            }}
          />}

          <ScrollView
            id="reviewer"
            style={{ height: 200, paddingVertical: 10, flex: 1 }}
            nestedScrollEnabled
          >
            {[1, 2, 3, 4, 5, 6].map((v) => (
              <View
                key={v}
                style={{
                  flexDirection: "row",
                  columnGap: 20,
                  alignItems: "center",
                  marginBottom: 20,
                  flex: 1,
                  
                }}
              >
                <AppImage
                  width={45}
                  height={45}
                  options={{
                    styles: {
                      borderRadius: 30,
                      borderWidth: 1,
                      borderColor: "black",
                    },
                  }}
                  source={require("images/bbst_1.jpg")}
                />
                <View style={{ rowGap: 10}}>
                  <View
                    style={{
                      rowGap: 5,
                      
                    }}
                  >
                    <AppText style={{ fontWeight: "600" }}>
                      Nguyen Nguyen Thi Van {v}
                    </AppText>
                    <View style={{ flexDirection: "row", columnGap: 4 }}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <View key={v}>
                          <AppImage
                            width={10}
                            height={10}
                            source={require("images/star.png")}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                  <AppText style={{ color: "grey" }} >
                    Ban nay tuyet voi lam Ban nay tuyet voi lam Ban nay tuyet
                    voi lam Ban nay tuyet voi lam
                  </AppText>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {!choosed ? (
        <CustomButton
          label={"Chọn"}
          style={{ backgroundColor: COLORS.accent, marginLeft: "auto" }}
          onPress={() => {
            if (choosedUid === sister.uid) {
              onChooseSister(null);
              return;
            }
            onChooseSister(sister.uid, sister);
          }}
        />
      ) : (
        <CustomButton
          label={"Liên hệ ngay"}
          style={{ backgroundColor: COLORS.accent, marginLeft: "auto" }}
          onPress={() => {
            navigation.navigate("ChatPrivateStack", {receiverID: sister.uid});
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({

});
