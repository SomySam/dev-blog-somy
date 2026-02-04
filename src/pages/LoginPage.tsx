import { type SyntheticEvent, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signIn, getAuthErrorMessage, signInWithGoogle } from "@/lib/auth";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation(); // 추가
    console.log("-----", location);

    // 로그인 전에 가려던 페이지 (없으면 홈으로)
    const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        "/";

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            await signIn(email, password);
            navigate(from, { replace: true }); // 수정: 원래 페이지로 이동
        } catch (err: unknown) {
            if (err && typeof err === "object" && "code" in err) {
                const firebaseError = err as { code: string };
                setError(getAuthErrorMessage(firebaseError.code));
            } else {
                setError("로그인 중 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Google 로그인 핸들러 (팝업 방식)
     */
    const handleGoogleLogin = async () => {
        setError(null);
        setIsLoading(true);

        try {
            await signInWithGoogle();
            navigate(from, { replace: true }); // 수정: 원래 페이지로 이동;
        } catch (err: unknown) {
            if (err && typeof err === "object" && "code" in err) {
                const firebaseError = err as { code: string };
                // 사용자가 팝업을 닫은 경우는 에러 표시 안 함
                if (firebaseError.code !== "auth/popup-closed-by-user") {
                    setError(getAuthErrorMessage(firebaseError.code));
                }
            } else {
                setError("Google 로그인 중 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* 헤더 */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        📝 My Dev Blog
                    </h1>
                    <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                        로그인
                    </h2>
                    <p className="mt-2 text-gray-600">계정에 로그인하세요</p>
                </div>

                {/* 로그인 폼 */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* 에러 메시지 */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* 이메일 입력 */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                이메일
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-gray-400"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                required
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:bg-blue-300 disabled:cursor-not-allowed
                     transition-colors"
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>

                    {/* 구분선 */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">
                                또는
                            </span>
                        </div>
                    </div>

                    {/* Google 로그인 버튼 - 수정됨! */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 
                     font-semibold rounded-lg flex items-center justify-center gap-3
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    >
                        {/* Google 아이콘 */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google로 계속하기
                    </button>

                    {/* 회원가입 링크 */}
                    <p className="text-center text-gray-600">
                        계정이 없으신가요?{" "}
                        <Link
                            to="/signup"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            회원가입
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
