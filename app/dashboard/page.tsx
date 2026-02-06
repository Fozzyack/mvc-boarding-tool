import { getSession } from "@/utils/auth/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }
    return <div className="">Random Dashboard Page</div>;
};
export default DashboardPage;
