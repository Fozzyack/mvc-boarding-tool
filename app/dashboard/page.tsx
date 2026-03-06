import AddBoarder from "@/components/AddBoarder";
import BoarderHeaderCard from "@/components/BoarderHeaderCards";
import BoardersTable from "@/components/BoardersTable";
import AddMedicationModal from "@/components/AddMedicationModal";
import { sessionPayload } from "@/types";
import { getSession } from "@/utils/auth/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
    const session = (await getSession()) as sessionPayload;
    if (!session) {
        redirect("/login");
    }
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-brand">Boarding Overview</h2>
                    <p className="text-brand">
                        Welcome back {session.name}. Here is what is happening today.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <AddMedicationModal />
                    <AddBoarder />
                </div>
            </div>
            <BoarderHeaderCard />
            <BoardersTable />
        </div>
    );
};
export default DashboardPage;
