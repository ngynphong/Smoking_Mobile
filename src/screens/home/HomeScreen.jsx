import { ScrollView } from 'react-native';
import HeaderGreeting from '../../components/home/HeaderGreeting';
import ProgressSummary from '../../components/home/ProgressSummary';
import MotivationalQuote from '../../components/home/MotivationalQuote';
import RankingPreview from '../../components/home/RankingPreview';
import BlogPreviewList from '../../components/home/BlogPreviewList';
import FloatingActionButton from '../../components/home/FloatingActionButton';
import HeroBanner from '../../components/home/HeroBanner';
import ServiceHighlights from '../../components/home/ServiceHighlights';

const user = {
  name: 'Phong',
  avatar_url: 'https://example.com/avatar.jpg',
};
const progressSummary = {
  days: 3,
  moneySaved: 90000,
  healthImproved: 5,
};
export default function HomeScreen() {
  return (
    <ScrollView className="bg-white px-4 pt-6">
      <HeaderGreeting name={user.name} avatar_url={user.avatar_url} />
      <HeroBanner/>
      <ProgressSummary {...progressSummary} />
      <MotivationalQuote quote="Mỗi ngày không hút là một chiến thắng." />
      <ServiceHighlights/>
      <RankingPreview />
      <BlogPreviewList />
      <FloatingActionButton />
    </ScrollView>
  );
}
