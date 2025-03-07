import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';


const imageUrl = "https://res.cloudinary.com/dgye02qt9/image/upload/v1741264497/todoimage1_jsru6s.jpg";

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={{uri:imageUrl}} style={styles.image} />

      {/* Title and Description */}
      <Text style={styles.title}>Welcome to Todo App</Text>
      <Text style={styles.subtitle}>Your journey starts here.</Text>

      {/* Get Started Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('LoginScreen')} // Change to Signup if needed
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300, 
    height: 300, 
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
