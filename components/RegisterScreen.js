import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { signUp } from "../firebase/authConfig";
import { SnackbarContext } from "./SnackbarContext";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const{setSnackbarMessage,setSnackbarVisible} = useContext(SnackbarContext);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      alert("All fields are required!");
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await signUp(name, email, password);  
      if (result.success) {
        // alert("Registration Successful!");
        setSnackbarMessage("Registration Successfull...");
        setSnackbarVisible(true);
        navigation.navigate("LoginScreen");
      } else {
        alert(`Registration Failed: ${result.error}`);
        setSnackbarMessage("Server Registration Error...");
        setSnackbarVisible(true);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Register
        </Button>
      )}
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.signupText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "#007bff",
  },
  signupText: {
    marginTop: 15,
    color: "#007bff",
    fontSize: 16,
  },
});
