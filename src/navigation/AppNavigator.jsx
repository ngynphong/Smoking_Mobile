import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack';
import { AuthContext } from '../contexts/AuthContext';
import { TabBarProvider } from '../contexts/TabBarContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import { setupAxiosInterceptors } from '../configs/axios';
import ChatScreen from '../screens/chat/ChatScreen';
import ChatHistoryScreen from '../screens/chat/ChatHistoryScreen';
import CoachListScreen from '../screens/meeting/CoachListScreen';
import BookingScreen from '../screens/meeting/BookingScreen';
import MyMeetingsScreen from '../screens/meeting/MyMeetingsScreen';
import ProgressHistoryScreen from '../screens/progress/ProgressHistoryScreen';
import FeedbackCoachScreen from '../screens/feedback/FeedbackCoachScreen';
import RelapseLoggingScreen from '../screens/relapse/RelapseLoggingScreen';

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
    <TabBarProvider>
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
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="ChatHistory" component={ChatHistoryScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="CoachList" component={CoachListScreen} />
              <Stack.Screen name="BookingScreen" component={BookingScreen} />
              <Stack.Screen name="MyMeetings" component={MyMeetingsScreen} />
              <Stack.Screen name="ProgressHistory" component={ProgressHistoryScreen} />
              <Stack.Screen name="FeedbackCoach" component={FeedbackCoachScreen} />
              <Stack.Screen
                name="RelapseLogging"
                component={RelapseLoggingScreen}
              // options={{
              //   presentation: 'modal',
              //   animation: 'slide_from_bottom',
              //   headerShown: false
              // }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </TabBarProvider>
  );
}
