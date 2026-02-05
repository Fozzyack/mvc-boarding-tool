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
        <nav className="fixed w-full py-4 px-8 border-b border-slate-300 bg-white ">
            <div className="flex w-full items-center justify-between flex-wrap">
                <h3 className="font-semibold"> Bark & Board </h3>
                <div className="hidden md:flex gap-8 items-center justify-end">
                    <NavLinks />
                </div>
            </div>
        </nav>
    );
};
export default LandingNav;
