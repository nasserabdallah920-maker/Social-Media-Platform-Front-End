import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Post } from "../interfaces/postInterfaces";
import { postsService } from "../services/postServices";

export const usePosts = () => {
  const queryClient = useQueryClient();

  // جلب المنشورات
  const {
    data: posts,
    isPending: postsPending,
    isError: postHaveError,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryFn: ({ pageParam }) => postsService.getPosts({ page: pageParam }),
    queryKey: ["posts"],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  // إنشاء منشور
  const createPost = useMutation({
    mutationFn: (data: { text: string; post_files?: File[] }) =>
      postsService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // التعليقات
  const makeComment = useMutation({
    mutationFn: (data: { post_id: number; data: FormData }) =>
      postsService.makeComment(data),
  });

  const editComment = useMutation({
    mutationFn: (data: { comment_id: number; text: string }) =>
      postsService.editComment(data),
  });

  const removeComment = useMutation({
    mutationFn: (comment_id: number) => postsService.removeComment(comment_id),
  });

  // الإعجابات (مع الـ Optimistic Update)
  const likeMutation = useMutation({
    mutationFn: (post_id: number) => postsService.toggleLike(post_id),

    onMutate: async (post_id) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldPosts:any) => ({
        ...oldPosts,
        pages: oldPosts?.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: Post) =>
            post.id === post_id
              ? {
                  ...post,
                  is_liked: !post.is_liked,
                  likes_count: post.likes_count + (post.is_liked ? -1 : 1),
                }
              : post,
          ),
        })),
      }));

      return { previousPosts };
    },

    onError: (_error, _post_id, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
  });

  return {
    posts,
    postHaveError,
    postsPending,
    toggleLove: likeMutation.mutate,
    createPost: createPost.mutate,
    isCreatingPost: createPost.isPending,
    createComment: makeComment.mutate,
    updateComment: editComment.mutate,
    deleteComment: removeComment.mutate,
    isUpdatingComment: editComment.isPending,
    isDeletingComment: removeComment.isPending,
    comment: makeComment.data?.data, // تم تعديلها لتتوافق مع هيكلة الـ Service العائدة
    fetchNextPage,
    hasNextPage,
    isFetching,
  };
};