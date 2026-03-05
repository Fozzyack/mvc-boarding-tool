import LandingFeatureCards from "@/components/LandingFeatureCards";
import LandingNav from "@/components/LandingNav";
import { getSession } from "@/utils/auth/auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const QUICK_STATS = [
    {
        label: "Pets boarded",
        value: "12,400+",
    },
    {
        label: "Daily check-ins",
        value: "180",
    },
    {
        label: "Medication accuracy",
        value: "99.8%",
    },
    {
        label: "Avg handoff time",
        value: "< 4 min",
    },
];

export default async function Home() {
    const session = await getSession();
    if (session) {
        redirect("/dashboard");
    }
    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-white via-emerald-50/40 to-white text-slate-800">
            <LandingNav />
            <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden px-6 pb-12 pt-28 md:px-10 md:pb-16 md:pt-32">
                <div className="pointer-events-none absolute -left-20 top-24 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
                <div className="pointer-events-none absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
                <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-12">
                    <div className="col-span-7 flex flex-col items-center justify-center gap-5 text-center md:items-start md:text-left">
                        <div className="inline-flex items-center justify-center gap-3 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent">
                            <div className="h-2 w-2 rounded-full bg-accent" />
                            <p>Built for Morley Vet Center</p>
                        </div>
                        <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                            Management that{" "}
                            <span className="bg-gradient-to-r from-emerald-600 to-accent bg-clip-text font-extrabold text-transparent">
                                cares
                            </span>{" "}
                            as much as you do.
                        </h1>
                        <p className="max-w-xl text-base text-slate-600 md:text-lg">
                            <span className="font-bold text-slate-700">
                                Elite boarding technology for total professional confidence.
                            </span>{" "}
                            The complete operating system for modern veterinary boarding facilities.
                        </p>
                        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-stretch">
                            <Link
                                href="/login"
                                className="group relative inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-accent px-5 py-3 text-center font-bold text-white shadow-lg shadow-accent/25 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30"
                            >
                                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent to-emerald-500/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                <span className="relative z-10">Launch Clinic Portal</span>
                            </Link>
                            <Link
                                href="/features"
                                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white/80 px-5 py-3 text-center font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/5 hover:text-accent"
                            >
                                Explore Features
                            </Link>
                        </div>
                    </div>
                    <div className="col-span-5 mx-auto w-full max-w-md">
                        <div className="relative">
                            <div className="absolute inset-0 scale-95 rounded-[2.5rem] bg-gradient-to-br from-accent/20 to-emerald-300/25 blur-2xl" />
                            <Image
                                src="/assets/LandingPageImageOriginal.jpg"
                                alt="Happy boarding dog"
                                width={640}
                                height={800}
                                className="relative z-10 aspect-[4/5] w-full rounded-[2.5rem] border border-emerald-100 object-cover shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="mx-auto w-full max-w-6xl px-6 pb-14 pt-2 md:px-10 md:pb-16 md:pt-4">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    {QUICK_STATS.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-emerald-100/80 bg-white/90 px-4 py-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-md"
                        >
                            <p className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:text-sm">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-3 px-6 pt-2 pb-20 md:px-10 md:pt-4">
                <p className="w-full text-center text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                    The Ecosystem
                </p>
                <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-700 md:text-4xl">
                    Everything your team needs
                </h2>
                <p className="max-w-2xl text-center text-slate-500">
                    Designed to support safer care, cleaner handoffs, and smoother operations from intake to pickup.
                </p>
                <LandingFeatureCards />
            </section>
        </div>
    );
}
