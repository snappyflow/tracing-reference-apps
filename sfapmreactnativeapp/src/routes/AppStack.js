import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../contexts/Auth';
import HomeScreen from '../screens/HomeScreen';
import BookScreen from '../screens/BookScreen';
import { Button, Icon } from 'react-native-elements';

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  const auth = useAuth();
  return (
    <Stack.Navigator screenOptions={{
      headerTintColor: 'white',
      headerStyle: { backgroundColor: '#25a9e2' },
      headerRight: () => <Button icon={
        <Icon
          name="logout"
          color="white"
        />
      } type="clear" onPress={() => {auth.signOut();}} />,
    }}>
      <Stack.Screen name="Home Screen" component={HomeScreen} />
      <Stack.Screen name="BookScreen" component={BookScreen} />
    </Stack.Navigator>
  );
};