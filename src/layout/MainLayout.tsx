import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="container-main py-8 flex-1 ">
                <Outlet />
            </main>

            <footer className="border-t">
                <div className="container-main text-center text-sm py-8">
                    © 2025 My Dev Blog. Built with React + Firebase
                </div>
            </footer>
        </div>
    );
}

export default Layout;
