import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import clsx from 'clsx';
import { getBadgeUserId } from '../../api/badgeApi';
import { getUser } from '../../utils/authStorage';
import { useFocusEffect } from '@react-navigation/native';

const BadgeCard = ({ badge }) => {
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
        {badge.condition}
      </Text>
      <View className={clsx('px-3 py-1 rounded-full', tierColor)}>
        <Text className="text-white text-xs font-semibold">{badge.tier}</Text>
      </View>
    </View>
  );
};

const BadgeScreen = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-center mb-4">Huy hiệu của bạn</Text>
      <FlatList
        data={badges}
        renderItem={({ item }) => <BadgeCard badge={item} />}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default BadgeScreen;
