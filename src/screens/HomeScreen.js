
// REACT ( NATIVE )
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";


// FIRE BASE
import { auth } from "../firebase/config";
import { db } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  getDocs,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";

// CONTEXT
import { AuthContext } from "../contexts/AuthProvider";


export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [listFollowing, setListFollowing] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, (ref) =>
      ref.orderBy('uid', 'desc')
    );
    const unsubcribe = onSnapshot(q, (snapshot) => {
      const snapshotMap = snapshot.docs.map((doc) => ({
        displayName: doc.data().displayName,
        uid: doc.data().uid,
        _id: doc.id,
      }));
      setListFollowing(
        snapshotMap.filter((doc) =>
          user.following.find((uid) => uid === doc.uid)
        )
      );
    });
    return unsubcribe;
  }, []);
  return (
    <SafeAreaView style={{  }}>
      <Text>Hello Home</Text>
      <View id="list-followindg">
        {listFollowing &&
          listFollowing.map((f) => (
            <TouchableOpacity
            key={f.uid}
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 10,
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                paddingVertical: 5,
                paddingHorizontal: 3
              }}
              onPress={() => navigation.navigate('Chat', f)}
            >
              <Image style={styles.tinyLogo}
                source={{
                  uri: "https://png.pngtree.com/thumb_back/fw800/background/20230523/pngtree-sad-pictures-for-desktop-hd-backgrounds-image_2690576.jpg",
                }}
              />
              <View
                style={{
                  rowGap: 5,
                }}
              >
                <Text style={{color: 'blue', fontWeight: 'bold'}}>{f.displayName}</Text>
                <Text>Last Message</Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
        <Text>GO TO CHAT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          await signOut(auth).catch((err) => console.log(err));
        }}
      >
        <Text>SIGN OUT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  logo: {
    width: 66,
    height: 58,
  },
});