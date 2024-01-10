import { createContext, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import Spin from "../components/Spin";


export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        const collectionRef = collection(db, "users");
        const q = query(
          collectionRef,
          where("uid", "==", authenticatedUser.uid)
        );
        const querySnapshot = await getDocs(q).then((qr) => {
          qr.forEach((doc) => {
            setUser(doc.data());
          });
        });

        // setUser(authenticatedUser);
        // setUser(prev => {
        //   ...prev,
        // })
        setLoading(false);
        return;
      } else {
        setUser(null);
      setLoading(false);
      }
      
    });

    return unsubcribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {loading ? <Spin /> : children}
    </AuthContext.Provider>
  );
}
