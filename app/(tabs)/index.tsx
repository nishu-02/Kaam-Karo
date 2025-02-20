import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Button,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { hide } from "expo-router/build/utils/splash";

const API_KEY = "Wam_xPaHALBkRbPkXjM0uhNZ5pfnixeZfDnYnB6S3kY";
const URL = "https://todocrud.chiggydoes.tech";
const { height } = Dimensions.get('window');

interface Note {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const slideAnimation = useRef(new Animated.Value(height)).current;

  const showModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnimation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnimation, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start (() => {
      setModalVisible(false);
      setNewTitle("");
      setNewDescription("");
    });
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${URL}/todos/`, {
        method: "GET",
        headers: {
          "X-API-Key": "API_KEY",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const receivedNotes = await response.json();
      setNotes(receivedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTask = async () => {
    if (!newTitle.trim()) {
      alert("Please enter a valid title");
      return;
    }

    try {
      const response = await fetch(`${URL}/todos/`, {
        method: "POST",
        headers: {
          "X-API-Key": "API_KEY",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title : newTitle,
          description : newDescription,
          status: "Pending",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("The new task has been added", result);
      hideModal();
      fetchTodos(); // Refreshing the list
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async (id: number, status: string, description: string) => {
    try {
      const response = await fetch(
        `${URL}/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            "X-API-Key": "API_KEY",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Task updated successfully");
      fetchTodos(); // Refreshing the list
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(
        `${URL}/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            "X-API-Key": "API_KEY",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Task deleted successfully");
      fetchTodos(); // Refresh the list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style= {styles.container}>
      {error ? (
        <View>
          <Text>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style = { styles.todoItem}>
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Date: {item.created_at}</Text>
              <View style = { styles.buttonContainer }>
              <TouchableOpacity
              style = {[ styles.button, styles.completeButton]}
              onPress={() => updateTask(item.id, "Completed", item.description)}
              >
                <Text style = { styles.buttonText}>Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style = {[ styles.button, styles.deleteButton]}
              onPress={() => deleteTask(item.id)}
              >
                <Text style = {styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
            </View>
          )}
          ListEmptyComponent={<Text style = {styles.emptyText}>No Todos Found</Text>}
        />
      )}

      <TouchableOpacity
      style = {styles.addButton}
      onPress={showModal}
      >
        <Text style = {styles.addButton}> + Add a Task </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  todoItem: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: "#888",
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 0.48,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#2196F3",
    width: 120,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
