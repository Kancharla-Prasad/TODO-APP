import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";
import { db,auth } from "./firebaseConfig";
import { doc,setDoc,getDoc,updateDoc} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


const signUp = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        name,
        email,
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
};



const signIn = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, error: "Please enter both email and password." };
      }
  
      // Authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store user details in AsyncStorage
      const userData = { uid: user.uid, email: user.email };
      await AsyncStorage.setItem("user", JSON.stringify(userData));
  
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  

  const getUserData = async (userId) => {
    try {
      const docRef = doc(db, "users", userId); // Reference to user document
      const docSnap = await getDoc(docRef); // Fetch document
  
      if (!docSnap.exists()) {
        throw new Error("User data not found.");
      }
  
      return { success: true, data: docSnap.data() }; // Return user data
    } catch (error) {
      return { success: false, error: error.message }; // Handle errors
    }
  };

  const updateUserProfile = async (userId, name, profileUrl) => {
    try {
      const userRef = doc(db, "users", userId); // Reference to user document
      const userDoc = await getDoc(userRef); // Fetch document
  
      if (!userDoc.exists()) {
        throw new Error("User document does not exist.");
      }
  
      // Update the user document with name and profileUrl
      await updateDoc(userRef, { name, profileImage: profileUrl });

      console.log(userDoc);
  
      return { success: true, message: "Profile updated successfully." };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  

export {signUp,signIn,getUserData,updateUserProfile};
  