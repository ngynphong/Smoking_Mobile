import React, { useState, useRef } from 'react';
import { View, Text, Image, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { cn } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

const slides = [
    {
        id: '1',
        title: 'Tạm biệt thuốc lá',
        description: 'Cùng hàng ngàn người khác bắt đầu hành trình sống khỏe mạnh không khói thuốc.',
        image: require('../../assets/target.png'),
    },
    {
        id: '2',
        title: 'Huấn luyện viên đồng hành',
        description: 'Bạn không đơn độc. Chuyên gia sẽ giúp bạn vượt qua từng thử thách.',
        image: require('../../assets/coaches.png'),
    },
    {
        id: '3',
        title: 'Theo dõi tiến trình',
        description: 'Ghi nhận từng bước tiến, từng ngày bạn không hút thuốc.',
        image: require('../../assets/processing.png'),
    },
];

const OnboardingScreen = ({ setIsFirstLaunch }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const handleNext = async () => {
        if (currentIndex < slides.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            // Scroll to next slide
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
        } else {
            try {
                await AsyncStorage.setItem('hasLaunched', 'true');
                // This will trigger a re-render in AppNavigator and show AuthStack
                setIsFirstLaunch(false);
            } catch (error) {
                console.error('Error saving launch state:', error);
                setIsFirstLaunch(false);
            }
        }
    };

    const handleSkip = async () => {
        try {
            await AsyncStorage.setItem('hasLaunched', 'true');
            // This will trigger a re-render in AppNavigator and show AuthStack
            setIsFirstLaunch(false);
        } catch (error) {
            console.error('Error saving launch state:', error);
            setIsFirstLaunch(false);
        }
    };

    const renderSlide = ({ item }) => (
        <View style={{ width: Dimensions.get('window').width }} className="items-center px-6 pt-20">
            <Image source={item.image} className="w-4/5 h-64 mb-6" resizeMode="contain" />
            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">{item.title}</Text>
            <Text className="text-base text-gray-600 text-center">{item.description}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                getItemLayout={(data, index) => ({
                    length: Dimensions.get('window').width,
                    offset: Dimensions.get('window').width * index,
                    index,
                })}
                onScrollToIndexFailed={() => { }}
            />

            {/* Pagination dots */}
            <View className="flex-row justify-center mt-4">
                {slides.map((_, index) => (
                    <View
                        key={index}
                        className={`w-2 h-2 rounded-full mx-1 ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </View>

            <View className="items-center pb-6">
                <TouchableOpacity
                    className="bg-blue-600 py-3 px-8 rounded-lg mt-5"
                    onPress={handleNext}
                >
                    <Text className="text-white text-base font-semibold">
                        {currentIndex === slides.length - 1 ? 'Bắt đầu' : 'Tiếp tục'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSkip} className='mt-4'>
                    <Text className="text-sm text-gray-400">Bỏ qua</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OnboardingScreen;