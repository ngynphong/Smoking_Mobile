import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { verifyEmail } from '../../api/authApi';

const VerifyEmailScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const [code, setCode] = useState('');

    const handleVerify = async () => {
        try {
            const res = await verifyEmail({ email, code });
            if (res.status !== 200) {
                throw new Error(res.data.message || 'Verification failed');
            }
            Alert.alert('Success', res.data.message);
            navigation.navigate('Login');
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-blue-300">
            <View className="bg-white p-6 rounded-lg shadow-lg mx-auto w-[85%]">
                <Text className="text-3xl font-bold mb-4">Enter verification code</Text>
                <Text className="mb-4 text-gray-500 text-sm">We sent a code to {email}</Text>
                <TextInput
                    placeholder="6-digit code"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    className="border p-2 mb-4 rounded text-center text-lg"
                    maxLength={6}
                />
                <TouchableOpacity onPress={handleVerify} className="bg-blue-600 py-3 rounded">
                    <Text className="text-white text-center font-bold">Verify</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default VerifyEmailScreen;
