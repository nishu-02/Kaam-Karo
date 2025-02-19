import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "https://todocrud.chiggydoes.tech/todos/",
          {
            method: "GET",
            headers: {
              "X-API-Key": "tTAiBltwF2FzOv4tR9FKNe_Zy7oo3q7knyC_HFv2QSk",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const receivedNotes = await response.json();
        setNotes(receivedNotes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };

    fetchTodos();
  }, []);

  interface Note {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
  }

  const addTask = async (title: string, description: string) => {
    try {
      const response = await fetch("https://todocrud.chiggydoes.tech/todos/", {
        method: "POST",
        headers: {
          "X-API-Key": "tTAiBltwF2FzOv4tR9FKNe_Zy7oo3q7knyC_HFv2QSk",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Task",
          description: "New Task Description",
          status: "Pending", // setting up the default status
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("The new task has been added", result);
      return result;
    } catch (errr) {
      console.error(errr);
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
              <Text> Status: {item.status}</Text>
              <Text> Date: {item.created_at} </Text>
            </View>
          )}
          ListEmptyComponent={<Text> No Todo to be Found</Text>}
        />
      )}

      <Button
        title="Add a Task"
        onPress={() => console.log("Add a Task")}
      ></Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
