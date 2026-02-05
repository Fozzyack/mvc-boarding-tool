import LandingFeatureCards from "@/components/LandingFeatureCards";
import LandingNav from "@/components/LandingNav";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen w-full bg-slate-50">
            <LandingNav />
            <div className="h-screen py-20 px-10 flex flex-col md:grid md:grid-cols-12 justify-center items-start gap-8">
                <div className="col-span-7 flex flex-col items-start justify-center gap-4 h-full">
                    <div className="bg-accent/10 border text-accent border-accent/30 flex items-center justify-center px-4 py-2 rounded-full text-xs gap-4 font-semibold">
                        <div className="rounded-full p-1 bg-accent"></div>
                        <p>Built for Morely Vet Center</p>
                    </div>
                    <h1>
                        Management that{" "}
                        <span className="bg-linear-to-r text-transparent font-extrabold from-emerald-600 to-accent bg-clip-text">
                            cares
                        </span>{" "}
                        as much as you do.
                    </h1>
                    <p>
                        <span className="font-bold text-slate-600">
                            Elite boarding technology for total professional
                            confidence.
                        </span>{" "}
                        The complete operating system for modern veterinary
                        boarding facilities.
                    </p>
                    <Link
                        href="/login"
                        className="relative group hover:-translate-y-0.5 transition-all ease-in-out w-full"
                    >
                        <div className="absolute w-full bg-accent h-full blur-lg opacity-50 group-hover:opacity-70 transition-all ease-in-out duration-150" />
                        <button className="relative z-20 bg-accent w-full text-white font-bold px-4 py-3 rounded-2xl hover:cursor-pointer">
                            Launch Clinic Portal
                        </button>
                    </Link>
                </div>
            </div>
            <div className="w-full flex-col items-center justify-center gap-10">
                <p className="text-emerald-500 w-full text-center text-lg uppercase font-semibold">
                    The Ecosystem
                </p>
                <h2 className="text-slate-600 uppercase text-center">
                    Features
                </h2>
                <LandingFeatureCards />
            </div>
        </div>
    );
}
