import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { COLORS } from "../constants/COLORS";
export default function CustomButton({label, onPress, style, styleText}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}>
      <Text
        style={[{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 15,
          color: '#fff',
        }, styleText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
