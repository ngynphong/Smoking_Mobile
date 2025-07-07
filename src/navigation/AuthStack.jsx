import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/register/RegisterScreen';
import VerifyEmailScreen from '../screens/register/VerifyEmailScreen';
import ForgotPasswordScreen from '../screens/login/ForgotPasswordScreen';
import VerifyOtpScreen from '../screens/login/VerifyOtpScreen';
import ResetPasswordScreen from '../screens/login/ResetPasswordScreen';

const Stack = createNativeStackNavigator();
export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  )
}
