import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, ScrollView, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { getChatBot, postChatBot, postChatMessage } from '../../api/chatBotApi';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();
  const route = useRoute();

  const quickReplies = [
    "Làm thế nào để bỏ thuốc?",
    "Lợi ích của việc bỏ thuốc?",
    "Triệu chứng khi cai thuốc?",
  ];

  useEffect(() => {
    const { chatId: routeChatId } = route.params || {};
    if (routeChatId) {
      setChatId(routeChatId);
    } else {
      const initializeChat = async () => {
        if (user?.id) {
          try {
            const response = await postChatBot({ userId: user.id });
            setChatId(response.data._id);
          } catch (error) {
            console.error("Failed to start chat session:", error);
          }
        }
      };
      initializeChat();
    }
  }, [user, route.params]);

  useEffect(() => {
    if (chatId) {
      const fetchHistory = async () => {
        try {
          const response = await getChatBot(chatId);
          setMessages(response.data);
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        }
      };
      fetchHistory();
    }
  }, [chatId]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = async (text) => {
    const content = text || input;
    if (content.trim() === '') return;

    const userMessage = {
      _id: Math.random().toString(),
      sender_type: 'user',
      content: content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    if (!text) {
      setInput('');
    }
    setIsLoading(true);

    try {
      const response = await postChatMessage(chatId, {
        userId: user.id,
        content: content,
      });
      const aiMessage = response.data.aiMessage;
      setMessages(prev => [...prev.filter(m => m._id !== userMessage._id), userMessage, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        _id: Math.random().toString(),
        sender_type: 'ai',
        content: 'Sorry, something went wrong.',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev.filter(m => m._id !== userMessage._id), userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: '#f0f4f8' }}
      keyboardVerticalOffset={90}
    >
      <View className="flex-1 p-4">
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View className={`flex-row my-2 items-end ${item.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {item.sender_type === 'ai' && (
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/8943/8943377.png' }} className="w-8 h-8 rounded-full mr-2" />
              )}
              <View
                className={`p-3 rounded-2xl max-w-[70%] ${item.sender_type === 'user' ? 'bg-blue-500 rounded-br-none' : 'bg-white rounded-bl-none'}`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                }}
              >
                <Text className={`${item.sender_type === 'user' ? 'text-white' : 'text-gray-800'}`}>{item.content}</Text>
              </View>
            </View>
          )}
        />
        {isLoading && (
          <View className="flex-row items-center justify-start my-2">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/8943/8943377.png' }} className="w-8 h-8 rounded-full mr-2" />
            <View className="p-3 rounded-2xl max-w-[70%] bg-white rounded-bl-none">
              <ActivityIndicator size="small" color="#3b82f6" />
            </View>
          </View>
        )}
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="my-2">
            {quickReplies.map((reply, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSend(reply)}
                className="bg-blue-100 border border-blue-300 rounded-full px-4 py-2 mr-2"
              >
                <Text className="text-blue-700">{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View className="flex-row items-center bg-white rounded-full p-2 shadow-md">
            <TextInput
              className="flex-1 ml-3 text-base"
              value={input}
              onChangeText={setInput}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity onPress={() => handleSend()} className="bg-blue-500 rounded-full p-3">
              <Icon name="paper-plane-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
