import {
    StyleSheet,
    View,
  } from "react-native";
import React from 'react';
import { COLORS } from "../constants/COLORS";


export default function CustomCard({header, body, footer, style}) {
  return (
    <View style={[styles.card, style]}>
        {header}
        {body}
        {footer}
    </View>
  );
}


const styles = StyleSheet.create({
    card: {
        rowGap: 5,
        borderColor: 'black',
        width: 100,
        marginRight: 100
    }
})



