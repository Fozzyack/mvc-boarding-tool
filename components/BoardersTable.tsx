"use client";

import { useBoardersContext } from "@/contexts/BoardersContext";

const BoardersTable = () => {
    const { boarders } = useBoardersContext();
    return (
        <div className="relative bg-white overflow-x-auto shadow-sm rounded-2xl border border-slate-300 w-full">
            <table className="text-sm w-full table-auto">
                <thead className="text-sm text-body bg-slate-200 border-b border-slate-200 rounded-2xl rounded-base">
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
                    </tr>
                </thead>
                <tbody>
                    {boarders.map((boarder) => (
                        <tr
                            key={boarder.id}
                            className="text-center border-b border-slate-200"
                        >
                            <th
                                scope="row"
                                className="px-6 py-4 whitespace-nowrap font-semibold border-r border-slate-200"
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BoardersTable;
