# ToDo App

## 📌 Overview
This is a **React Native ToDo App** that interacts with a custom-built API to manage tasks. The app provides users with a seamless experience for **adding, updating, and deleting tasks** while storing data efficiently using **AsyncStorage**. Additionally, it features **4-6 different themes** and an **integrated calendar** for enhanced task organization.

The primary objective of this project was to:
- Learn how to consume **custom APIs** in React Native.
- Handle **nested API responses** efficiently.
- Implement **AsyncStorage** for local data persistence.
- Explore **theme switching** and **calendar integration**.
- Manage state effectively with React hooks.

## 🔥 Features
- ✅ Add, update, and delete tasks.
- 🎨 **Multiple themes** (4-6 variations) to personalize the UI.
- 📆 **Calendar view** to display tasks by date.
- 🔄 **Persistent storage** using AsyncStorage.
- 📡 **API integration** for syncing tasks.
- ⚡ Optimized performance with **batch API calls**.
- 📌 **Offline support** – Local storage ensures tasks are available even without an internet connection.

## 🚀 Tech Stack
- **React Native** – UI framework.
- **JavaScript (ES6+)** – Core logic.
- **AsyncStorage** – Local storage.
- **Fetch API / Axios** – API requests.
- **React Navigation** – Handling navigation.
- **Styled Components** – Theming.

## 🛠 API Structure
The API provides endpoints to manage tasks. The responses contain **nested data**, requiring additional API calls for complete task details.

### Example API DOCS:
```https://todocrud.chiggydoes.tech/docs```
```
fetch('https://api.example.com/tasks')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching tasks:', error));
```

### Sample API Response:
```
[
  {
    "id": 1,
    "title": "Complete React Native project",
    "description": "Finish API integration and UI refinements",
    "due_date": "2025-03-25",
    "status": "pending"
  },
  {
    "id": 2,
    "title": "Buy groceries",
    "description": "Milk, eggs, and vegetables",
    "due_date": "2025-03-22",
    "status": "completed"
  }
]
```

## 🔄 Handling API Calls
Since task-related data might be deeply nested, I handled API requests efficiently using **async/await** and **batch processing**.

### Fetching All Tasks
```
async function fetchTasks() {
  try {
    const response = await fetch('https://api.example.com/tasks');
    const tasks = await response.json();
    console.log('Tasks:', tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}
fetchTasks();
```

### Adding a Task
```
async function addTask(title, description, dueDate) {
  try {
    const response = await fetch('https://api.example.com/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, due_date: dueDate, status: 'pending' })
    });
    const newTask = await response.json();
    console.log('Task added:', newTask);
  } catch (error) {
    console.error('Error adding task:', error);
  }
}
```

### Updating a Task
```
async function updateTask(taskId, updatedData) {
  try {
    const response = await fetch(`https://api.example.com/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    const updatedTask = await response.json();
    console.log('Task updated:', updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
  }
}
```

### Deleting a Task
```
async function deleteTask(taskId) {
  try {
    await fetch(`https://api.example.com/tasks/${taskId}`, { method: 'DELETE' });
    console.log('Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}
```

## 📦 Storing Tasks in AsyncStorage
To ensure tasks are available even offline, I used **AsyncStorage** to cache data.

### Saving Tasks Locally
```
import AsyncStorage from '@react-native-async-storage/async-storage';

async function saveTasksToStorage(tasks) {
  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}
```

### Retrieving Tasks from Storage
```
async function getTasksFromStorage() {
  try {
    const tasks = await AsyncStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    return [];
  }
}
```

## 🎨 Theme Management
I implemented 4-6 different themes using **Styled Components**.

### Example Theme Object:
```
const lightTheme = {
  background: '#ffffff',
  textColor: '#333333',
  buttonColor: '#007bff',
};

const darkTheme = {
  background: '#333333',
  textColor: '#ffffff',
  buttonColor: '#ff4757',
};
```

### Applying Themes:
```
import { ThemeProvider } from 'styled-components/native';

export default function App() {
  const [theme, setTheme] = useState(lightTheme);
  return (
    <ThemeProvider theme={theme}>
      <MainScreen setTheme={setTheme} />
    </ThemeProvider>
  );
}
```

## 📌 Key Learnings
1. **Handling Nested API Responses** – Managing deeply nested task-related data.
2. **Using AsyncStorage** – Ensuring task persistence across app sessions.
3. **Efficient API Requests** – Using `async/await` and batch requests.
4. **React Native UI Optimization** – Implementing smooth theme switching and calendar integration.
5. **Offline-First Approach** – Local storage ensures app usability without an internet connection.

## 🔮 Future Enhancements
- Implementing task prioritization.
- Adding push notifications for due tasks.
- Syncing local tasks with the server when online.
- Enhancing animations and UI transitions.

## 🙌 Credits
- **React Native & AsyncStorage Docs** – Learning how to integrate storage.
- **Styled Components** – For dynamic theme switching.

## 📬 Contact
If you have any suggestions or feedback, feel free to reach out!

---

//--------------------------------------------------------------------------------------------------------------------------//

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.



This README provides a **detailed overview of the ToDo App**, which shows API usage, async storage, themes, and React Native best practices. 🚀 Let me know if you'd like to refine any section!
