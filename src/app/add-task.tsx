
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
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
    if (!taskName.trim() || !taskDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const existingTasks = await AsyncStorage.getItem('tasks');
      let tasksArray = existingTasks ? JSON.parse(existingTasks) : [];

      const newTask = {
        id: Date.now().toString(),
        taskName,
        taskDescription,
      };

      tasksArray.push(newTask);

      await AsyncStorage.setItem('tasks', JSON.stringify(tasksArray));

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Saved Successfully! 📚',
          body: `Don't forget to complete your ${taskName}.`,
        },
        trigger: null,
      });

      router.back();
    } catch (error) {
      console.error('Failed to save task', error);
      Alert.alert('Error', 'Failed to save task');
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
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Banner Image */}
          <Image
            source={{
              uri: 'https://static.vecteezy.com/system/resources/previews/016/921/110/non_2x/business-task-management-illustration-concept-on-white-background-vector.jpg',
            }}
            style={styles.banner}
            resizeMode="contain"
          />

          {/* Task Name */}
          <Text style={styles.label}>Task Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            value={taskName}
            onChangeText={setTaskName}
          />

          {/* Task Description */}
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
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
  flex: 1,
  backgroundColor: 'rgba(255,255,255,0.50)',
},

  container: {
    flexGrow: 1,
    padding: 15,
    justifyContent: 'flex-start',
    paddingBottom: 25,
  },

 banner: {
  width: '100%',
  height: 200,
  marginBottom: 35,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#CDD6DB',
},

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 7,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
    marginBottom: 18,
  },

  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 70,
  },

  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 5,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
