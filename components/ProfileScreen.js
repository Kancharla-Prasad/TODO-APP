import React, { useState, useEffect, useContext } from "react";
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput ,ActivityIndicator
} from "react-native";
import { auth } from "../firebase/firebaseConfig";
import { getUserData, updateUserProfile } from "../firebase/authConfig";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SnackbarContext } from "./SnackbarContext";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/120");
  const [modalVisible, setModalVisible] = useState(false);
  const[loading,setLoading] = useState(false);
  const{setSnackbarMessage,setSnackbarVisible} = useContext(SnackbarContext);
 

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setEmail(user.email);
        const result = await getUserData(user.uid);

        if (result.success) {
          const userData = result.data;
          setName(userData.name || user.displayName || "User Name");
          setProfileImage(userData.profileImage || user.photoURL || "https://via.placeholder.com/120");
        } else {
          console.error("Error fetching user data:", result.error);
        }
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {

    setLoading(true);
    try {
      const res = await updateUserProfile(user.uid, name, profileImage);
      if (res.success) {
        setSnackbarMessage("Profile Updated Successfully!");
        setSnackbarVisible(true);
      } else {
        setSnackbarMessage("Failed to update profile.");
        setSnackbarVisible(true);
      }
      setModalVisible(false);
    } catch (error) {
      setSnackbarMessage("Error updating profile: " + error.message);
      setSnackbarVisible(true);
    }
    finally{
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("userData");
      await auth.signOut();
      navigation.replace("LoginScreen");
      setSnackbarMessage("Logout...");
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage("Error logging out: " + error.message);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: profileImage }} style={styles.editProfileImage} />
            </TouchableOpacity>

            <TextInput 
              style={styles.input} 
              placeholder="Enter name" 
              value={name} 
              onChangeText={setName} 
            />

           {
            loading?(<ActivityIndicator size="large" color="#077bff" />):
            ( <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>)
           }

          {
            loading?null:(<TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>)
          }
          </View>
        </View>
      </Modal>

     
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  closeButton: {
    backgroundColor: "#6c757d",
  },
});

export default ProfileScreen;
