import AddBoarder from "@/components/AddBoarder";
import BoarderHeaderCard from "@/components/BoarderHeaderCards";
import BoardersTable from "@/components/BoardersTable";

const BoardersPage = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-emerald-700">Boarders</h2>
                    <p className="text-emerald-700">Here are your boarders</p>
                </div>
                <AddBoarder />
            </div>
            <BoarderHeaderCard />
            <BoardersTable />
        </div>
    );
};

export default BoardersPage;
