import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import "./global.css"
import { AuthProvider } from './src/contexts/AuthContext';
import Toast from 'react-native-toast-message';
export default function App() {
  return (
    <>
      <AuthProvider>        
        <AppNavigator />
      </AuthProvider>
      <Toast />
    </>
  );
}
