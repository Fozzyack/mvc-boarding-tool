"use client";

import { useState } from "react";

import Link from "next/link";

const LINKS = [
    {
        name: "Features",
        link: "/features",
    },
];

const NavLinks = () => {
    return (
        <>
            {LINKS.map((link, index) => (
                <Link href={link.link} key={index}>
                    {link.name}
                </Link>
            ))}
            <Link
                href="/login"
                className="relative group hover:-translate-y-0.5 transition-all ease-in-out"
            >
                <div className="absolute h-full w-full bg-brand/50 blur-lg opacity-50 transition-all duration-150 ease-in-out group-hover:opacity-70" />
                <button className="ui-button-primary relative z-20 px-4 py-3">
                    Login Portal
                </button>
            </Link>
        </>
    );
};

const LandingNav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <nav className="fixed z-50 w-full border-b border-border/80 bg-white/90 px-4 py-4 backdrop-blur md:px-10">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-text">Bark & Board</h3>
                <div className="hidden items-center justify-end gap-8 md:flex">
                    <NavLinks />
                </div>
                <div className="flex items-center gap-2 md:hidden">
                    <Link href="/login" className="ui-button-secondary px-3 py-2 text-sm">
                        Login
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="rounded-lg border border-border bg-white p-2 text-text"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {isMenuOpen ? (
                <div className="mx-auto mt-3 flex w-full max-w-6xl flex-col gap-2 border-t border-border/70 pt-3 md:hidden">
                    {LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.link}
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-lg px-2 py-2 text-sm font-medium text-text hover:bg-surface-muted"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            ) : null}
        </nav>
    );
};
export default LandingNav;
