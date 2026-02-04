import { type SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, getAuthErrorMessage } from "@/lib/auth";

function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(null);

        if (!email.trim()) {
            setError("이메일을 입력해주세요.");
            return;
        }

        if (password.length < 6) {
            setError("비밀번호는 6자 이상이어야 합니다.");
            return;
        }

        if (password !== passwordConfirm) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        setIsLoading(true);

        try {
            // Firebase에 계정 생성
            await signUp(email, password);

            // 메인 페이지로 이동 (Day 1 기능명세서 7번)
            navigate("/");
        } catch (err: unknown) {
            // 에러 처리 (Day 1 기능명세서 예외 흐름)
            if (err && typeof err === "object" && "code" in err) {
                const firebaseError = err as { code: string };
                setError(getAuthErrorMessage(firebaseError.code));
            } else {
                setError("회원가입 중 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <section className="max-w-md w-full space-y-8">
                {/* 헤더 */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        📝 My Dev Blog
                    </h1>
                    <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                        회원가입
                    </h2>
                    <p className="mt-2 text-gray-600">
                        계정을 만들어 블로그를 시작하세요
                    </p>
                </div>

                {/* 회원가입 폼 */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* 에러 메시지 */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4 ">
                        {/* 이메일 입력 */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700  p-2"
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
                                placeholder="6자 이상 입력하세요"
                                required
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-gray-400"
                            />
                        </div>

                        {/* 비밀번호 확인 입력 */}
                        <div>
                            <label
                                htmlFor="passwordConfirm"
                                className="block text-sm font-medium text-gray-700"
                            >
                                비밀번호 확인
                            </label>
                            <input
                                id="passwordConfirm"
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
                                placeholder="비밀번호를 다시 입력하세요"
                                required
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* 가입하기 버튼 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:bg-blue-300 disabled:cursor-not-allowed
                     transition-colors"
                    >
                        {isLoading ? "가입 중..." : "가입하기"}
                    </button>

                    {/* 로그인 링크 */}
                    <p className="text-center text-gray-600">
                        이미 계정이 있으신가요?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            로그인
                        </Link>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default SignUpPage;
