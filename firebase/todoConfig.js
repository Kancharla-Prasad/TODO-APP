import { db,auth } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

const addTodo = async (todo, userId) => {
  try {
    
    const docRef = doc(db, "todos", userId);
    const docSnap = await getDoc(docRef);

    const newTodo = {
      id: Date.now().toString(),
      title: todo,
      isCompleted: false,
      date: new Date().toISOString(),
    };

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        userId: userId,
        todos: [newTodo], 
      });
    } else {
      // If the document exists, update it by adding a new todo
      await updateDoc(docRef, {
        todos: arrayUnion(newTodo), 
      });
    }

    return { success: true, message: "Todo added successfully!" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};



const deleteTodo = async (todoId, userId) => {
    try {
      const docRef = doc(db, "todos", userId);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        throw new Error("Todo list not found.");
      }
  
      const todos = docSnap.data().todos || [];
  
      // Filter out the todo to be deleted
      const updatedTodos = todos.filter(todo => todo.id !== todoId);
  
      // Update Firestore with the new todos array
      await updateDoc(docRef, { todos: updatedTodos });
  
      return { success: true, message: "Todo deleted successfully!" };
    } catch (error) {
      return { success: false, error: error.message };
    }
};




const editTodo = async (todoId, userId, updatedTitle) => {
    try {
      const docRef = doc(db, "todos", userId);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        throw new Error("Todo list not found.");
      }
  
      const todos = docSnap.data().todos || [];
  
      // Map over todos and update the matching one
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, title: updatedTitle } : todo
      );
  
      // Update Firestore with the modified todos array
      await updateDoc(docRef, { todos: updatedTodos });
  
      return { success: true, message: "Todo updated successfully!" };
    } catch (error) {
      return { success: false, error: error.message };
    }
};


const toggleTodo = async (todoId, userId) => {
    try {
        const docRef = doc(db, "todos", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("Todo list not found.");
        }

        const todos = docSnap.data().todos || [];

        // Toggle the completion status of the matching todo
        const updatedTodos = todos.map(todo =>
            todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
        );

        // Update Firestore with the modified todos array
        await updateDoc(docRef, { todos: updatedTodos });

        return { success: true, message: "Todo status updated successfully!" };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


const getAllTodos = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("No user logged in.");
        return [];
      }
  
      const docRef = doc(db, "todos", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        console.log("No todos found for this user.");
        return [];
      }
  
    // console.log(docSnap.data().todos);
      return docSnap.data().todos || [];
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
};



export {addTodo,deleteTodo,editTodo,getAllTodos,toggleTodo};