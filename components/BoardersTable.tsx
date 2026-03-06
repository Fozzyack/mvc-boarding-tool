"use client";

import { Fragment, useMemo, useState } from "react";

import MedicationListInline from "@/components/medications/MedicationListInline";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useBoardersContext } from "@/contexts/BoardersContext";
import { BoarderMedicationSummary } from "@/types";
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
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredBoarders = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        if (!normalizedQuery) {
            return boarders;
        }

        return boarders.filter((boarder) => {
            const searchableContent = [
                boarder.name,
                boarder.animalType,
                boarder.species || "N/A",
                boarder.weight ? `${boarder.weight} kg` : "N/A",
                boarder.ownerName || "N/A",
                boarder.ownerPhone || "N/A",
                ...boarder.medications.map((medication) => medication.name),
                ...boarder.medications.map((medication) => medication.dosage),
                ...boarder.medications.map((medication) => getMedicationStatus(medication).replace("_", " ")),
            ]
                .join(" ")
                .toLowerCase();

            return searchableContent.includes(normalizedQuery);
        });
    }, [boarders, searchQuery]);

    const toggleRow = (boarderId: string) => {
        setExpandedRowId((prev) => (prev === boarderId ? null : boarderId));
    };

    return (
        <div className="space-y-3">
            <div className="w-full md:max-w-sm">
                <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    type="search"
                    placeholder="Search boarders..."
                    aria-label="Search boarders"
                />
            </div>

            <div className="space-y-3 md:hidden">
                {filteredBoarders.length === 0 ? (
                    <div className="ui-card px-4 py-6 text-center text-sm text-text-muted">
                        No boarders match your search.
                    </div>
                ) : null}
                {filteredBoarders.map((boarder) => {
                    const isExpanded = expandedRowId === boarder.id;

                    return (
                        <div key={boarder.id} className="ui-card p-4">
                            <div className="mb-3 flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-base font-semibold text-text">{boarder.name}</p>
                                    <p className="text-xs text-text-muted">
                                        {boarder.animalType} · {boarder.species || "N/A"}
                                    </p>
                                </div>
                                <span className="text-xs text-text-muted">
                                    {boarder.weight ? `${boarder.weight} kg` : "N/A"}
                                </span>
                            </div>

                            <div className="space-y-1 text-sm text-text-muted">
                                <p>Owner: {boarder.ownerName || "N/A"}</p>
                                <p>Phone: {boarder.ownerPhone || "N/A"}</p>
                            </div>

                            <div className="mt-3 rounded-xl bg-surface-muted/60 p-2">
                                <MedicationSummary medications={boarder.medications} />
                            </div>

                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => toggleRow(boarder.id)}
                                className="mt-3 w-full"
                                aria-expanded={isExpanded}
                                aria-controls={`boarder-medications-mobile-${boarder.id}`}
                            >
                                {isExpanded ? "Hide meds" : "View meds"}
                            </Button>

                            {isExpanded ? (
                                <div id={`boarder-medications-mobile-${boarder.id}`} className="mt-3">
                                    <MedicationListInline
                                        boarderId={boarder.id}
                                        medications={boarder.medications}
                                    />
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <div className="relative hidden w-full overflow-x-auto md:block ui-card">
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
                        {filteredBoarders.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-text-muted">
                                    No boarders match your search.
                                </td>
                            </tr>
                        ) : null}
                        {filteredBoarders.map((boarder) => {
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
                                        <td className="px-6 py-2">{boarder.species || "N/A"}</td>
                                        <td className="px-6 py-2">
                                            {boarder.weight ? `${boarder.weight} kg` : "N/A"}
                                        </td>
                                        <td className="px-6 py-2">{boarder.ownerName || "N/A"}</td>
                                        <td className="px-6 py-2">{boarder.ownerPhone || "N/A"}</td>
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
        </div>
    );
};

export default BoardersTable;
