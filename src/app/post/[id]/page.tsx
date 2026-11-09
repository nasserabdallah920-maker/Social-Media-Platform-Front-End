import PostCard from "@/features/post/pages/PostCard";
import { serverAxios } from "@/lib/axios/serverAxios";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: Props) {
  const { id } = await params;
  const api = await serverAxios();
  const res = await api.get(`/posts/${id}`);

  const post = res.data.data;
  const commentsRes = await api.get(`/comments/post/${id}`);
  const comments = commentsRes.data.data;
  return <PostCard post={post} comments={comments} />;
}
