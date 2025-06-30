import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Animated,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

import { getPackages } from '../../api/packageApi';

const SubscriptionPackages = () => {
    const [currentPackage, setCurrentPackage] = useState(0);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const scrollViewRef = useRef(null);

    // Mapping function to transform API data to UI format
    const transformPackageData = (apiPackages) => {
        const packageConfig = {
            free: {
                icon: "trending-up",
                colors: ['#4ade80', '#3b82f6'],
                bgColors: ['#f0fdf4', '#eff6ff'],
                title: "Bắt đầu hành trình đến với cuộc sống không khói thuốc - Miễn phí!",
                subtitle: "Theo dõi tiến trình của bạn và nhận hỗ trợ cơ bản.",
                defaultFeatures: [
                    "Theo dõi tiến trình cơ bản",
                    "Trích dẫn động lực hàng ngày",
                    "Bộ đếm không khói thuốc",
                    "Bộ đếm thời gian thèm thuốc đơn giản"
                ],
                buttonText: "Bắt đầu miễn phí",
                buttonColors: ['#10b981', '#3b82f6']
            },
            plus: {
                icon: "chatbubble",
                colors: ['#a855f7', '#ec4899'],
                bgColors: ['#faf5ff', '#fdf2f8'],
                title: "Mở khóa các chiến lược được cá nhân hóa và mẹo của chuyên gia",
                subtitle: "Vượt qua cơn thèm thuốc bằng sự hỗ trợ được thiết kế riêng cho bạn.",
                defaultFeatures: [
                    "Các kế hoạch cai thuốc được cá nhân hóa",
                    "Mẹo và hướng dẫn của huấn luyện viên",
                    "Báo cáo tiến độ chi tiết",
                    "Phân tích mô hình cơn thèm thuốc",
                    "Nhận huy hiệu theo cột mốc"
                ],
                buttonText: "Nâng cấp lên Plus",
                buttonColors: ['#9333ea', '#ec4899'],
                popular: true
            },
            premium: {
                icon: "people",
                colors: ['#f97316', '#ef4444'],
                bgColors: ['#fff7ed', '#fef2f2'],
                title: "Nhận được sự hướng dẫn tận tình và hỗ trợ từ cộng đồng",
                subtitle: "Đảm bảo thành công của bạn với những hiểu biết sâu sắc và cộng đồng hỗ trợ.",
                defaultFeatures: [
                    "Huấn luyện viên cá nhân tận tâm",
                    "Phân tích và hiểu biết sâu sắc nâng cao",
                    "Truy cập cộng đồng hỗ trợ",
                    "Hỗ trợ chuyên gia 24/7",
                    "Kế hoạch bữa ăn được cá nhân hóa",
                    "Công cụ quản lý căng thẳng"
                ],
                buttonText: "Chuyển sang gói cao cấp",
                buttonColors: ['#ea580c', '#dc2626']
            }
        };

        return apiPackages.map((pkg, index) => {
            const config = packageConfig[pkg.name] || packageConfig.free;

            // Determine period text
            let period;
            if (pkg.duration_days === 0) {
                period = "Mãi mãi";
            } else if (pkg.duration_days === 30) {
                period = "tháng";
            } else if (pkg.duration_days === 365) {
                period = "năm";
            } else {
                period = `${pkg.duration_days} ngày`;
            }

            return {
                id: index,
                name: pkg.name === 'free' ? 'Miễn phí' :
                    pkg.name === 'plus' ? 'Plus' :
                        pkg.name === 'premium' ? 'Premium' : pkg.name,
                price: pkg.price === 0 ? "0" : pkg.price.toLocaleString('vi-VN'),
                period: period,
                icon: config.icon,
                colors: config.colors,
                bgColors: config.bgColors,
                title: config.title,
                subtitle: pkg.description || config.subtitle,
                features: pkg.features.length > 0 ? pkg.features : config.defaultFeatures,
                buttonText: config.buttonText,
                buttonColors: config.buttonColors,
                popular: config.popular || false,
                apiData: pkg // Store original API data for reference
            };
        });
    };

    const fetchPackages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPackages();
            const data = response.data.packages;

            if (response.data) {
                const transformedPackages = transformPackageData(data);
                setPackages(transformedPackages);
                // Set initial package to first one or find the popular one
                const popularIndex = transformedPackages.findIndex(pkg => pkg.popular);
                setCurrentPackage(popularIndex !== -1 ? popularIndex : 0);
            } else {
                throw new Error(data.message || 'Failed to fetch packages');
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
            setError(error.message);
            // Fallback to empty array or show error state
            setPackages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    useEffect(() => {
        if (packages.length > 0) {
            animateTransition();
        }
    }, [currentPackage]);

    const animateTransition = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0.7,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    };

    const nextPackage = () => {
        if (packages.length === 0) return;
        const newIndex = (currentPackage + 1) % packages.length;
        setCurrentPackage(newIndex);
        scrollViewRef.current?.scrollTo({ x: newIndex * width, animated: true });
    };

    const prevPackage = () => {
        if (packages.length === 0) return;
        const newIndex = (currentPackage - 1 + packages.length) % packages.length;
        setCurrentPackage(newIndex);
        scrollViewRef.current?.scrollTo({ x: newIndex * width, animated: true });
    };

    const onScroll = (event) => {
        if (packages.length === 0) return;
        const contentOffset = event.nativeEvent.contentOffset;
        const viewSize = event.nativeEvent.layoutMeasurement;
        const pageNum = Math.floor(contentOffset.x / viewSize.width);
        if (pageNum !== currentPackage && pageNum >= 0 && pageNum < packages.length) {
            setCurrentPackage(pageNum);
        }
    };

    const renderPackageCard = (pkg, index) => (
        <View key={pkg.id} style={{ width }} className="px-10 my-4">
            <LinearGradient
                colors={pkg.bgColors}
                className="rounded-2xl p-4 mx-1 shadow-lg relative overflow-hidden"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 4,
                }}
            >
                {/* Popular Badge */}
                {pkg.popular && (
                    <LinearGradient
                        colors={['#fbbf24', '#f59e0b']}
                        className="absolute top-3 right-3 flex-row items-center px-2 py-1 rounded-full z-10"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Ionicons name="star" size={12} color="white" />
                        <Text className="text-white text-xs font-semibold ml-1">Phổ biến</Text>
                    </LinearGradient>
                )}

                {/* Package Header */}
                <View className="items-center mb-4">
                    <LinearGradient
                        colors={pkg.colors}
                        className="w-16 h-16 rounded-full items-center justify-center mb-3"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 4,
                        }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name={pkg.icon} size={28} color="white" />
                    </LinearGradient>

                    <Text className="text-2xl font-bold text-slate-800 mb-1">{pkg.name}</Text>

                    <View className="flex-row items-baseline justify-center">
                        <Text className="text-3xl font-bold text-slate-800">{pkg.price}</Text>
                        {pkg.period !== 'Mãi mãi' && (
                            <Text className="text-slate-600 ml-1 text-sm">/{pkg.period}</Text>
                        )}
                    </View>
                </View>

                {/* Benefits Description */}
                <View className="items-center mb-4">
                    <Text className="text-base font-semibold text-slate-800 text-center mb-1 leading-5">
                        {pkg.title}
                    </Text>
                    <Text className="text-sm text-slate-600 text-center leading-4">
                        {pkg.subtitle}
                    </Text>
                </View>

                {/* Features List */}
                <View className="mb-5">
                    {pkg.features.map((feature, featureIndex) => (
                        <View key={featureIndex} className="flex-row items-center mb-2">
                            <LinearGradient
                                colors={pkg.colors}
                                className="w-5 h-5 rounded-full items-center justify-center mr-2"
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="checkmark" size={12} color="white" />
                            </LinearGradient>
                            <Text className="text-sm text-gray-700 font-medium flex-1">
                                {feature}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    className="shadow-md"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        // Handle package selection
                        console.log('Selected package:', pkg.apiData);
                        // You can add your package selection logic here
                    }}
                >
                    <LinearGradient
                        colors={pkg.buttonColors}
                        className="py-3 rounded-xl items-center justify-center"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text className="text-white text-base font-bold">{pkg.buttonText}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );

    // Loading state
    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#4ade80" />
                <Text className="text-gray-600 mt-4">Đang tải gói dịch vụ...</Text>
            </SafeAreaView>
        );
    }

    // Error state
    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center px-4">
                <StatusBar barStyle="light-content" />
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
                <Text className="text-red-500 text-lg font-semibold mt-4 text-center">
                    Không thể tải gói dịch vụ
                </Text>
                <Text className="text-gray-600 mt-2 text-center">{error}</Text>
                <TouchableOpacity
                    onPress={fetchPackages}
                    className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Thử lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // No packages state
    if (packages.length === 0) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center px-4">
                <StatusBar barStyle="light-content" />
                <Ionicons name="package" size={48} color="#6b7280" />
                <Text className="text-gray-500 text-lg font-semibold mt-4 text-center">
                    Không có gói dịch vụ nào
                </Text>
                <TouchableOpacity
                    onPress={fetchPackages}
                    className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Tải lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="items-center pt-6 pb-3">
                <Text className="text-2xl font-bold text-black mb-1">Chọn Con Đường Của Bạn</Text>
                <Text className="text-sm text-gray-600 italic">Mỗi chuyến đi bắt đầu bằng một bước chân.</Text>
            </View>

            {/* Package Indicators */}
            <View className="flex-row justify-center items-center py-3">
                {packages.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            setCurrentPackage(index);
                            scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
                        }}
                        className={`w-3 h-3 rounded-full mx-1 ${index === currentPackage
                            ? 'bg-white transform scale-110'
                            : 'bg-white/30'
                            }`}
                    />
                ))}
            </View>

            {/* Main Content */}
            <Animated.View
                className="flex-1 relative"
                style={{
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }}
            >
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    className="flex-1"
                >
                    {packages.map((pkg, index) => renderPackageCard(pkg, index))}
                </ScrollView>

                {/* Navigation Arrows */}
                <TouchableOpacity
                    onPress={prevPackage}
                    className="absolute left-1 w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                    style={{
                        top: '50%',
                        transform: [{ translateY: -20 }],
                        backdropFilter: 'blur(10px)'
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={nextPackage}
                    className="absolute right-1 w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                    style={{
                        top: '50%',
                        transform: [{ translateY: -20 }],
                        backdropFilter: 'blur(10px)'
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
            </Animated.View>

            {/* Bottom Section */}
            <View className="items-center py-4 px-4">
                <Text className="text-gray-700 text-xs mb-3 text-center">
                    Tham gia cùng hàng ngàn người đã cai thuốc lá thành công
                </Text>
                <View className="flex-row flex-wrap justify-center">
                    <Text className="text-slate-400 text-xs mx-1">• Hủy bất cứ lúc nào</Text>
                    <Text className="text-slate-400 text-xs mx-1">• Không có phí ẩn</Text>
                    <Text className="text-slate-400 text-xs mx-1">• Dùng thử miễn phí 7 ngày</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SubscriptionPackages;