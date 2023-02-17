import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen2 from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <LoginScreen2 />
    </Stack.Navigator>
  );
};