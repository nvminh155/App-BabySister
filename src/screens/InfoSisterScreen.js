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
import { db } from "../firebase/config";
import { AuthContext } from "../contexts/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";
// import moment from "moment";
// require("moment/locale/vi");

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../constants/COLORS";

export default function InfoSisterScreen({ navigation }) {


  return (
    <SafeAreaView style={{backgroundColor: COLORS.background, paddingHorizontal: 10, height: '100%'}}>
        <View id="header" style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <Ionicons name="arrow-back" size={30} />

            </TouchableOpacity>
            <Text style={{marginLeft: 70, fontWeight: 700, color: COLORS.text, fontSize: 20}}>Thông Tin Bảo Mẫu</Text>
        </View>

        <View>
            <Text style={{}}>THÔNG TIN CÁ NHÂN</Text>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});
