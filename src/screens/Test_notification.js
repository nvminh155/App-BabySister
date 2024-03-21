import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          if(!expoPushToken) return;

          const messagae = {
            to: expoPushToken,
            sound: "default",
            title: "You've got mail! 📬",
            body: "Check your chat with admin !!!",
            attachments: { image: require("images/atm_card.png") },
            data: {
              image: require("images/atm_card.png")
            }
          }
          console.log("🚀 ~ onPress={ ~ messagae:", messagae)
          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              host: "exp.host",
              accept: "application/json",
              "accept-encoding": "gzip, deflate",
              "content-type": "application/json"
            },
            body: JSON.stringify(messagae)
          }).then(res => res.json).then(data => {
            console.log(data)
            console.log("SEND NOTIFICATIONS !!!")
          }).catch(err => console.log(err));
          
          return;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "You've got mail! 📬",
              body: 'Here is the notification body',
              data: { data: 'goes here' },
              launchImageName: require("images/atm_card.png"),
              color: "red",
              attachments: { image: require("images/atm_card.png") }
            },
            trigger: { seconds: 2 },
          });
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
      launchImageName: require("images/atm_card.png"),
      color: "red",
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: '497e77fc-f310-435c-ab6a-5fd30b5c1550' })).data;
    
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}