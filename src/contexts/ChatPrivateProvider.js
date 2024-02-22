import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/native";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
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
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import Spin from "../components/Spin";
import { AuthContext } from "./AuthProvider";

export const ChatPrivateContext = createContext();

export default function ChatPrivateProvider({ children, navigation, route }) {
  const { user } = useContext(AuthContext);

  const [dataChat, setDataChat] = useState(null);
  console.log("🚀 ~ ChatPrivateProvider ~ dataChat:", dataChat)
  const [messages, setMessages] = useState([]);
  console.log("🚀 ~ ChatPrivateProvider ~ messages:", messages)
  const [receiver, setReceiver] = useState(null);
  console.log("🚀 ~ ChatPrivateProvider ~ receiver:", receiver)
  const [schedules, setSchedules] = useState(null);
  console.log("🚀 ~ ChatPrivateProvider ~ schedules:", schedules)
  const [schedulesInChat, setSchedulesInChat] = useState([]);
  console.log("🚀 ~ ChatPrivateProvider ~ schedulesInChat:", schedulesInChat)
  const [loading, setLoading] = useState(true);

  const fetchReceiver = async () => {
    const q = query(
      collection(db, "users"),
      where("uid", "==", route.params.receiverID)
    );
    const docs = (await getDocs(q)).docs;

    docs.forEach((doc) => {
      setReceiver({ ...doc.data(), _id: doc.id });
    });
  };

  useLayoutEffect(() => {
    fetchReceiver();
  }, []);

  useLayoutEffect(() => {
    if (!receiver)  return;
      const uid = user.typeUser === 2 ? user._id : receiver._id;
      const docsRef = collection(db, `users/${uid}/schedules`);
      const unsubscribe = onSnapshot(docsRef, (snap) => {
        const schedules = [];
        snap.docs.forEach((doc) => {
          schedules.push({ ...doc.data(), _id: doc.id });
        });
        setSchedules(schedules);
      });

      return unsubscribe;
    
  }, [receiver]);

  const fetchChatRef = async () => {
    if(!receiver) return;
    const collectionRef = collection(db, "chats");
    let q = query(
      collectionRef,
      where("members", "in", [
        [user.uid, receiver.uid],
        [receiver.uid, user.uid],
      ])
    );

    const docs = await getDocs(q);
    docs.forEach((doc) => {
      console.log("🚀 ~ docs.forEach ~ doc:", doc.id)
      setDataChat({ ...doc.data(), _id: doc.id });
    });
  };

  useLayoutEffect(() => {
      fetchChatRef();
    
  }, [receiver]);

  useLayoutEffect(() => {
    if (dataChat && schedules) {
      const q = query(
        collection(db, `chats/${dataChat._id}/messages`),
        orderBy("createdAt", "asc")
      );
      const unsubcribe = onSnapshot(q, (snapshot) => {
        const messages = [];
        const schedulesInChat = [];

        snapshot.forEach((doc) => {
          const data = { ...doc.data() };
          messages.push({ ...data, _id: doc.id });

          if (data.type === "schedule") {
            schedulesInChat.push({
              ...schedules.find((sche) => sche.scheduleID === data.scheduleID),
              ...data,
              sendedAt: data.createdAt,
            });
          }
        });
        setSchedulesInChat(schedulesInChat);
        setMessages(messages);
      });
      return unsubcribe;
    }
  }, [dataChat, schedules]);

  useEffect(() => {
    const unsubscribeTimeout = setTimeout(async () => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(unsubscribeTimeout);
    };
  }, []);

  return (
    <ChatPrivateContext.Provider
      value={{
        dataChat,
        setDataChat,
        messages,
        setMessages,
        receiver,
        schedules,
        setSchedules,
        schedulesInChat,
        setSchedulesInChat,
        fetchChatRef
      }}
    >
      {loading ? <Spin /> : children}
    </ChatPrivateContext.Provider>
  );
}
