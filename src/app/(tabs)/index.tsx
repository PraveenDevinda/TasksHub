
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<any[]>([]);

  // Reload tasks whenever Dashboard comes into focus
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
      <View style={styles.overlay}>
        <View style={styles.container}>

          <Text style={styles.heading}>Your Tasks</Text>

          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {tasks.length === 0 ? (
              <Text style={styles.empty}>
                No tasks saved yet. Add one!
              </Text>
            ) : (
              tasks.map((task: any) => (
                <View key={task.id} style={styles.taskCard}>
                  <Text style={styles.taskName}>
                    {task.taskName}
                  </Text>

                  <Text style={styles.taskDescription}>
                    {task.taskDescription}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>

          {/* Add New Task Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/add-task')}
          >
            <Text style={styles.buttonText}>
              + Add New Task
            </Text>
          </TouchableOpacity>

        </View>
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
    backgroundColor: 'rgba(255,255,255,0.65)',
  },

  container: {
    flex: 1,
    padding: 15,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },

  list: {
    flex: 1,
  },

  empty: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'gray',
    marginTop: 20,
    marginLeft: 5,
  },

  taskCard: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },

  taskDescription: {
    fontSize: 15,
    color: '#333333',
  },

  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
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
