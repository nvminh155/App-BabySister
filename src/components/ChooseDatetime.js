import DateTimePicker from "@react-native-community/datetimepicker";

import { TouchableOpacity, View } from "react-native";
import AppText from "./AppText";
import { useState } from "react";
import { formatDateTime } from "../utils";

export default function ChooseDatetime({ datetime, setDatetime, label }) {
  return (
    <View id="start_datetime">
      {label}

      <View style={{ flexDirection: "row", columnGap: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setDatetime((prev) => ({
              ...prev,
              showDate: !datetime.showDate,
            }));
          }}
          style={{
            backgroundColor: "#fff",
            padding: 10,
            paddingHorizontal: 10,
            borderRadius: 15,
            marginBottom: 10,
          }}
        >
          <AppText>{formatDateTime(datetime.timestamp).DDMYTS}</AppText>
        </TouchableOpacity>
      </View>

      {datetime.showDate && (
        <DateTimePicker
          value={new Date(datetime.timestamp)}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={({ nativeEvent }) => {
            setDatetime((prev) => ({
              ...prev,
              timestamp: nativeEvent.timestamp,
              showDate: !datetime.showDate,
              showTime: !datetime.showTime,
            }));
          }}
        />
      )}
      {datetime.showTime && (
        <DateTimePicker
          value={new Date(datetime.timestamp)}
          mode="time"
          is24Hour={true}
          display="clock"
          onChange={({ nativeEvent }) => {
            setDatetime((prev) => ({
              ...prev,
              timestamp: nativeEvent.timestamp,
              showTime: !datetime.showTime,
            }));
          }}
        />
      )}
    </View>
  );
}
