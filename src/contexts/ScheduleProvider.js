import {
  createContext,
  useCallback,
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
import { AuthContext } from "./AuthProvider";

export const ScheduleContext = createContext();

export default function ScheduleProvider({ children, navigation, route }) {

  console.log("🚀 ~ ScheduleProvider ~ route:", route)
  const {user} = useContext(AuthContext);
  const [loading, setLoading] = useState(!route.params?.scheduleID ? false : true);
  const scheduleID = route.params?.scheduleID;
  const [timeSchedules, setTimeSchedules] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [childs, setChilds] = useState([]);

  useEffect(() => {
    if(!scheduleID) return; 
    console.log(route);
    const q = doc(db, `users/${user._id}/schedules/${scheduleID}`);
    const unsubcribe = onSnapshot(q, (snap) => {
      console.log("🚀 ~ unsubcribe ~ snap:", snap);
      const data = { ...snap.data() };

      setSchedule(data);
      setChilds(data.childs);
      setTimeSchedules(data.timeSchedules);
      setLoading(false);

      // console.log(data, doc.data())
    });

    return unsubcribe;
  }, [])
  return (
    <ScheduleContext.Provider value={{timeSchedules, setTimeSchedules, childs, setChilds, schedule, setSchedule}}>
      {loading ? <Spin /> : children}
    </ScheduleContext.Provider>
  );
}
