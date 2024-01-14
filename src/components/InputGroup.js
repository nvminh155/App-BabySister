import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

export default function InputGroup({
  label,
  icon,
  inputType,
  value,
  onChangeText,
  placeholder,
  multiline,
  row,
  styleRoot,
  styleInput = "",
}) {
  return (
    <View style={[styles.group(row), styleRoot]}>
      {label}
      <View style={[styles.input, styleInput]}>
        {icon}
        <TextInput
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          secureTextEntry={inputType === "password"}
          multiline={multiline}
          scrollEnabled={multiline}
          style={{flex: 1}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
  },

  group: (row) => ({
    flexDirection: (row ? 'row' : 'column'),
    alignItems: (row ? "center" : ''),
    columnGap: (row ? 10 : 0),
    rowGap: (row ? 0 : 10),
    borderBottomColor: "#ccc",
    marginBottom: 10,
    
  }),
});
