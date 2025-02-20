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
    try {
      const response = await fetch(`${URL}/todos/`, {
        method: "POST",
        headers: {
          "X-API-Key": "API_KEY",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status: "Pending",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("The new task has been added", result);
      fetchTodos(); // Refresh the list
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "beige" }}>
      {error ? (
        <View>
          <Text>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>Status: {item.status}</Text>
              <Text>Date: {item.created_at}</Text>
              <Button
                title="Complete"
                onPress={() => updateTask(item.id, "Completed", item.description)}
              />
              <Button title="Delete" onPress={() => deleteTask(item.id)} />
            </View>
          )}
          ListEmptyComponent={<Text>No Todos Found</Text>}
        />
      )}

      <Button title="Add a Task" onPress={() => addTask("Sample Task", "This is a test task")} />
    </SafeAreaView>
  );
}
