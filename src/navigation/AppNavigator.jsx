import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import React, { useContext, useEffect } from 'react';
import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack';
import { AuthContext } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();
export default function AppNavigator() {

  const { authStatus, isLoading } = useContext(AuthContext);

  if (isLoading) return <SplashScreen />

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authStatus ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}