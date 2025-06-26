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
import QuitPlanScreen from '../screens/quitPlan/QuitPlanScreen';
import CreatePostScreen from '../screens/community/CreatePostScreen';
import EditPostScreen from '../screens/community/EditPostScreen';
import MyPostScreen from '../screens/profile/MyPostScreen';
import MyQuitPlanScreen from '../screens/quitPlan/MyQuitPlanScreen';
import SmokingStatusScreen from '../screens/profile/SmokingStatusScreen';
import CreateQuitPlanRequest from '../screens/profile/CreateQuitPlanRequest';
import RequestQuitPlanScreen from '../screens/profile/RequestQuitPlanScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProfileStackScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="ProfileDetail" component={ProfileDetail} />
            <Stack.Screen name="Badge" component={BadgeScreen} />
            <Stack.Screen name='MyPosts' component={MyPostScreen} />
            <Stack.Screen name="PostDetail" component={PostDetail} />
            <Stack.Screen name="MyQuitPlan" component={MyQuitPlanScreen} />
            <Stack.Screen name="SmokingStatus" component={SmokingStatusScreen} />
            <Stack.Screen name="CreateQuitPlanRequest" component={CreateQuitPlanRequest} />
            <Stack.Screen name="QuitPlanRequest" component={RequestQuitPlanScreen} />
        </Stack.Navigator>
    );
};

function CommunityStackScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CommunityMain" component={CommunityScreen} />
            <Stack.Screen name="PostDetail" component={PostDetail} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="EditPost" component={EditPostScreen} />
        </Stack.Navigator>
    )
};

function HomeStackScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="PostDetail" component={PostDetail} />
        </Stack.Navigator>
    )
};

function QuitPlanStackScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="QuitPlanMain" component={QuitPlanScreen} />
            <Stack.Screen name="MyQuitPlan" component={MyQuitPlanScreen} />
        </Stack.Navigator>
    )
}
export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'QuitPlan') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
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
                tabBarActiveTintColor: '#3366FF',
                tabBarInactiveTintColor: '#b0bec5',
                headerShown: false,
            })}
        >
            <Tab.Screen options={{ title: 'Trang Chủ' }} name="Home" component={HomeStackScreen} />
            <Tab.Screen options={{ title: 'Kế Hoạch' }} name="QuitPlan" component={QuitPlanStackScreen} />
            <Tab.Screen options={{ title: 'Cộng Đồng' }} name="Community" component={CommunityStackScreen} />
            <Tab.Screen options={{ title: 'Tiến Trình' }} name="Progress" component={ProgressScreen} />
            <Tab.Screen options={{ title: 'Hồ Sơ' }} name='Profile' component={ProfileStackScreen} />
        </Tab.Navigator>
    )
}