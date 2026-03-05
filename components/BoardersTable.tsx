"use client";

import { useBoardersContext } from "@/contexts/BoardersContext";
import AddMedicationModal from "./AddMedicationModal";

const BoardersTable = () => {
    const { boarders } = useBoardersContext();
    return (
        <div className="ui-card relative w-full overflow-x-auto">
            <table className="text-sm w-full table-auto">
                <thead className="rounded-base border-b border-border bg-surface-muted text-sm text-text">
                    <tr>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Animal
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Species
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Weight
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Owner
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Owner Number
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Medication
                        </th>
                        <th scope="col" className="px-6 py-3 font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {boarders.map((boarder) => (
                        <tr
                            key={boarder.id}
                            className="border-b border-border text-center"
                        >
                            <th
                                scope="row"
                                className="whitespace-nowrap border-r border-border px-6 py-4 font-semibold"
                            >
                                {boarder.name}
                            </th>
                            <td className="px-6 py-2">{boarder.animalType}</td>
                            <td className="px-6 py-2">
                                {boarder.species || "N/A"}
                            </td>
                            <td className="px-6 py-2">
                                {boarder.weight
                                    ? `${boarder.weight} kg`
                                    : "N/A"}
                            </td>
                            <td className="px-6 py-2">
                                {boarder.ownerName || "N/A"}
                            </td>
                            <td className="px-6 py-2">
                                {boarder.ownerPhone || "N/A"}
                            </td>
                            <td className="px-6 py-2">
                                <AddMedicationModal boarderId={boarder.id} />
                            </td>
                            <td className="px-6 py-2">
                                {boarder.ownerPhone || "N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BoardersTable;
