import { View, Text, Image } from 'react-native';

const blogPosts = [
    {
        title: "Cách tôi bỏ thuốc sau 10 năm…",
        image: "https://placeimg.com/640/360/nature"
    },
    {
        title: "Bí quyết cai thuốc khi làm việc áp lực",
        image: "https://placeimg.com/640/360/people"
    }
];

export default function BlogPreviewList() {
    return (
        <View className="mb-20">
            <Text className="text-lg font-semibold mb-2">📚 Blog truyền cảm hứng</Text>
            {blogPosts.map((post, index) => (
                <View key={index} className="mb-3">
                    <Image source={{ uri: post.image }} className="h-36 rounded-xl" />
                    <Text className="font-semibold mt-1">{post.title}</Text>
                </View>
            ))}
        </View>
    );
}