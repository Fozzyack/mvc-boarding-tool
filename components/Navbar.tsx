"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PawPrint from "./icons/paw";

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
    {
        name: "Boarders",
        link: "/boarders",
        icon: <PawPrint />,
    },
];

const NavLinks = () => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col space-y-1 w-full">
            {LINKS.map((link) => (
                <Link
                    href={`/dashboard/${link.link}`}
                    key={link.name}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        pathname === `/dashboard/${link.link}` ||
                        pathname.startsWith(link.link + "/")
                            ? "bg-emerald-100 text-emerald-700"
                            : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                </Link>
            ))}
        </div>
    );
};

const Navbar = () => {
    return (
        <nav className="py-6 bg-white h-screen w-64 flex flex-col border-r border-slate-200">
            <div className="px-6 pb-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-emerald-700">
                    Bark & Board
                </h3>
                <p className="text-sm text-slate-500 mt-1">Clinic Dashboard</p>
            </div>

            <div className="flex-1 py-6 px-3">
                <NavLinks />
            </div>

            <div className="px-3 pb-6 border-t border-slate-200">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50"></div>
                <form action="/api/logout" method="POST">
                    <button
                        type="submit"
                        className="mt-3 w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                </form>
            </div>
        </nav>
    );
};

export default Navbar;
