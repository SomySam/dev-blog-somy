import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { subscribeToAuthState } from "./lib/auth";

// 레이아웃
import MainLayout from "@/layout/MainLayout";

// 페이지
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import PostWritePage from "./pages/PostWritePage";

// 공통 컴포넌트
import ProtectedRoute from "./components/ProtectedRoute";

import { useAuthStore } from "@/store/authStore";

function App() {
    const { isLoading, setUser, setIsLoading } = useAuthStore();

    useEffect(() => {
        const unsubscribe = subscribeToAuthState((user) => {
            setUser(user);
            setIsLoading(false);
        });

        // 클린업: 컴포넌트 언마운트 시 구독 해제
        return () => unsubscribe();
    }, [setUser, setIsLoading]);

    // 인증 상태 로딩 중
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div
                        className="w-8 h-8 border-4 border-blue-600 border-t-transparent 
                        rounded-full animate-spin mx-auto"
                    ></div>
                    <p className="mt-4 text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* 레이아웃이 적용되는 라우트 */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    {/* 보호된 라우트 - 로그인 필요 */}
                    <Route
                        path="/write"
                        element={
                            <ProtectedRoute>
                                <PostWritePage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* 레이아웃 없이 표시되는 인증 페이지 */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
