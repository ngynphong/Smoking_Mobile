import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Alert,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';

import { getPackages } from '../../api/packageApi';
import { createSubscription, createPaymentLink } from '../../api/paymentApi';
import { getMyActiveSubscription } from '../../api/subscriptionApi';
import Loading from '../Loading';

// Component được tối ưu hóa cho giao diện sạch sẽ và hiện đại
const SubscriptionPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [activeSubscriptionId, setActiveSubscriptionId] = useState(null);
    const [error, setError] = useState(null);

    // Cấu hình UI mới cho các gói
    const packageUIConfig = {
        free: {
            icon: "rocket-outline",
            cardClass: "bg-slate-100 border-2 border-slate-200",
            titleClass: "text-slate-800",
            priceClass: "text-slate-800",
            featureColor: "text-slate-600",
            buttonClass: "bg-slate-800",
            buttonTextClass: "text-white",
        },
        plus: {
            icon: "sparkles-outline",
            cardClass: "bg-indigo-600 border-2 border-indigo-700", // Gói nổi bật
            titleClass: "text-white",
            priceClass: "text-white",
            featureColor: "text-indigo-200",
            buttonClass: "bg-white",
            buttonTextClass: "text-indigo-600",
            popular: true,
        },
        premium: {
            icon: "earth-outline",
            cardClass: "bg-gray-900 border-2 border-gray-700",
            titleClass: "text-white",
            priceClass: "text-white",
            featureColor: "text-gray-300",
            buttonClass: "bg-amber-400",
            buttonTextClass: "text-gray-900",
        },
    };

    const transformPackageData = (apiPackages) => {
        return apiPackages.map((pkg) => {
            const config = packageUIConfig[pkg.name] || packageUIConfig.free;

            let period;
            if (pkg.duration_days === 0) period = "Vĩnh viễn";
            else if (pkg.duration_days % 365 === 0) period = `/ năm`;
            else if (pkg.duration_days % 30 === 0) period = `/ tháng`;
            else period = `/${pkg.duration_days} ngày`;

            return {
                ...config,
                id: pkg._id,
                name: pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1),
                price: pkg.price === 0 ? "Miễn phí" : pkg.price.toLocaleString('vi-VN') + '₫',
                period: pkg.price === 0 ? "" : period,
                subtitle: pkg.description,
                features: pkg.features,
            };
        });
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [packagesResponse, activeSubResponse] = await Promise.all([
                getPackages(),
                getMyActiveSubscription().catch(() => ({ data: null })) // Tránh lỗi nếu không có gói nào
            ]);

            if (packagesResponse.data?.packages) {
                const transformed = transformPackageData(packagesResponse.data.packages);
                //sắp xếp gói free lên đầu
                transformed.sort((a, b) => {
                    if (a.name === "Free" && b.name !== "Free") return -1;
                    if (a.name !== "Free" && b.name === "Free") return 1;
                    return 0;
                });
                setPackages(transformed);
            }

            if (activeSubResponse.data) {
                setActiveSubscriptionId(activeSubResponse.data.package_id?._id);
            }

        } catch (err) {
            console.error('Lỗi khi tải dữ liệu gói:', err);
            setError("Không thể tải danh sách gói dịch vụ. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePayment = async (packageId, price) => {
        if (price === "Miễn phí") {
            Alert.alert("Thông báo", "Bạn đang sử dụng gói miễn phí.");
            return;
        }

        setPaymentLoading(true);
        try {
            const subResponse = await createSubscription(packageId);
            const subId = subResponse.data?.subscription?._id;
            if (!subId) throw new Error("Không thể tạo gói đăng ký.");

            const paymentResponse = await createPaymentLink(subId);
            const checkoutUrl = paymentResponse.data?.checkoutUrl;

            if (checkoutUrl) {
                await Linking.openURL(checkoutUrl);
            } else {
                throw new Error("Không thể tạo liên kết thanh toán.");
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Lỗi thanh toán.";
            Alert.alert("Lỗi", message);
        } finally {
            setPaymentLoading(false);
        }
    };

    const renderPackageCard = (pkg) => {
        const isCurrentPackage = pkg.id === activeSubscriptionId;
        const buttonText = isCurrentPackage ? "Gói Hiện Tại" : "Nâng Cấp";
        const isButtonDisabled = isCurrentPackage || paymentLoading;

        return (
            <View key={pkg.id} className={clsx("rounded-3xl p-6 m-4", pkg.cardClass)}>
                {pkg.popular && (
                    <View className="absolute top-4 right-4 bg-yellow-400 px-3 py-1 rounded-full">
                        <Text className="text-yellow-900 font-bold text-xs">Phổ biến</Text>
                    </View>
                )}

                <View className="flex-row items-center mb-4">
                    <Ionicons name={pkg.icon} size={28} color={pkg.titleClass.includes('white') ? 'white' : '#1f2937'} />
                    <Text className={clsx("text-2xl font-bold ml-3", pkg.titleClass)}>{pkg.name}</Text>
                </View>

                <Text className={clsx("text-sm mb-4", pkg.featureColor)}>{pkg.subtitle}</Text>

                <View className="flex-row items-baseline mb-6">
                    <Text className={clsx("text-4xl font-extrabold", pkg.priceClass)}>{pkg.price}</Text>
                    {pkg.period && <Text className={clsx("text-base font-medium ml-1", pkg.featureColor)}>{pkg.period}</Text>}
                </View>

                <View className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                        <View key={index} className="flex-row items-start">
                            <Ionicons name="checkmark-circle-outline" size={20} color={pkg.featureColor} className="mr-3 mt-0.5" />
                            <Text className={clsx("text-base flex-1", pkg.featureColor)}>{feature}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={() => handlePayment(pkg.id, pkg.price)}
                    disabled={isButtonDisabled}
                    className={clsx(
                        "py-4 rounded-xl items-center justify-center mt-auto",
                        pkg.buttonClass,
                        isButtonDisabled && "opacity-60"
                    )}
                >
                    {paymentLoading && !isCurrentPackage ? (
                        <ActivityIndicator color={pkg.buttonTextClass.includes('white') ? 'white' : 'black'} />
                    ) : (
                        <Text className={clsx("text-base font-bold", pkg.buttonTextClass)}>{buttonText}</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return <Loading/>;
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center p-5">
                <Text className="text-red-500 text-center">{error}</Text>
                <TouchableOpacity onPress={fetchData} className="mt-4 bg-blue-500 px-4 py-2 rounded">
                    <Text className="text-white">Thử lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 ">
            <StatusBar barStyle="dark-content" />
            <View className="p-5 items-center">
                <Text className="text-3xl font-bold text-gray-800">Chọn Gói Của Bạn</Text>
                <Text className="text-gray-500 mt-1">Nâng cấp để có trải nghiệm tốt nhất.</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {packages.map(pkg => renderPackageCard(pkg))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SubscriptionPackages;