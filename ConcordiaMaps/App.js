import * as React from 'react';
import {StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screen/HomeScreen';
import LoginScreen from './screen/LoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown:false}}
      >
        <Stack.Screen style={styles.container}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen name="Log In" component={LoginScreen} />
      </Stack.Navigator>  
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container:{  
  width: "100%",
  height: "100%",
  backgroundColor: '#912338',
  color:'blue', 
}
})
