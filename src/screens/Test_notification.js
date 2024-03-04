import { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import { CustomButton } from "../components";
import messaging from '@react-native-firebase/messaging';

  
export default function Test_notification() {

  const [token, setToken] = useState(null);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  async function getToken() {
    await messaging().getToken().then((token) => {setToken(token); console.log(token)})
  }
  useEffect(() => {
    // getToken();
    requestUserPermission();
  }, [])
  const sendMess = async () => {
    messaging().sendMessage({
      data: {
        title: 'Hello',
        message: 'World',
      },
    })
  }
  return <View style={{marginTop: 150}}>
    <CustomButton label={"SEND NOTIFICATIONS"} onPress={sendMess} />
  </View>;
}


