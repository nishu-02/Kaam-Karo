import { StyleSheet, SafeAreaView, View, Text, FlatList } from "react-native";
import React, { useState, useEffect } from "react";

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          "https://todocurd.chiggydoes.tech/todos/",
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
            </View>
          )}
          ListEmptyComponent={<Text> No Todo to be Found</Text>}
        />
      )}
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
