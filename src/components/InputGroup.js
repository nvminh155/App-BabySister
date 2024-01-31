import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants/COLORS";

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
  editableInput = true,
  inputMode,
  iconBefore,
  iconAfter,
  colorTextInput,
  readOnly = false,
  autoFocus = false,
}) {
  return (
    <View style={[styles.group(row), styleRoot]}>
      {label}
      <View style={[styles.input, styleInput]}>
        {icon}
        {iconBefore}
        <TextInput
        
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          secureTextEntry={inputType === "password"}
          multiline={multiline}
          scrollEnabled={multiline}
          style={{flex: 1, color: colorTextInput || COLORS.text }}
          editable={editableInput}
          inputMode={inputMode}
          readOnly={readOnly}
          autoFocus={autoFocus}
        />
        {iconAfter}
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
    flex: 1,
    backgroundColor: COLORS.secondary,
    
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
