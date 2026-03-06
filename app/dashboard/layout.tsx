import Navbar from "@/components/Navbar";
import { BoardersProvider } from "@/contexts/BoardersContext";
import { sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
    const session = (await getSession()) as sessionPayload;
    if (!session) {
        redirect("/login");
    }
    return (
        <div className="min-h-screen bg-surface md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
            <Navbar isAdmin={session.isAdmin} />
            <div className="min-w-0 p-4 md:p-8 lg:p-10">
                <BoardersProvider>{children}</BoardersProvider>
            </div>
        </div>
    );
};

export default Layout;
