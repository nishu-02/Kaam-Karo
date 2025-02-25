import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppSelector } from "@/hooks/useAppSelector";
import { themes } from "@/hooks/themeSlice";

const API_KEY = "Wam_xPaHALBkRbPkXjM0uhNZ5pfnixeZfDnYnB6S3kY";
const URL = "https://todocrud.chiggydoes.tech";

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
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const themeColors = themes[currentTheme] || themes.default;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [deadlines, setDeadlines] = useState<{ [key: string]: number[] }>({});
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Geting the tasks from API 
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URL}/todos/`, {
        method: "GET",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched tasks:", data);
      setTasks(data);
      return data;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      Alert.alert("Error", "Failed to load tasks. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDeadlines = useCallback(async () => {
    try {
      const savedDeadlines = await AsyncStorage.getItem("deadlines");
      if (savedDeadlines) {
        const deadlinesData = JSON.parse(savedDeadlines);
        console.log("Loaded deadlines:", deadlinesData);
        setDeadlines(deadlinesData);
        return deadlinesData;
      }
      return {};
    } catch (error) {
      console.error("Error loading deadlines:", error);
      return {};
    }
  }, []);

  const updateMarkedDates = useCallback((deadlinesData: { [key: string]: number[] }, tasksData: Task[], selected: string | null) => {
    const marked: MarkedDates = {};

    Object.entries(deadlinesData).forEach(([date, taskIds]) => {
      // Only mark dates that have valid task IDs
      const validTaskIds = taskIds.filter(id => 
        tasksData.some(task => task.id === id)
      );
      
      if (validTaskIds.length > 0) {
        marked[date] = {
          marked: true,
          dotColor: getTaskStatusColor(validTaskIds, tasksData),
        };
      }
    });

    if (selected) {
      marked[selected] = {
        ...marked[selected],
        selected: true,
        selectedColor: "#2196F3",
      };
    }

    setMarkedDates(marked);
  }, []);

  const getTaskStatusColor = (taskIds: number[], tasksData: Task[]): string => {
    // Find if any of the tasks are completed
    const hasCompleted = tasksData.some(
      (task) => taskIds.includes(task.id) && task.status.toLowerCase() === "completed"
    );
    return hasCompleted ? "#4CAF50" : "#2196F3";
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksData, deadlinesData] = await Promise.all([
        fetchTasks(),
        loadDeadlines(),
      ]);
      
      updateMarkedDates(deadlinesData, tasksData, selectedDate);
      
      // If a date is already selected, update its tasks
      if (selectedDate) {
        const taskIds = deadlinesData[selectedDate] || [];
        const tasksForDate = tasksData.filter(task => 
          taskIds.includes(task.id)
        );
        setSelectedDateTasks(tasksForDate);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchTasks, loadDeadlines, selectedDate, updateMarkedDates]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDateSelect = (day: DateData) => {
    const selectedDateString = day.dateString;
    setSelectedDate(selectedDateString);

    updateMarkedDates(deadlines, tasks, selectedDateString);

    // Get task IDs for the selected date
    const taskIds = deadlines[selectedDateString] || [];
    console.log("Selected date:", selectedDateString);
    console.log("Task IDs for date:", taskIds);
    
    // Find tasks that match the IDs in taskIds
    const tasksForDate = tasks.filter(task => taskIds.includes(task.id));
    console.log("Tasks for date:", tasksForDate);
    
    setSelectedDateTasks(tasksForDate);
  };
  

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: themeColors.background}]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Calendar
          style={[styles.calendar, {backgroundColor: themeColors.background}]}
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

        <View style={styles.debugContainer}>
          <Text style={styles.helpText}>
            Pull down to refresh if you don't see your tasks
          </Text>
        </View>

        <View style={[styles.taskListContainer, {backgroundColor: themeColors.background}]}>
          <Text style={styles.taskListTitle}>
            {selectedDate ? `Tasks for ${selectedDate}` : "Select a date to view tasks"}
          </Text>

          <View style={styles.taskList}>
            {loading ? (
              <Text style={styles.loadingText}>Loading tasks...</Text>
            ) : selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((task) => (
                <View key={task.id} style={styles.taskItem}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                  <Text style={styles.taskStatus}>Status: {task.status}</Text>
                  <Text style={styles.taskDate}>Created: {task.created_at}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noTasksText}>
                {selectedDate 
                  ? "No tasks for this date" 
                  : "Select a date to view tasks"}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
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
  debugContainer: {
    margin: 10,
    alignItems: "center",
  },
  helpText: {
    marginTop: 8,
    color: "#666",
    textAlign: "center",
    fontSize: 12,
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
    minHeight: 200,
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
    marginBottom: 3,
  },
  taskDate: {
    fontSize: 12,
    color: "#999",
  },
  noTasksText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
});