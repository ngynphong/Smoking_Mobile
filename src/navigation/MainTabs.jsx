import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/home/HomeScreen';
import BadgeScreen from '../screens/badge/BadgeScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileDetail from '../screens/profile/ProfileDetail';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
            <ProfileStack.Screen name="ProfileDetail" component={ProfileDetail} />
        </ProfileStack.Navigator>
    );
}
export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Badge') {
                        iconName = focused ? 'diamond' : 'diamond-outline';
                    } else if (route.name === 'Community') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Progress') {
                        iconName = focused ? 'trending-up' : 'trending-up-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // You can return any component that you like here!
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#673ab7',
                tabBarInactiveTintColor: '#b0bec5',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Badge" component={BadgeScreen} />
            <Tab.Screen name="Community" component={CommunityScreen} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
            <Tab.Screen name='Profile' component={ProfileStackScreen} />
        </Tab.Navigator>
    )
}