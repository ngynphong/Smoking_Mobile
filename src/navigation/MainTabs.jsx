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
import { LinearGradient } from 'expo-linear-gradient';
import FeedbackScreen from '../screens/FeedbackScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import MyMeetingsScreen from '../screens/meeting/MyMeetingsScreen';

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
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
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
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="CreateQuitPlanRequest" component={CreateQuitPlanRequest} />
            <Stack.Screen name="MyMeetings" component={MyMeetingsScreen} />
        </Stack.Navigator>
    )
};

function QuitPlanStackScreen() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="QuitPlanMain" component={QuitPlanScreen} />
            <Stack.Screen name="MyQuitPlan" component={MyQuitPlanScreen} />
            <Stack.Screen name="CreateQuitPlanRequest" component={CreateQuitPlanRequest} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
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

                    if (focused) {
                        return (
                            <View style={{
                                backgroundColor: '#e3f0ff',
                                borderRadius: 24,
                                padding: 4,
                                shadowColor: '#3366FF',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 4,
                            }}>
                                <Icon name={iconName} size={size} color={'#3366FF'} />
                            </View>
                        );
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarLabel: ({ focused, color }) => (
                    <Text style={{
                        color: focused ? '#3366FF' : '#b0bec5',
                        fontWeight: focused ? 'semibold' : 'normal',
                        fontSize: 12,
                        marginBottom: 1,
                    }}>
                        {route.name === 'Home' ? 'Trang Chủ'
                            : route.name === 'QuitPlan' ? 'Kế Hoạch'
                                : route.name === 'Community' ? 'Cộng Đồng'
                                    : route.name === 'Progress' ? 'Tiến Trình'
                                        : route.name === 'Profile' ? 'Hồ Sơ'
                                            : route.name}
                    </Text>
                ),
                tabBarActiveTintColor: '#3366FF',
                tabBarInactiveTintColor: '#b0bec5',
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 16,
                    borderRadius: 32,
                    height: 50,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowColor: '#3366FF',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                },
                tabBarBackground: () => (
                    <LinearGradient
                        colors={['#e3f0ff', '#b3d1ff', '#e3f0ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            flex: 1,
                            borderRadius: 32,
                        }}
                    />
                ),
                animation: 'fade',
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