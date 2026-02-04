// src/pages/HomePage.tsx

/**
 * 홈 페이지 (게시글 목록)
 *
 * Day 1 요구사항: UX-001 (비로그인 사용자도 게시글 목록 조회 가능)
 * Day 1 사용자 스토리: US-004 (게시글 목록 보기)
 */

function HomePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    최신 게시글
                </h1>
            </div>

            {/* 게시글 목록 (Day 6에서 구현) */}
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">아직 게시글이 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">
                    게시글 CRUD는 Day 6에서 구현합니다.
                </p>
            </div>
        </div>
    );
}

export default HomePage;
