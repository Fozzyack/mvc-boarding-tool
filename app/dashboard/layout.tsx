import Navbar from "@/components/Navbar";
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
        <div className="grid grid-cols-12">
            <div className="col-span-2">
                <Navbar isAdmin={session.isAdmin} />
            </div>
            <div className="col-span-10 p-10">{children}</div>
        </div>
    );
};

export default Layout;
