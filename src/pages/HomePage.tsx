import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import PostList from "@/components/PostList";

import type { Category } from "@/types";
import { CATEGORY_LABELS } from "@/types";

//----- 무한 스크롤 관련 쿼리 추가
import { useInfinitePosts } from "@/hooks/queries";

function HomePage() {
    const user = useAuthStore((state) => state.user);

    // 카테고리 필터 상태 (Day 1 POST-006)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    );

    // 무한 스크롤 쿼리
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfinitePosts({
        category: selectedCategory,
        pageSize: 5,
    });

    // 모든 페이지의 게시글을 하나의 배열로 합치기
    const posts = data?.pages.flatMap((page) => page.posts) ?? [];

    // 무한 스크롤을 위한 Intersection Observer
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage],
    );

    useEffect(() => {
        const element = loadMoreRef.current;
        if (!element) return;

        observerRef.current = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
        });

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver]);

    // 카테고리 목록
    const categories: Category[] = [
        "javascript",
        "typescript",
        "react",
        "firebase",
        "etc",
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    최신 게시글
                </h1>
                {/* 로그인 시 글쓰기 버튼 */}
                {user && (
                    <Link
                        to="/write"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium
                     rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        글쓰기
                    </Link>
                )}
            </div>

            {/* 카테고리 필터 (Day 1 POST-006) */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${
                selectedCategory === null
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
                >
                    전체
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${
                  selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
                    >
                        {CATEGORY_LABELS[cat]}
                    </button>
                ))}
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                        {error.message} <br /> 게시글을 불러오는데 실패했습니다.
                    </p>
                </div>
            )}

            {/* 게시글 목록 */}
            <PostList posts={posts} isLoading={isLoading} />

            {/* 무한 스크롤 트리거 */}
            <div
                ref={loadMoreRef}
                className="h-10 flex items-center justify-center"
            >
                {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-gray-500">
                        <div
                            className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 
                          rounded-full animate-spin"
                        ></div>
                        <span className="text-sm">불러오는 중...</span>
                    </div>
                )}
                {!hasNextPage && posts.length > 0 && (
                    <p className="text-sm text-gray-400">
                        모든 게시글을 불러왔습니다
                    </p>
                )}
            </div>
        </div>
    );
}

export default HomePage;
