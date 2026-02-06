import Link from "next/link";

const NotImplemented = ({ featureName }: { featureName: string }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl opacity-40 scale-150"></div>
                <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl border border-emerald-50 text-emerald-600">
                    <svg
                        className="w-28 h-28"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 14l2 2 4-4"
                            className="text-emerald-400"
                        />
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            strokeDasharray="4 4"
                            className="opacity-30"
                        />
                    </svg>
                    <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-2 rounded-xl shadow-lg rotate-12">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Feature Under Construction
            </div>
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-4 capitalize">
                {featureName} is coming soon!
            </h2>
            <p className="text-emerald-600/70 max-w-lg mb-10 leading-relaxed text-lg">
                We're busy preparing the best possible experience for your
                veterinary practice. Our developers (and office cats) are
                working hard on this section.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/dashboard">
                    <button className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all">
                        Return to Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default NotImplemented;
