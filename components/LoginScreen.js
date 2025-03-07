import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";
import { signIn } from "../firebase/authConfig";
import { SnackbarContext } from "./SnackbarContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const{setSnackbarMessage,setSnackbarVisible} = useContext(SnackbarContext);
  

  const handleLogin = async() => {

    if (!email || !password) {
      alert("All fields are required!");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        // alert("Login Successful!");
        setSnackbarMessage("Login Successful...");
        setSnackbarVisible(true);
        // setTimeout(() => {
          navigation.navigate("HomeScreen");
        // }, 1000);
      } else {
        alert(`Login Failed: ${result.error}`);
        setSnackbarMessage("Server Login Error");
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
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>



      
    </View>
  );
};

export default LoginScreen;

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