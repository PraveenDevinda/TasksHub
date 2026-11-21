import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setDescription] = useState('');

  const saveTask = async () => {
    if (!taskName || !taskDescription) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // 1. Fetch existing tasks
      const existingTasks = await AsyncStorage.getItem('tasks');
      let tasksArray = existingTasks ? JSON.parse(existingTasks) : [];

      // 2. Add the new task
      const newTask = {
        id: Date.now().toString(),
        taskName,
        taskDescription,
      };

      tasksArray.push(newTask);

      // 3. Save back to storage using JSON.stringify
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksArray));

      // 4. Trigger a local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Saved Successfully',
          body: `Don't forget to complete your ${taskName}.`,
        },
        trigger: null,
      });

      // 5. Navigate back to dashboard
      router.back();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

return (
  <ImageBackground
    source={{
      uri: 'https://img.magnific.com/free-vector/isometric-timemanagement-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80',
    }}
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.container}>

      {/* Banner Image */}
      <Image
        source={{
          uri: 'https://static.vecteezy.com/system/resources/previews/016/921/110/non_2x/business-taskmanagement-illustration-concept-on-white-background-vector.jpg',
        }}
        style={styles.banner}
        resizeMode="contain"
      />

      <Text style={styles.label}>Task Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter task name"
        value={taskName}
        onChangeText={setTaskName}
      />

      <Text style={styles.label}>Task Description</Text>

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Enter task description"
        value={taskDescription}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />

      {/* Save Task Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={saveTask}
      >
        <Text style={styles.buttonText}>Save Task</Text>
      </TouchableOpacity>

    </View>
  </ImageBackground>
);
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  banner: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 10,
  },

  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: 'white',
  },

  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});