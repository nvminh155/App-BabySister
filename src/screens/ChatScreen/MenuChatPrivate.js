import { useContext, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";

import { Ionicons, AntDesign } from "react-native-vector-icons";

import {
  AppText,
  CustomButton,
  CustomCard,
  Group,
  Row,
} from "../../components";
import { ChatPrivateContext } from "../../contexts/ChatPrivateProvider";
import { formatDateTime } from "../../utils";
import { COLORS } from "../../constants/COLORS";
import { AuthContext } from "../../contexts/AuthProvider";

function MenuChatPrivate({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const { schedulesInChat } = useContext(ChatPrivateContext);
  console.log("🚀 ~ MenuChatPrivate ~ schedulesInChat:", schedulesInChat);
  const [showListSchedulesInChat, setShowListSchedulesInChat] = useState(false);

  const bodyCardSchedule = (schedule) => {
    const colorStatus = 1;
    const scheduleIsDone = () => {
      if(schedule.isDone) {
        return user.typeUser === 2 ? "Đã kết thúc" : "Đã hoàn thành";
      } else {
        const cur_date = Date.now();
        if(cur_date >= schedule.start && cur_date <= schedule.end) {
          return "Đang diễn ra";
        } else return "Chưa bắt đầu"
      }
    }
    return (
      <View>
        <AppText style={{ fontWeight: "bold" }}>
          {schedule.title} - {schedule.messageID}
        </AppText>
        <AppText style={{ color: "grey" }}>
          Ngày gửi : {formatDateTime(schedule.sendedAt).DDMYTS}
        </AppText>
        <AppText color={COLORS.accent} style={{ fontStyle: "italic" }}>
          {scheduleIsDone()}
        </AppText>
      </View>
    );
  };

  const footerCardSchedule = (schedule) => {
    return (
      <>
        {user.typeUser === 2 ? (
          <Row style={{ marginLeft: "auto" }}>
            <CustomButton
              label={"Kiểm Tra"}
              style={{
                backgroundColor: COLORS.accent,
                paddingHorizontal: 15,
              }}
              onPress={() => {
                navigation.navigate("ActiveSchedule", {
                  scheduleID: schedule.scheduleID,
                  messageID: schedule.messageID,
                });
              }}
            />
            <CustomButton
              label={"Xóa?"}
              style={{
                backgroundColor: COLORS.accent,
                paddingHorizontal: 15,
              }}
              onPress={() => {
                navigation.navigate("ViewSchedule", {
                  scheduleID: schedule.scheduleID,
                });
              }}
            />
          </Row>
        ) : (
          <Row style={{ marginLeft: "auto" }}>
            <CustomButton
              label={"Cập Nhật"}
              style={{
                backgroundColor: COLORS.accent,
                paddingHorizontal: 15,
              }}
              onPress={() => {
                navigation.navigate("ActiveSchedule", {
                  scheduleID: schedule.scheduleID,
                  messageID: schedule.messageID,
                });
              }}
            />
            <CustomButton
              label={"Thông báo hoàn thành?"}
              style={{
                backgroundColor: COLORS.accent,
                paddingHorizontal: 15,
              }}
              onPress={() => {
                navigation.navigate("ViewSchedule", {
                  scheduleID: schedule.scheduleID,
                });
              }}
            />
          </Row>
        )}
      </>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <CustomCard
        body={bodyCardSchedule(item)}
        footer={footerCardSchedule(item)}
        style={{
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      />
    );
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 10, marginTop: 20 }}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => {
            setShowListSchedulesInChat(!showListSchedulesInChat);
          }}
          style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}
        >
          <Ionicons name="trash" size={25} />
          <AppText fontSize={20}>Danh sách lịch biểu sử dụng</AppText>
          <View style={{ marginLeft: "auto", alignSelf: "center" }}>
            {showListSchedulesInChat ? (
              <AntDesign name="down" size={25} />
            ) : (
              <AntDesign name="up" size={25} />
            )}
          </View>
        </TouchableOpacity>
        {/* 
        {showListSchedulesInChat && (
          <ScrollView scrollEnabled={false}>
            {schedulesInChat.map((sche, i) => (
              <CustomCard
                key={i}
                body={bodyCardSchedule(sche)}
                footer={footerCardSchedule(sche)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              />
            ))}
          </ScrollView>
        )} */}

        {showListSchedulesInChat && (
          <FlatList
            data={schedulesInChat}
            renderItem={renderItem}
            style={{ maxHeight: "50%" }}
          />
        )}
      </View>
    </View>
  );
}

export default MenuChatPrivate;
