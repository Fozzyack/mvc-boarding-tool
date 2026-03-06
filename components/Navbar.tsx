"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
    {
        name: "Dashboard",
        link: "",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
            </svg>
        ),
    },
    {
        name: "Medications",
        link: "/medications",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6m3-9h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"
                />
            </svg>
        ),
    },
    {
        name: "Calendar",
        link: "/calendar",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                />
            </svg>
        ),
    },
];
const ADMIN_LINKS = [
    {
        name: "Staff",
        link: "/staff",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
            </svg>
        ),
    },
];

const NavLinks = ({
    isAdmin,
    onNavigate,
}: {
    isAdmin: boolean;
    onNavigate?: () => void;
}) => {
    const pathname = usePathname();

    const getDashboardHref = (link: string): string => {
        const normalizedLink = link.replace(/^\/+/, "");
        if (!normalizedLink) {
            return "/dashboard";
        }

        return `/dashboard/${normalizedLink}`;
    };

    return (
        <div className="flex flex-col space-y-1 w-full">
            {LINKS.map((link) => (
                <Link
                    href={getDashboardHref(link.link)}
                    key={link.name}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        pathname === getDashboardHref(link.link)
                            ? "bg-brand/10 text-brand"
                            : "text-text-muted hover:bg-surface-muted"
                    }`}
                >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                </Link>
            ))}
            {isAdmin &&
                ADMIN_LINKS.map((link) => (
                    <Link
                        href={getDashboardHref(link.link)}
                        key={link.name}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            pathname === getDashboardHref(link.link)
                                ? "bg-brand/10 text-brand"
                                : "text-text-muted hover:bg-surface-muted"
                        }`}
                    >
                        {link.icon}
                        <span className="font-medium">{link.name}</span>
                    </Link>
                ))}
        </div>
    );
};

const Navbar = ({ isAdmin }: { isAdmin: boolean }) => {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await fetch("/api/logout", { method: "POST" });
        setIsMobileMenuOpen(false);
        router.push("/");
    };

    return (
        <>
            <div className="sticky top-0 z-20 border-b border-border bg-white/95 px-4 py-3 backdrop-blur md:hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-brand">Bark & Board</h3>
                        <p className="text-xs text-text-muted">Clinic Dashboard</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="rounded-lg border border-border bg-white p-2 text-text transition-colors hover:border-brand/30 hover:text-brand"
                        aria-label="Open menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </div>

            <nav className="hidden h-screen w-64 flex-col border-r border-border bg-white py-6 md:sticky md:top-0 md:flex">
                <div className="border-b border-border px-6 pb-6">
                    <h3 className="text-xl font-bold text-brand">Bark & Board</h3>
                    <p className="mt-1 text-sm text-text-muted">Clinic Dashboard</p>
                </div>

                <div className="flex-1 px-3 py-6">
                    <NavLinks isAdmin={isAdmin} />
                </div>

                <div className="border-t border-border px-3 pb-6">
                    <button
                        onClick={handleLogout}
                        className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                            />
                        </svg>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </nav>

            {isMobileMenuOpen ? (
                <div className="fixed inset-0 z-40 md:hidden">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute inset-0 bg-slate-900/40"
                        aria-label="Close menu"
                    />
                    <div className="absolute right-0 top-0 h-full w-72 max-w-[86vw] border-l border-border bg-white p-4 shadow-xl">
                        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                            <h4 className="font-semibold text-brand">Navigation</h4>
                            <button
                                type="button"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close menu"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex h-[calc(100%-4rem)] flex-col justify-between">
                            <NavLinks isAdmin={isAdmin} onNavigate={() => setIsMobileMenuOpen(false)} />
                            <button
                                onClick={handleLogout}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 font-medium text-red-700 transition-colors hover:bg-red-100"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Navbar;
