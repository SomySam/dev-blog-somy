// src/hooks/mutations/useCreatePost.ts

/**
 * 게시글 작성 뮤테이션
 *
 * Day 1 요구사항: POST-001
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/lib/posts";
import { queryKeys } from "@/hooks/queries/keys";
import type { PostInput, User } from "@/types";
import { toast } from "sonner"; // UI 추가
interface CreatePostVariables {
    input: PostInput;
    user: User;
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        // 뮤테이션 함수
        mutationFn: ({ input, user }: CreatePostVariables) =>
            createPost(input, user),

        // 성공 시 게시글 목록 캐시 무효화
        onSuccess: () => {
            toast.success("새 글이 등록되었습니다"); //Toast 실행 위치
            queryClient.invalidateQueries({
                queryKey: queryKeys.posts.lists(),
            });
        },
        onError: () => {
            toast.error("글 등록에 실패했습니다"); //Toast 실행 위치
        },
    });
}
