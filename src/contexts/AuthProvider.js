import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  doc,
  where,
} from "firebase/firestore";

import Spin from "../components/Spin";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  console.log("🚀 ~ AuthProvider ~ user:", user)
  const [loading, setLoading] = useState(true);
  const [yourLocation, setYourLocation] = useState({"latitude": 37.4220936, "latitudeDelta": 0.0922, "longitude": -122.083922, "longitudeDelta": 0.0421});
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        const collectionRef = collection(db, "users");
        const q = query(
          collectionRef,
          where("uid", "==", authenticatedUser.uid)
        );
        const querySnapshot = await getDocs(q).then((qr) => {
          qr.forEach(async (doc1) => {
            setUser({ ...doc1.data(), _id: doc1.id });
            // await setDoc(doc(db, `users/${doc1.data().uid}`), {...doc1.data()})
          });
        });

        // setUser(authenticatedUser);
        // setUser(prev => {
        //   ...prev,
        // })
        return;
      } else {
        setUser(null);
      }
    });

    return unsubcribe;
  }, []);

  useEffect(() => {
    if (yourLocation) return;
    (async () => {
      console.log("START FIND LOCATIONS");
      let { status } = await Location.requestForegroundPermissionsAsync();

      console.log("START FIND LOCATIONS");
      if (status === "granted") {
        const enabled = await Location.hasServicesEnabledAsync();
        console.log("🚀 ~ enabled:", enabled)
        if (enabled) {
          // If location services are enabled, get the current location
          const location = await Location.getCurrentPositionAsync({});
          console.log("🚀 ~ location", location);
          // setYourLocation({
          //   latitude: location.coords.latitude,
          //   longitude: location.coords.longitude,
          //   latitudeDelta: 0.0922,
          //   longitudeDelta: 0.0421,
          // });
          setYourLocation({"latitude": 37.4220936, "latitudeDelta": 0.0922, "longitude": -122.083922, "longitudeDelta": 0.0421});
        }
      } else {
        // Handle the case where location permission is not granted
        setYourLocation(null);
      }

  
    })();
  }, []);

  useEffect(() => {
    if (yourLocation) {
      const timeRef = setTimeout(() => {
        setLoading(false);
      }, 1500);

      return () => {
        clearTimeout(timeRef);
      };
    }
  }, [yourLocation, user]);

  return (
    <AuthContext.Provider value={{ user, setUser, yourLocation }}>
      {loading ? <Spin /> : children}
    </AuthContext.Provider>
  );
}
