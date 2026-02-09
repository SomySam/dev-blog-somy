import { Link } from "react-router-dom";
import { logout } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
// 토글 버튼 컴포넌트 임포트
import ThemeToggle from "./ThemeToggle";

function Header() {
    const user = useAuthStore((state) => state.user);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <header className="header">
            <div className="container-main">
                <div className="flex items-center justify-between h-16">
                    {/* 로고 */}
                    <Link to="/" className="text-xl font-bold">
                        📝 My Dev Blog
                    </Link>

                    {/* 네비게이션 & 인증 버튼 */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            // 로그인 상태
                            <>
                                <span className="text-sm text-gray-600">
                                    {user.displayName || user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900
                           transition-colors"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            // 비로그인 상태
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900
                           transition-colors"
                                >
                                    로그인
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 transition-colors"
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                        {/* 테마 토글 */}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
