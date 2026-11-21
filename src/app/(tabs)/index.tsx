import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');

      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
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
        <ScrollView style={styles.list}>
          {tasks.length === 0 ? (
            <Text style={styles.empty}>
              No tasks saved yet. Add one!
            </Text>
          ) : (
            tasks.map((task: any) => (
              <View key={task.id} style={styles.taskCard}>
                <Text style={styles.taskName}>{task.taskName}</Text>
                <Text style={styles.taskDescription}>
                  {task.taskDescription}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/add-task')}
        >
          <Text style={styles.buttonText}>+ Add New Task</Text>
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
    backgroundColor: 'rgba(255,255,255,0.65)',
  },

  list: {
    flex: 1,
  },

  empty: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#333',
  },

  taskCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2563EB',
  },

  taskDescription: {
    fontSize: 15,
    color: '#333',
  },

  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});