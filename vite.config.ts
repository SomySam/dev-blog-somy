import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        open: true, // open browser
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    "firebase": [
                        "firebase/app",
                        "firebase/auth",
                        "firebase/firestore",
                    ],
                    "react-vendor": ["react", "react-dom", "react-router-dom"],
                    "query": ["@tanstack/react-query"],
                    "ui": [
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-label",
                        "@radix-ui/react-select",
                        "@radix-ui/react-slot",
                    ],
                },
            },
        },
        chunkSizeWarningLimit: 600,
        sourcemap: false,
    },
});
