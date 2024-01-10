// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD82xpGb4aJn0wGFuEslHW7YqfAeMWv_7A",
  authDomain: "chatapp-8385c.firebaseapp.com",
  projectId: "chatapp-8385c",
  storageBucket: "chatapp-8385c.appspot.com",
  messagingSenderId: "156838094531",
  appId: "1:156838094531:web:747ab7c43b3a564c486476"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


const auth = getAuth();
const db = getFirestore(app);
export {auth, db}
