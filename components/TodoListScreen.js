import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Image
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth } from "../firebase/firebaseConfig";
import { Timestamp} from "firebase/firestore";
import { deleteTodo, editTodo, getAllTodos, toggleTodo } from "../firebase/todoConfig";
import { SnackbarContext } from "./SnackbarContext";

const TodoListScreen = ({ route }) => {
  const [todos, setTodos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const[editLoading,setEditLoading] = useState(false);
  const{setSnackbarMessage,setSnackbarVisible} = useContext(SnackbarContext);
  const user = auth.currentUser;

 
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const todosData = await getAllTodos();
      const sortedTodos = todos.sort((a, b) => a.isCompleted - b.isCompleted);
      setTodos(todosData);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

 
  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [])
  );

 
  const filteredTodos = searchText.trim()
    ? todos.filter((todo) =>
        typeof todo.title === "string" &&
        todo.title.toLowerCase().includes(searchText.toLowerCase())
      )
    : todos;

  
  const handleToggleComplete = async (todoId,item) => {
    // console.log(item);
    try {
      await toggleTodo(todoId, user.uid);
     
      setSnackbarMessage("Todo Toggled....");
      setSnackbarVisible(true);
      fetchTodos();
    } catch (error) {
      console.error("Error toggling todo:", error);
      setSnackbarMessage(error.message);
      setSnackbarVisible(true);
    }
  };

  const handleEditTodo = async () => {
    if (!selectedTodo || !editText.trim()) return;
    setEditLoading(true);
    try {
      await editTodo(selectedTodo.id,user.uid,editText);
      setModalVisible(false);
      setSnackbarMessage("Todo Updated Succesfully...");
      setSnackbarVisible(true);
      fetchTodos(); 
    } catch (error) {
      console.error("Error updating todo:", error);
      setSnackbarMessage(error.message);
      setSnackbarVisible(true);
    }
    finally{
      setEditLoading(false);
    }
  };


  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId, user.uid);
      setSnackbarMessage("Todo Deleted Successfully....");
      setSnackbarVisible(true);
      fetchTodos(); // Refresh the list
    } catch (error) {
      console.error("Error deleting todo:", error);
      setSnackbarMessage(error.message);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Todo List</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search Todos..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/4076/4076743.png",
                }}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>No To-Dos Yet</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <View style={styles.todoTopRow}>
                <TouchableOpacity
                  onPress={() => handleToggleComplete(item.id,item)}
                >
                  <Icon
                    name={item.isCompleted ? "check-circle" : "circle-outline"}
                    size={24}
                    color={item.isCompleted ? "green" : "gray"}
                  />
                </TouchableOpacity>
                <Text 
  style={[
    styles.todoText, 
    { textDecorationLine: item.isCompleted ? "line-through" : "none" }
  ]}
>
  {typeof item.title === "string" ? item.title : JSON.stringify(item.title)}
</Text>


              </View>

              <View style={styles.todoBottomRow}>
            <Text style={styles.dateText}>
              {item.date instanceof Timestamp
              ? item.date.toDate().toISOString().split("T")[0]  // Extract only the date (YYYY-MM-DD)
              : typeof item.date === "string"
              ? item.date.split("T")[0]  // Handle ISO string format
              : "No Date"}
            </Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedTodo(item);
                      setEditText(item.title);
                      setModalVisible(true);
                    }}
                  >
                    <Icon name="pencil" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
                    <Icon name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Todo</Text>

            <TextInput
              style={styles.modalInput}
              value={editText}
              onChangeText={setEditText}
            />

            <View style={styles.modalButtonRow}>
             {
              editLoading?
              (<ActivityIndicator size="large" color="077bff" />):
              ( <TouchableOpacity
                style={styles.saveButton}
                onPress={handleEditTodo}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>)
             }
              {
                editLoading?
                null:
                (<TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>)
              }
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TodoListScreen;

// Styles remain unchanged


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  loader: {
    marginTop: 20,
  },
  todoItem: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  todoTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  todoBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  todoText: {
    fontSize: 18,
    color: "#333",
    textDecorationColor: "blue", // Change underline color
    textDecorationStyle: "dashed", // Can be 'solid', 'double', 'dotted', or 'wa
  },
  dateText: {
    fontSize: 14,
    color: "gray",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});


