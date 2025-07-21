import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Button, TouchableOpacity, Modal, TextInput } from 'react-native';
import clsx from 'clsx';
import { getBadgeUserId, shareBadge } from '../../api/badgeApi';
import { getUser } from '../../utils/authStorage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TabBarContext } from '../../contexts/TabBarContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const BadgeCard = ({ badge, onShare }) => {
  const tierColor = {
    Bronze: 'bg-amber-500',
    Silver: 'bg-gray-400',
    Gold: 'bg-yellow-400',
  }[badge.tier] || 'bg-slate-300';

  return (
    <View className={clsx(
      'flex-1 m-2 p-4 rounded-xl items-center shadow-md',
      badge.earned ? 'bg-white' : 'bg-gray-100 opacity-40'
    )}>
      <View className="w-20 h-20 mb-3">
        {badge.url_image ? (
          <Image
            source={{ uri: badge.url_image }}
            className={clsx(
              'w-full h-full rounded-full',
              badge.earned ? '' : 'opacity-50'
            )}
          />
        ) : (
          <View className="w-full h-full rounded-full bg-gray-300" />
        )}
      </View>
      <Text
        className={clsx(
          'text-base font-semibold text-center mb-1',
          badge.earned ? 'text-gray-800' : 'text-gray-400'
        )}
      >
        {badge.name}
      </Text>
      <Text
        className={clsx(
          'text-sm text-center mb-2',
          badge.earned ? 'text-gray-500' : 'text-gray-300'
        )}
      >
        {badge.point_value} điểm
      </Text>
      <View className={clsx('px-3 py-1 rounded-full', tierColor)}>
        <Text className="text-white text-xs font-semibold">{badge.tier}</Text>
      </View>
      {badge.earned && (
        <TouchableOpacity
          className="mt-2 px-3 py-1 bg-blue-500 rounded-full"
          onPress={() => onShare(badge)}
        >
          <Text className="text-white text-xs font-semibold">Chia sẻ</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const BadgeScreen = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [shareTitle, setShareTitle] = useState('');
  const [shareContent, setShareContent] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const navigation = useNavigation()
  const { setTabBarVisible } = useContext(TabBarContext);
  const lastScrollY = useRef(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchBadges = async () => {
        try {
          const user = await getUser();
          const response = await getBadgeUserId(user.id)
          setBadges(response.data);
        } catch (error) {
          console.error('Error fetching badges:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBadges();
    }, []));

  const handleShare = (badge) => {
    setSelectedBadge(badge);
    setShareTitle(`Tôi vừa đạt được huy hiệu "${badge.name}"!`);
    // setShareContent(null);
    setModalVisible(true);
  };

  const handleSubmitShare = async () => {
    try {
      const data = {
        badge_id: selectedBadge._id,
        title: shareTitle,
        content: shareContent,
        tags: [],
      };
      await shareBadge(data);
      setModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Chia sẻ thành công',
        text2: 'Huy hiệu của bạn đã được chia sẻ!',
        position: 'top',
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Chia sẻ thất bại',
        text2: error.message,
        position: 'top',
      })
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white  pt-4">
      {/* <TouchableOpacity
        onPress={() => navigation.goBack()}
        className='absolute top-0 left-6'
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity> */}
      <Text className="text-2xl font-bold text-center mb-4">Huy hiệu của bạn</Text>
      <FlatList
        data={badges}
        renderItem={({ item }) => <BadgeCard badge={item} onShare={handleShare} />}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const currentScrollY = e.nativeEvent.contentOffset.y;
          // Hide tab bar only if scrolling down and not at the top
          if (currentScrollY > lastScrollY.current && currentScrollY > 0) {
            setTabBarVisible(false);
          } else {
            setTabBarVisible(true);
          }
          lastScrollY.current = currentScrollY;
        }}
        scrollEventThrottle={16}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-opacity-40">
          <View className="bg-gray-200 p-6 rounded-xl w-11/12 shadow-lg">
            <Text className="text-lg font-bold mb-2">Chia sẻ huy hiệu</Text>
            <TextInput
              className="border border-gray-400 rounded-lg px-3 py-2 mb-3"
              placeholder="Tiêu đề"
              value={shareTitle}
              onChangeText={setShareTitle}
            />
            <TextInput
              className="border border-gray-400 rounded-lg px-3 py-2 mb-3"
              placeholder="Nội dung"
              value={shareContent}
              onChangeText={setShareContent}
              multiline
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                className="mr-3 px-4 py-2 bg-gray-300 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-blue-500 rounded-lg"
                onPress={handleSubmitShare}
              >
                <Text className="text-white">Chia sẻ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BadgeScreen;
