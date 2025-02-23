import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const API_KEY = "Wam_xPaHALBkRbPkXjM0uhNZ5pfnixeZfDnYnB6S3kY";
const URL = "https://todocrud.chiggydoes.tech";
const { height } = Dimensions.get("window");

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
  const [taskId, setTaskId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const slideAnimation = useRef(new Animated.Value(height)).current;

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${URL}/todos/`, {
        method: "GET",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const receivedNotes = await response.json();
      setNotes(receivedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const showModal = (note: Note | null = null) => {
    if (note) {
      setTaskId(note.id);
      setTitle(note.title);
      setDescription(note.description);
    } else {
      setTaskId(null);
      setTitle("");
      setDescription("");
    }
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
    }).start(() => {
      setModalVisible(false);
      setTaskId(null);
      setTitle("");
      setDescription("");
    });
  };

  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter a valid title");
      return;
    }

    try {
      const response = await fetch(`${URL}/todos/`, {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      console.log("New task added");
      hideModal();
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async () => {
    if (!taskId) return;

    try {
      const response = await fetch(`${URL}/todos/${taskId}`, {
        method: "PUT",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      console.log("Task updated successfully");
      hideModal();
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`${URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      console.log("Task deleted successfully");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" translucent={false} />
      {error ? (
        <View>
          <Text>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => showModal(item)}>
              <View style={styles.todoItem}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                <Text style={styles.date}>Date: {item.created_at}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.completeButton]}
                    onPress={() => updateTask()}
                  >
                    <Text style={styles.buttonText}>Complete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => deleteTask(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No Todos Found</Text>}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => showModal()}>
        <Text style={styles.addButtonText}> + Add a Task </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent onRequestClose={hideModal}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalContainer} onPress={hideModal} activeOpacity={1} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnimation }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{taskId ? "Edit Task" : "Add New Task"}</Text>
              <TouchableOpacity onPress={hideModal}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Enter Title" value={title} onChangeText={setTitle} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Enter Description" value={description} onChangeText={setDescription} multiline numberOfLines={5} />
            <TouchableOpacity style={styles.submitButton} onPress={taskId ? updateTask : addTask}>
              <Text style={styles.submitButtonText}>{taskId ? "Update Task" : "Add Task"}</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  todoItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Soft transparent white
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: "teal",
    shadowOffset: {
      width: -3,
      height: -3,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8, // Raised effect
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)", // Subtle border for glass effect
    backdropFilter: "blur(10px)", // Frosted glass (For web, needs CSS)
  },

  title: {
    fontSize: 20, // Slightly larger for better readability
    fontWeight: "700", // Stronger presence
    marginBottom: 5,
    color: "#222", // Darker for contrast
    letterSpacing: 0.5, // Subtle spacing for elegance
    textTransform: "capitalize", // Ensures consistent styling
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 17, // Slightly bigger for a premium feel
    color: "#444", // Slightly darker for better readability
    marginBottom: 5,
    lineHeight: 24, // Makes text more spacious & luxurious
    fontStyle: "italic", // Adds a modern touch
    opacity: 0.9, // Soft transparency for a sleek look
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
    bottom: 180,
    right: 75,
    backgroundColor: "forestgreen",
    width: 200,
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
    fontSize: 18,
    fontWeight: "condensedBold",
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
    backgroundColor: "rgba(83, 4, 4, 0.5)",
  },
  modalContent: {
    backgroundColor: "beige",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "green",
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
    fontSize: 19,
    color: "#666",
  },
  input: {
    borderWidth: 3,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#fcae1e",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "condensedBold",
  },
});
