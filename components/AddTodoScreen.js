import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,ActivityIndicator } from "react-native";
import { addTodo } from "../firebase/todoConfig";
import { auth } from "../firebase/firebaseConfig";
import { Snackbar } from "react-native-paper";
import { SnackbarContext } from "./SnackbarContext";

const AddTodoScreen = () => {
  const [todo, setTodo] = useState("");
  const[loading,setLoading] = useState(false);
  const{setSnackbarMessage,setSnackbarVisible} = useContext(SnackbarContext);
  const navigation = useNavigation();

  const handleAddTodo = async() => {
    if (todo.trim() === "") {
      Alert.alert("Error", "Please enter a valid todo.");
      return;
    }
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in to add a todo.");
      return;
    }
  
    const result = await addTodo(todo,user.uid);

    console.log(result);
    // Alert.alert("Success", "Todo added successfully!");
    setSnackbarMessage("Todo added Successfully...");
    setSnackbarVisible(true);
    setTodo(""); // Clear input after adding
    navigation.navigate("Todos", { newTodo: todo }); // Pass the todo back
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Todo</Text>
      <TextInput
        placeholder="Enter todo..."
        value={todo}
        onChangeText={setTodo}
        style={styles.input}
      />
     {loading?(<ActivityIndicator size="large" color="#007bff" />): <TouchableOpacity style={styles.button} onPress={handleAddTodo}>
        <Text style={styles.buttonText}>Add Todo</Text>
      </TouchableOpacity> }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
  button: { backgroundColor: "#007bff", width: "100%", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default AddTodoScreen;
