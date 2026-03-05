"use client";

import { Fragment, useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { useBoardersContext } from "@/contexts/BoardersContext";
import { BoarderMedicationSummary } from "@/types";
import MedicationListInline from "@/components/medications/MedicationListInline";
import getMedicationStatus from "@/utils/medications/getMedicationStatus";

const MedicationSummary = ({ medications }: { medications: BoarderMedicationSummary[] }) => {
    const summary = useMemo(() => {
        return medications.reduce(
            (acc, medication) => {
                const status = getMedicationStatus(medication);
                acc.total += 1;
                if (status === "due_now") {
                    acc.dueNow += 1;
                }
                if (status === "due_soon") {
                    acc.dueSoon += 1;
                }
                if (status === "overdue") {
                    acc.overdue += 1;
                }
                return acc;
            },
            { total: 0, dueNow: 0, dueSoon: 0, overdue: 0 },
        );
    }, [medications]);

    if (summary.total === 0) {
        return <span className="text-xs text-text-muted">No meds</span>;
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {summary.total} meds
            </span>
            {summary.dueNow > 0 ? (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    {summary.dueNow} due now
                </span>
            ) : null}
            {summary.dueSoon > 0 ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    {summary.dueSoon} due soon
                </span>
            ) : null}
            {summary.overdue > 0 ? (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                    {summary.overdue} overdue
                </span>
            ) : null}
        </div>
    );
};

const BoardersTable = () => {
    const { boarders } = useBoardersContext();
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

    const toggleRow = (boarderId: string) => {
        setExpandedRowId((prev) => (prev === boarderId ? null : boarderId));
    };

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
                    {boarders.map((boarder) => {
                        const isExpanded = expandedRowId === boarder.id;
                        return (
                            <Fragment key={boarder.id}>
                                <tr className="border-b border-border text-center">
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
                                        {boarder.weight ? `${boarder.weight} kg` : "N/A"}
                                    </td>
                                    <td className="px-6 py-2">
                                        {boarder.ownerName || "N/A"}
                                    </td>
                                    <td className="px-6 py-2">
                                        {boarder.ownerPhone || "N/A"}
                                    </td>
                                    <td className="px-6 py-2">
                                        <MedicationSummary medications={boarder.medications} />
                                    </td>
                                    <td className="px-6 py-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => toggleRow(boarder.id)}
                                            className="min-w-28"
                                            aria-expanded={isExpanded}
                                            aria-controls={`boarder-medications-${boarder.id}`}
                                        >
                                            {isExpanded ? "Hide meds" : "View meds"}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className={`size-4 transition-transform duration-300 ${
                                                    isExpanded ? "rotate-180" : "rotate-0"
                                                }`}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                                />
                                            </svg>
                                        </Button>
                                    </td>
                                </tr>
                                {isExpanded ? (
                                    <tr
                                        id={`boarder-medications-${boarder.id}`}
                                        className="border-b border-border"
                                    >
                                        <td colSpan={8} className="px-6 py-0">
                                            <div className="grid grid-rows-[1fr] overflow-hidden opacity-100 transition-[grid-template-rows,opacity] duration-[400ms] ease-out">
                                                <div className="overflow-hidden">
                                                    <div className="px-1 pb-5 pt-3">
                                                        <MedicationListInline
                                                            boarderId={boarder.id}
                                                            medications={boarder.medications}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : null}
                            </Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BoardersTable;
