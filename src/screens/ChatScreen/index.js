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
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { AuthContext } from "../../contexts/AuthProvider";

import Ionicons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../../constants/COLORS";

import {
  AppImage,
  AppSafeAreaView,
  AppText,
  CustomCard,
} from "../../components";
import Spin from "../../components/Spin";

export default function ChatScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [loadingData, setLoadingData] = useState(true);


  useEffect(() => {
    // setFriends({ ...user.following });
    const unsubscribe = setTimeout(() => {
      setLoadingData(false);
    }, 1000);
    return () => {
      clearTimeout(unsubscribe);
    };
  }, []);

  const fetchFriends = async () => {
    const collectionRef = collection(db, "chats");
    let q = query(
      collectionRef,
      where("members", "array-contains-any", [user.uid])
    );
    const docs = (await getDocs(q)).docs;
    const friends = [];
    docs.forEach(async (doc) => {
      const data = { ...doc.data() };

      const uid =
        data.members[0] !== user.uid ? data.members[0] : data.members[1];

      const userRef = query(collection(db, "users"), where("uid", "==", uid));
      const users = await getDocs(userRef);

      users.forEach((docUser) => {
        setFriends((prev) => [...prev, docUser.data()]);
        
        console.log("AA", docUser.data());
      });
    });
    console.log("F", friends);
    setFriends(friends);
  };

  useEffect(() => {
    fetchFriends();
  }, []);
  useEffect(() => {
    const collectionRef = collection(db, "chats");
    let q = query(
      collectionRef,
      where("members", "array-contains-any", [user])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("SNAPPPPP SHOT UDATE COLLECTION", snapshot.docs);
      const friends = [];
      snapshot.docs.forEach(async (doc) => {
        const data = { ...doc.data() };
        console.log("DSSSA", data);

        const friend =
          data.members[0].uid !== user.uid ? data.members[0] : data.members[1];

        friends.push(friend);
      });

      setFriends(friends);
      console.log("ASF", friends);
    });

    return unsubscribe;
  }, []);
  return (
    <>
      {loadingData ? (
        <Spin />
      ) : (
        <View
          style={{
            flex: 1,
            paddingVertical: 20,
            paddingHorizontal: 10,
          }}
        >
          <ScrollView contentContainerStyle={{ rowGap: 20 }}>
            {friends
              .filter((v, i, self) => self.indexOf(v) === i)
              .map((f, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    navigation.navigate("ChatPrivateStack", {
                      receiverID: f.uid,
                    });
                  }}
                >
                  <CustomCard
                    header={
                      <AppImage
                        width={50}
                        height={50}
                        source={require("images/bbst_1.jpg")}
                        options={{ styles: { borderRadius: 25 } }}
                      />
                    }
                    body={
                      <View style={{}}>
                        <AppText style={{ fontWeight: "bold" }}>
                          {f.displayName}
                        </AppText>
                        <AppText style={{ color: "grey" }}>
                          last message {i}{" "}
                        </AppText>
                      </View>
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 15,
                    }}
                  ></CustomCard>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({});
