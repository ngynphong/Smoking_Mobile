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
import PostDetail from '../screens/community/PostDetail';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
            <ProfileStack.Screen name="ProfileDetail" component={ProfileDetail} />
        </ProfileStack.Navigator>
    );
};

function CommunityStackScreen(){
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="CommunityMain" component={CommunityScreen} />
            <ProfileStack.Screen name="PostDetail" component={PostDetail} />
        </ProfileStack.Navigator>
    )
}
export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Trang Chủ') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Huy Hiệu') {
                        iconName = focused ? 'diamond' : 'diamond-outline';
                    } else if (route.name === 'Cộng Đồng') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Tiến Trình') {
                        iconName = focused ? 'trending-up' : 'trending-up-outline';
                    } else if (route.name === 'Hồ Sơ') {
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
            <Tab.Screen name="Trang Chủ" component={HomeScreen} />
            <Tab.Screen name="Huy Hiệu" component={BadgeScreen} />
            <Tab.Screen name="Cộng Đồng" component={CommunityStackScreen} />
            <Tab.Screen name="Tiến Trình" component={ProgressScreen} />
            <Tab.Screen name='Hồ Sơ' component={ProfileStackScreen} />
        </Tab.Navigator>
    )
}