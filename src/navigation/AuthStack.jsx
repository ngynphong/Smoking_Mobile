import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/register/RegisterScreen';
import VerifyEmailScreen from '../screens/register/VerifyEmailScreen';

const Stack = createNativeStackNavigator();
export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </Stack.Navigator>
  )
}