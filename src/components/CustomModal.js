import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity } from "react-native";
import CustomButton from "./CustomButton";

import AppImage from "./AppImage";
const CustomModal = ({
  modalVisible,
  setModalVisible,
  style,
  header,
  footer,
  children,
  headerClose = false,
}) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={[styles.centeredView, style]}>
          <View style={styles.modalView}>
   
            {headerClose && (
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{marginLeft: 'auto'}}
              >
                <AppImage
                  width={24}
                  height={24}
                  source={require("images/close_x.png")}
                />
              </TouchableOpacity>
            )}
            {header}
            {children}
            {footer}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
});

export default CustomModal;
