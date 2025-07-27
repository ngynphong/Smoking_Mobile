import React, { useState, useContext, useRef } from 'react';
import { TouchableOpacity, View, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function FloatingActionButton() {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true,
        }).start();
        setIsOpen(!isOpen);
    };

    const handleChatPress = () => {
        if (user.membership.subscriptionType === 'plus' || user.membership.subscriptionType === 'premium') {
            navigation.navigate('ChatHistory');
        } else {
            Toast.show({
                type: 'error',
                text1: 'Bạn cần nâng cấp gói',
                text2: 'Gói người dùng của bạn không đủ điều kiện',
                position: 'top',
            });
        }
        toggleMenu();
    };

    const handleRelapsePress = () => {
        navigation.navigate('RelapseLogging');
        toggleMenu();
    };

    const handleGoal = () => {
        navigation.navigate('FinancialGoal');
        toggleMenu();
    };

    const goalStyle = {
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -60],
                }),
            },
        ],
    };

    const chatStyle = {
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -120],
                }),
            },
        ],
    };

    const relapseStyle = {
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -180],
                }),
            },
        ],
    };

    const rotation = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "45deg"],
                }),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.button, styles.secondary, relapseStyle]}>
                <TouchableOpacity onPress={handleRelapsePress}>
                    <Icon name="leaf-outline" size={28} color="white" />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.button, styles.secondary, chatStyle, { backgroundColor: '#3B82F6' }]}>
                <TouchableOpacity onPress={handleChatPress}>
                    <Icon name="chatbubble-ellipses-outline" size={28} color="white" />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.button, styles.secondary, goalStyle, { backgroundColor: '#F59E0B' }]}>
                <TouchableOpacity onPress={handleGoal}>
                    <Icon name="cash-outline" size={28} color="white" />
                </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={toggleMenu} style={[styles.button, styles.menu]}>
                <Animated.View style={rotation}>
                    <Icon name="add" size={28} color="white" />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90,
        right: 16,
        alignItems: 'center',
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menu: {
        backgroundColor: '#10B981',
    },
    secondary: {
        position: 'absolute',
        backgroundColor: '#22C55E',
    },
});
