import { StyleSheet, TouchableOpacity, View } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import { useEffect, useState } from "react";

import { COLORS } from "../constants/COLORS";
import Row from "./Row";

export default function InputRadio({ children, style, edge, label, id, activeRadio, onClick  }) {

  return (
    <Row style={{alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => {
            onClick(id)
        }}
        style={{
          height: edge,
          width: edge,
          borderColor: COLORS.accent,
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: edge / 2,
        }}
      >
        {id === activeRadio && <Ionicons
          name="checkmark-sharp"
          size={edge - 5}
          color={COLORS.accent}
        />}
      </TouchableOpacity>
      {label}
    </Row>
  );
}
