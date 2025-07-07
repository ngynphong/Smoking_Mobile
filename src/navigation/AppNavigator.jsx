import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack';
import { AuthContext } from '../contexts/AuthContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import { setupAxiosInterceptors } from '../configs/axios';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { authStatus, isLoading, logout } = useContext(AuthContext);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    // Setup axios interceptor
    setupAxiosInterceptors(logout);
  }, [logout]);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        setIsFirstLaunch(hasLaunched === null);
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  if (isLoading || isFirstLaunch === null) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch && (
          <Stack.Screen
            name="Onboarding"
            component={(props) => (
              <OnboardingScreen {...props} setIsFirstLaunch={setIsFirstLaunch} />
            )}
            options={{ gestureEnabled: false }}
        />
        )}
        {!isFirstLaunch && !authStatus && (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
        {!isFirstLaunch && authStatus && (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
