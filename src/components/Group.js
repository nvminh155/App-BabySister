import { View } from "react-native";





export default function Group ({label, children, rootStyle}) {


    return <View>
        {label}
        <View id="list-child">
        {children}
        </View>
    </View>
}