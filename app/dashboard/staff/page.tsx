import StaffManagement from "@/components/staff/StaffManagement";
import type { sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";
import { redirect } from "next/navigation";

const StaffPage = async () => {
    const session = (await getSession()) as sessionPayload;
    if (!session) {
        redirect("/login");
    }

    if (!session.isAdmin) {
        redirect("/dashboard");
    }

    return <StaffManagement currentUserId={session.userId} />;
};

export default StaffPage;
