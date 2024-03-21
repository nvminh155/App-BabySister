import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

const registerForPushNotificationsAsync = async () => {
    Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "497e77fc-f310-435c-ab6a-5fd30b5c1550",
      })
    ).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const send = (message, expoPushTokens) => {
  expoPushTokens.forEach(async (token) => {
    message.to = token;
    console.log("🚀 ~ expoPushTokens.forEach ~ message:", message)
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((res) => res.json)
      .then((data) => {
        console.log(data);
        console.log("SEND NOTIFICATIONS !!!");
      })
      .catch((err) => console.log(err));
  });
}


export {registerForPushNotificationsAsync, send}