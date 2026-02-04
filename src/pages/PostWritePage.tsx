import { useAuthStore } from "@/store/authStore";

function PostWritePage() {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                새 글 작성
            </h1>

            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 mb-4">
                    ✅ 이 페이지는 로그인한 사용자만 접근할 수 있습니다.
                </p>
                <p className="text-sm text-gray-500">
                    현재 로그인: {user?.email}
                </p>
                <p className="text-sm text-gray-400 mt-4">
                    실제 글쓰기 폼은 Day 6에서 구현합니다.
                </p>
            </div>
        </div>
    );
}

export default PostWritePage;
