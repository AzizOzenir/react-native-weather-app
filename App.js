import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Homepage from './pages/home';
import tw from 'twrnc';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();

 LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state"
]) 
export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Homepage" component={Homepage} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}


