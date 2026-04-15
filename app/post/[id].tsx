import { useLocalSearchParams } from 'expo-router';
import { PostDetailScreen } from '@/screens/PostDetailScreen';

export default function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PostDetailScreen postId={id} />;
}
