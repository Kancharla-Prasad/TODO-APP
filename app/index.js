import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../components/SplashScreen';
import LoginScreen from '../components/LoginScreen';
import RegisterScreen from '../components/RegisterScreen';
import HomeScreen from '../components/HomeScreen';
const Stack = createStackNavigator();
import { SnackbarProvider } from '../components/SnackbarContext';

const App = () => {

  return (
    
    <SnackbarProvider>
      <Stack.Navigator initialRouteName='Splash'>
          <Stack.Screen name='Splash' component={SplashScreen} options={{headerShown:false}}/>
          <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown:false}} />
          <Stack.Screen name='LoginScreen' component={LoginScreen} options={{headerShown:false}} />
          <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{headerShown:false}} />
      </Stack.Navigator>  
    </SnackbarProvider>
    
  );
};

export default App;





//  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       // Store user info in Firestore
//       const docRef = doc(db, "users", user.uid);
//       await setDoc(docRef, {
//         uid: user.uid,
//         name,
//         email,
//       });