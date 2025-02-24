import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    selected?: boolean;
    selectedColor?: string;
  };
}

export default function CalendarScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deadlines, setDeadlines] = useState<{ [key: string]: number[] }>({});
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadDeadlinesAndTasks();
  }, []);

  const loadDeadlinesAndTasks = async () => {
    try {
      const savedDeadlines = await AsyncStorage.getItem("deadlines");
      const deadlinesData = savedDeadlines ? JSON.parse(savedDeadlines) : {};
      setDeadlines(deadlinesData);

      const savedTasks = await AsyncStorage.getItem("tasks");
      const tasksData: Task[] = savedTasks ? JSON.parse(savedTasks) : [];
      setTasks(tasksData);

      updateMarkedDates(deadlinesData, null);
    } catch (error) {
      console.error("❌ Error loading data:", error);
    }
  };

  const updateMarkedDates = (deadlinesData: { [key: string]: number[] }, selected: string | null) => {
    const marked: MarkedDates = {};

    Object.entries(deadlinesData).forEach(([date, taskIds]) => {
      marked[date] = {
        marked: true,
        dotColor: getTaskStatusColor(taskIds),
      };
    });

    if (selected) {
      marked[selected] = {
        ...marked[selected],
        selected: true,
        selectedColor: "#2196F3",
      };
    }

    setMarkedDates(marked);
  };

  const getTaskStatusColor = (taskIds: number[]): string => {
    const hasCompleted = tasks.some((task) => taskIds.includes(task.id) && task.status === "Completed");
    return hasCompleted ? "#4CAF50" : "#2196F3";
  };

  const handleDateSelect = (day: DateData) => {
    const selectedDateString = day.dateString;
    setSelectedDate(selectedDateString);

    updateMarkedDates(deadlines, selectedDateString);

    const taskIds = deadlines[selectedDateString] || [];
    const tasksForDate = tasks.filter((task) => taskIds.includes(task.id));

    setSelectedDateTasks(tasksForDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={handleDateSelect}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: "#2196F3",
          todayTextColor: "#2196F3",
          arrowColor: "#2196F3",
          monthTextColor: "#2196F3",
          textMonthFontWeight: "bold",
          textDayFontSize: 16,
          textMonthFontSize: 18,
        }}
      />

      <View style={styles.taskListContainer}>
        <Text style={styles.taskListTitle}>
          {selectedDate ? `Tasks for ${selectedDate}` : "Select a date to view tasks"}
        </Text>

        <ScrollView style={styles.taskList}>
          {selectedDateTasks.length > 0 ? (
            selectedDateTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <Text style={styles.taskStatus}>Status: {task.status}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noTasksText}>
              {selectedDate ? "No tasks for this date" : "Select a date to view tasks"}
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "white",
    margin: 10,
  },
  taskListContainer: {
    flex: 1,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  taskListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  taskStatus: {
    fontSize: 12,
    color: "#888",
  },
  noTasksText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
});