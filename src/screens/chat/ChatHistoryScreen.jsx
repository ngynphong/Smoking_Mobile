import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { getChatSessions } from '../../api/chatBotApi'; // This function needs to be created in chatBotApi.js
import Icon from 'react-native-vector-icons/Ionicons';
import { ArrowLeft } from 'lucide-react-native';

const ChatHistoryScreen = () => {
  const { user } = useContext(AuthContext);
  const [chatSessions, setChatSessions] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (user?.id) {
        try {
          // This endpoint needs to be created on the backend
          const response = await getChatSessions(user.id); 
          setChatSessions(response.data);
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        }
      }
    };
    fetchChatHistory();
  }, [user]);

  const handleNewChat = () => {
    navigation.navigate('Chat', { chatId: null });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', { chatId: item._id })}
      className="bg-white p-4 my-2 rounded-lg shadow-md flex-row justify-between items-center"
    >
      <Text className="text-lg">{item.title}</Text>
      <View className="flex-row items-center space-x-4">
        <Text className="text-xs">{new Date(item.created_at).toLocaleDateString('vi-VN')}</Text>
        <Icon name="chevron-forward-outline" size={20} color="#6b7280" />
      </View>
    </TouchableOpacity>
    
  );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <TouchableOpacity className='p-2 absolute top-8 left-2 z-20' onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#374151" />
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-center  p-6">Lịch sử đoạn chat</Text>

      <FlatList
        data={chatSessions}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <TouchableOpacity
            onPress={handleNewChat}
            className="bg-blue-400 p-4 my-2 rounded-xl shadow-md flex-row justify-center items-center"
          >
            <Icon name="add-circle-outline" size={24} color="white" />
            <Text className="text-white text-lg ml-2">Đoạn chat mới</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default ChatHistoryScreen;
