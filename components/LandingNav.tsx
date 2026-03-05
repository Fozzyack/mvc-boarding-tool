"use client";
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
    return (
        <nav className="fixed z-50 w-full border-b border-border/80 bg-white/90 px-6 py-4 backdrop-blur md:px-10">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-text">Bark & Board</h3>
                <div className="hidden md:flex gap-8 items-center justify-end">
                    <NavLinks />
                </div>
            </div>
        </nav>
    );
};
export default LandingNav;
