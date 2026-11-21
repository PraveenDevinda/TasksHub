import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  // 1. Create variables to store Student Name, Student ID and Profile Image
  const [studentName, setStudentName] = useState('');
  const [studentID, setStudentId] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('studentProfile');

      if (storedProfile) {
        const parsedData = JSON.parse(storedProfile);
        setStudentName(parsedData.name || '');
        setStudentId(parsedData.id || '');
        setProfileImage(parsedData.imageUri || null);
      }
    } catch (error) {
      console.error('Failed to load profile data', error);
    }
  };

  // 3. Function to pick an image from the gallery
  const pickImage = async () => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        "You've refused to allow this app to access your photos!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfileData = async () => {
    if (!studentName || !studentID) {
      Alert.alert('Error', 'Please enter both Name and Student ID');
      return;
    }

    try {
      const profileData = {
        name: studentName,
        id: studentID,
        imageUri: profileImage,
      };

      await AsyncStorage.setItem(
        'studentProfile',
        JSON.stringify(profileData)
      );

      Alert.alert('Success', 'Profile details saved successfully!');
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  // Function to clear data in the storage
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setStudentName('');
      setStudentId('');
      setProfileImage(null);

      Alert.alert('Success', 'All local data has been wiped');
    } catch (error) {
      console.error('Failed to clear storage', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 1. Wrap image in TouchableOpacity to trigger the picker */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image
          source={{
            uri: profileImage
              ? profileImage
              : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
          }}
          style={styles.avatar}
        />

        <View style={styles.editBadge}>
          <Text style={styles.editBadgeText}>✏️</Text>
        </View>
      </TouchableOpacity>

      {/* 2. Profile heading */}
      <Text style={styles.heading}>Student Profile</Text>
      <Text style={styles.subtitle}>Manage your personal details</Text>

      {/* 3. Student Name */}
      <Text style={styles.label}>Student Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={studentName}
        onChangeText={setStudentName}
      />

      {/* 4. Student ID */}
      <Text style={styles.label}>Student ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your student ID"
        value={studentID}
        onChangeText={setStudentId}
      />

      {/* 5. Save Profile Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveProfileData}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      {/* 6. Clear Data Button */}
      <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
        <Text style={styles.buttonText}>Clear All Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },

  imageContainer: {
    marginTop: 30,
    marginBottom: 20,
    position: 'relative',
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#2563EB',
  },

  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
  },

  editBadgeText: {
    fontSize: 18,
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2563EB',
  },

  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 14,
    backgroundColor: 'white',
    marginBottom: 20,
  },

  saveButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  clearButton: {
    width: '100%',
    backgroundColor: '#DC2626',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});