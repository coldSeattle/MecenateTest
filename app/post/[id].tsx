import { useLocalSearchParams } from 'expo-router';
import { PostDetailScreen } from '@pages/post-detail';

export default function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PostDetailScreen postId={id} />;
}
