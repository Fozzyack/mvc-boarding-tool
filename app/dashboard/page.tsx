import { useBoardersContext } from "@/contexts/BoardersContext";
import { sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
    const session = (await getSession()) as sessionPayload;
    if (!session) {
        redirect("/login");
    }
    return (
        <div className="">
            <h2 className="text-emerald-700">Boarding Overview</h2>
            <p className="text-emerald-700">
                Welcome back {session.name}. Here's what's happening
            </p>
        </div>
    );
};
export default DashboardPage;
