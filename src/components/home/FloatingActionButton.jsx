import { TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export default function FloatingActionButton() {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const handlePress = () => {
        if (user.membership.subscriptionType === 'premium') {
            navigation.navigate('ChatHistory')
        }
        Alert.alert('Bạn cần nâng cấp gói', 'Gói người dùng của bạn không đủ điều kiện')
    };

    return (
        <TouchableOpacity
            onPress={() => handlePress()}
            className="absolute bottom-24 right-6 bg-blue-500 rounded-full p-2 shadow-lg"
        >
            <Icon name="chatbubble-ellipses-outline" size={24} color="white" />
        </TouchableOpacity>
    );
}
