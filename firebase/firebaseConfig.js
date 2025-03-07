import { initializeApp,getApps,getApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiT2WYCzsevdMzjvXzCdItEy7TvkPfUuQ",
  authDomain: "todo-app-react-native-7d8cd.firebaseapp.com",
  projectId: "todo-app-react-native-7d8cd",
  storageBucket: "todo-app-react-native-7d8cd.appspot.com", 
  messagingSenderId: "490077090186",
  appId: "1:490077090186:web:f52bc90e12db6705cfd873"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth};





