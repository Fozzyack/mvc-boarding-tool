"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white p-8 rounded-full shadow-xl border border-emerald-50 text-emerald-600 animate-bounce transition-all duration-1000">
                    <svg
                        className="w-24 h-24"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 14c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1z"
                        />
                    </svg>
                </div>
            </div>

            <h1 className="text-6xl font-black text-emerald-900 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                Whoops! This page took a walk.
            </h2>
            <p className="text-emerald-600/70 max-w-md mb-8 leading-relaxed">
                The page you're looking for seems to have wandered off the
                leash. Let's get you back to the main lobby where the treats
                are!
            </p>

            <Link href="/">
                <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all flex items-center space-x-3">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    <span>Back to Safety</span>
                </button>
            </Link>

            <div className="mt-12 flex space-x-2">
                <div className="w-2 h-2 bg-emerald-200 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
        </div>
    );
}
