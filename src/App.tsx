import { useEffect } from "react";
import FirebaseStatus from "@/components/FirebaseStatus";

export default function App() {
    useEffect(() => {
        console.log("Firebase Config:");
        console.log("API Key:", import.meta.env.VITE_FIREBASE_API_KEY);
        console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
    }, []);
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 임시 헤더 */}
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        📝 My Dev Blog
                    </h1>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        블로그 프로젝트 초기 설정 완료!
                    </h2>
                    {/* Firebase 연동 확인 */}
                    <FirebaseStatus />
                </div>
            </main>

            {/* 임시 푸터 */}
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-4xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
                    © 2025 My Dev Blog. Built with React + Firebase
                </div>
            </footer>
        </div>
    );
}
