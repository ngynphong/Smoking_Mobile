import { TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function FloatingActionButton() {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    const handleChatPress = () => {
        if (user.membership.subscriptionType === 'plus' || user.membership.subscriptionType === 'premium') {
            navigation.navigate('ChatHistory')
        } else {
            Toast.show({
                type: 'error',
                text1: 'Bạn cần nâng cấp gói',
                text2: 'Gói người dùng của bạn không đủ điều kiện',
                position: 'top'
            });
        }
    };

    const handleRelapsePress = () => {
        navigation.navigate('RelapseLogging');
    };

    return (
        <>
            {/* Chat FAB */}
            <TouchableOpacity
                onPress={handleChatPress}
                style={{
                    position: 'absolute',
                    bottom: 150,
                    right: 16,
                    backgroundColor: '#3B82F6',
                    borderRadius: 9999,
                    padding: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                <Icon name="chatbubble-ellipses-outline" size={28} color="white" />
            </TouchableOpacity>

            {/* Relapse Logging FAB */}
            <TouchableOpacity
                onPress={handleRelapsePress}
                style={{
                    position: 'absolute',
                    bottom: 90,
                    right: 16,
                    backgroundColor: '#22C55E',
                    borderRadius: 9999,
                    padding: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                <Icon name="leaf-outline" size={28} color="white" />
            </TouchableOpacity>
        </>
    );
}