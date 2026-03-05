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
                <div className="absolute w-full bg-accent h-full blur-lg opacity-50 group-hover:opacity-70 transition-all ease-in-out duration-150" />
                <button className="relative z-20 bg-accent text-white font-bold px-4 py-3 rounded-2xl hover:cursor-pointer">
                    Login Portal
                </button>
            </Link>
        </>
    );
};

const LandingNav = () => {
    return (
        <nav className="fixed z-50 w-full border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur md:px-10">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-slate-800">Bark & Board</h3>
                <div className="hidden md:flex gap-8 items-center justify-end">
                    <NavLinks />
                </div>
            </div>
        </nav>
    );
};
export default LandingNav;
