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
import { Calendar, DateData } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = "Wam_xPaHALBkRbPkXjM0uhNZ5pfnixeZfDnYnB6S3kY";
const URL = "https://todocrud.chiggydoes.tech";
const { height } = Dimensions.get("window");

interface Note {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  deadline?: string; // Added deadline field
}

interface Deadlines {
  [key: string]: number[]; // Date string -> array of task IDs
}

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskId, setTaskId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [deadlines, setDeadlines] = useState<Deadlines>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const slideAnimation = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    loadDeadlines();
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${URL}/todos/`, {
        method: "GET",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const receivedNotes = await response.json();
      setNotes(receivedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
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
      setSelectedDate(null);
      setShowCalendar(false);
    });
  };

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false); // Hiding the calendar after the date selection
  };

  const clearDeadline = () => {
    setSelectedDate(null);
  };

  const loadDeadlines = async () => {
    try {
      const savedDeadlines = await AsyncStorage.getItem("deadlines");
      if (savedDeadlines) {
        setDeadlines(JSON.parse(savedDeadlines));
      }
    } catch (error) {
      console.log("Error loading deadlines:", error);
    }
  };

  const saveDeadlines = async (newDeadlines: Deadlines) => {
    try {
      await AsyncStorage.setItem("deadlines", JSON.stringify(newDeadlines));
      setDeadlines(newDeadlines);
    } catch (error) {
      console.log("Error saving deadlines:", error);
    }
  };

  const setTaskDeadline = async (taskId: number, date: string) => {
    const newDeadlines = { ...deadlines };

    // Remove task from any existing deadline
    Object.keys(newDeadlines).forEach((key) => {
      newDeadlines[key] = newDeadlines[key].filter((id) => id !== taskId);
      if (newDeadlines[key].length === 0) {
        delete newDeadlines[key];
      }
    });

    // Add task to new deadline
    if (!newDeadlines[date]) {
      newDeadlines[date] = [];
    }
    newDeadlines[date].push(taskId);

    await saveDeadlines(newDeadlines);
  };

  const removeTaskDeadline = async (taskId: number) => {
    const newDeadlines = { ...deadlines };
    Object.keys(newDeadlines).forEach((key) => {
      newDeadlines[key] = newDeadlines[key].filter((id) => id !== taskId);
      if (newDeadlines[key].length === 0) {
        delete newDeadlines[key];
      }
    });
    await saveDeadlines(newDeadlines);
  };

  // Modified showModal to handle deadline selection
  const showModal = (note: Note | null = null) => {
    if (note) {
      setTaskId(note.id);
      setTitle(note.title);
      setDescription(note.description);
      // Find deadline for this task
      const deadline = Object.entries(deadlines).find(([_, ids]) =>
        ids.includes(note.id)
      )?.[0];
      setSelectedDate(deadline || null);
    } else {
      setTaskId(null);
      setTitle("");
      setDescription("");
      setSelectedDate(null);
    }
    setModalVisible(true);
    Animated.spring(slideAnimation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  // Modifying the current api addTask to include deadline
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

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const newTask = await response.json();
      if (selectedDate) {
        await setTaskDeadline(newTask.id, selectedDate);
      }

      console.log("New task added");
      hideModal();
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // Modified updateTask to handle deadline updates
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

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      if (selectedDate) {
        await setTaskDeadline(taskId, selectedDate);
      } else {
        await removeTaskDeadline(taskId);
      }

      console.log("Task updated successfully");
      hideModal();
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // Modified deleteTask to clean up deadlines
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`${URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      await removeTaskDeadline(id);
      console.log("Task deleted successfully");
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  // Get deadline for a specific task
  const getTaskDeadline = (taskId: number): string | undefined => {
    return Object.entries(deadlines).find(([date, ids]) =>
      ids.includes(taskId)
    )?.[0];
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar
        backgroundColor="#2196F3"
        barStyle="light-content"
        translucent={false}
      />
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
                <Text style={styles.date}>Created: {item.created_at}</Text>
                {getTaskDeadline(item.id) && (
                  <Text style={styles.deadline}>
                    Deadline: {getTaskDeadline(item.id)}
                  </Text>
                )}
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
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Todos Found</Text>
          }
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => showModal()}>
        <Text style={styles.addButtonText}> + Add a Task </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent onRequestClose={hideModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={hideModal}
            activeOpacity={1}
          />
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnimation }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {taskId ? "Edit Task" : "Add New Task"}
              </Text>
              <TouchableOpacity onPress={hideModal}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
            />

            <View style={styles.deadlineContainer}>
              <Text style={styles.deadlineLabel}>Deadline:</Text>
              <View style={styles.deadlineActions}>
                <TouchableOpacity
                  style={styles.calendarButton}
                  onPress={() => setShowCalendar(!showCalendar)}
                >
                  <Text style={styles.calendarButtonText}>
                    {showCalendar ? "Hide Calendar" : "Show Calendar"}
                  </Text>
                </TouchableOpacity>
                {selectedDate && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearDeadline}
                  >
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
              {selectedDate && (
                <Text style={styles.selectedDate}>
                  Selected: {selectedDate}
                </Text>
              )}
            </View>

            {showCalendar && (
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                  [selectedDate || ""]: {
                    selected: true,
                    selectedColor: "#2196F3",
                  },
                }}
                style={styles.calendar}
                theme={{
                  selectedDayBackgroundColor: "#2196F3",
                  todayTextColor: "#2196F3",
                  arrowColor: "#2196F3",
                }}
              />
            )}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={taskId ? updateTask : addTask}
            >
              <Text style={styles.submitButtonText}>
                {taskId ? "Update Task" : "Add Task"}
              </Text>
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
    backgroundColor: "rgba(255, 255, 255, 0)",
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
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
    color: "#222",
    letterSpacing: 0.5,
    textTransform: "capitalize",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 17,
    color: "#444",
    marginBottom: 5,
    lineHeight: 24,
    fontStyle: "italic",
    opacity: 0.9,
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
  
  deadlineContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  deadlineLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  deadlineActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  calendarButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 6,
    width: 80,
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedDate: {
    marginTop: 8,
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  calendar: {
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
