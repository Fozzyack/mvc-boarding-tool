"use client";

import MedicationStatusBadge from "@/components/medications/MedicationStatusBadge";
import MedicationActionConfirmModal from "@/components/medications/MedicationActionConfirmModal";
import Button from "@/components/ui/Button";
import { useBoardersContext } from "@/contexts/BoardersContext";
import type { MedicationLogAction } from "@/types";
import getBackendUrl from "@/utils/getBackendUrl";
import type { MedicationStatus } from "@/utils/medications/getMedicationStatus";
import getMedicationStatus from "@/utils/medications/getMedicationStatus";
import getMedicationTimingLabel from "@/utils/medications/getMedicationTimingLabel";
import { useMemo, useState } from "react";

interface PendingMedicationAction {
    medicationId: string;
    medicationName: string;
    actionType: MedicationLogAction;
}

const FILTER_OPTIONS: Array<{ label: string; value: MedicationStatus | "all" }> = [
    { label: "All", value: "all" },
    { label: "Due now", value: "due_now" },
    { label: "Due soon", value: "due_soon" },
    { label: "Overdue", value: "overdue" },
    { label: "Completed", value: "completed" },
    { label: "Skipped", value: "skipped" },
    { label: "Missed", value: "missed" },
];

const MedicationsPage = () => {
    const { boarders, refreshBoarders } = useBoardersContext();
    const [activeFilter, setActiveFilter] = useState<MedicationStatus | "all">("due_now");
    const [updatingMedicationId, setUpdatingMedicationId] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingMedicationAction | null>(null);

    const handleMedicationAction = async (
        medicationId: string,
        actionType: MedicationLogAction,
    ) => {
        setUpdatingMedicationId(medicationId);
        try {
            const response = await fetch(
                `${getBackendUrl()}/api/medications/${medicationId}/administer`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ actionType }),
                },
            );

            if (!response.ok) {
                console.error("Failed to mark medication as given");
                return;
            }

            refreshBoarders();
        } catch (error) {
            console.error(error);
        } finally {
            setUpdatingMedicationId(null);
        }
    };

    const queue = useMemo(() => {
        const flattened = boarders.flatMap((boarder) =>
            boarder.medications.map((medication) => ({
                boarderId: boarder.id,
                boarderName: boarder.name,
                ownerName: boarder.ownerName,
                medication,
                status: getMedicationStatus(medication),
            })),
        );

        const filtered =
            activeFilter === "all"
                ? flattened
                : flattened.filter((item) => item.status === activeFilter);

        return filtered.sort((left, right) => {
            const order: Record<MedicationStatus, number> = {
                due_now: 1,
                overdue: 2,
                due_soon: 3,
                missed: 4,
                skipped: 5,
                completed: 6,
                scheduled: 7,
            };

            return order[left.status] - order[right.status];
        });
    }, [activeFilter, boarders]);

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-brand">Medication Queue</h2>
                <p className="text-text-muted">Shift-wide view of medication tasks across all boarders.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((filterOption) => {
                    const isActive = activeFilter === filterOption.value;
                    return (
                        <button
                            key={filterOption.value}
                            type="button"
                            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                                isActive
                                    ? "border-brand/30 bg-brand/10 text-brand"
                                    : "border-border bg-white text-text-muted hover:border-brand/20 hover:text-brand"
                            }`}
                            onClick={() => setActiveFilter(filterOption.value)}
                        >
                            {filterOption.label}
                        </button>
                    );
                })}
            </div>

            <div className="ui-card overflow-hidden">
                <table className="w-full table-auto text-sm">
                    <thead className="border-b border-border bg-surface-muted text-text">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Animal</th>
                            <th className="px-4 py-3 text-left font-medium">Medication</th>
                            <th className="px-4 py-3 text-left font-medium">Timing</th>
                            <th className="px-4 py-3 text-left font-medium">Owner</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queue.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                                    No medication tasks match this filter.
                                </td>
                            </tr>
                        ) : (
                            queue.map((item) => {
                                const canMarkGiven =
                                    item.status === "due_now" ||
                                    item.status === "due_soon" ||
                                    item.status === "overdue" ||
                                    item.status === "scheduled";

                                return (
                                    <tr key={`${item.boarderId}-${item.medication.id}`} className="border-b border-border">
                                        <td className="px-4 py-3 font-medium text-text">{item.boarderName}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-text">{item.medication.name}</p>
                                            <p className="text-xs text-text-muted">{item.medication.dosage}</p>
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">
                                            {getMedicationTimingLabel(item.medication)}
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">
                                            {item.ownerName || "N/A"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <MedicationStatusBadge status={item.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        setPendingAction({
                                                            medicationId: item.medication.id,
                                                            medicationName: item.medication.name,
                                                            actionType: "administered",
                                                        })
                                                    }
                                                    disabled={
                                                        !canMarkGiven || updatingMedicationId === item.medication.id
                                                    }
                                                >
                                                    {updatingMedicationId === item.medication.id
                                                        ? "Saving..."
                                                        : "Mark given"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        setPendingAction({
                                                            medicationId: item.medication.id,
                                                            medicationName: item.medication.name,
                                                            actionType: "skipped",
                                                        })
                                                    }
                                                    disabled={
                                                        !canMarkGiven || updatingMedicationId === item.medication.id
                                                    }
                                                >
                                                    Skip
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setPendingAction({
                                                            medicationId: item.medication.id,
                                                            medicationName: item.medication.name,
                                                            actionType: "missed",
                                                        })
                                                    }
                                                    disabled={
                                                        !canMarkGiven || updatingMedicationId === item.medication.id
                                                    }
                                                >
                                                    Missed
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {pendingAction ? (
                <MedicationActionConfirmModal
                    actionType={pendingAction.actionType}
                    medicationName={pendingAction.medicationName}
                    isLoading={updatingMedicationId === pendingAction.medicationId}
                    onCancel={() => setPendingAction(null)}
                    onConfirm={async () => {
                        await handleMedicationAction(
                            pendingAction.medicationId,
                            pendingAction.actionType,
                        );
                        setPendingAction(null);
                    }}
                />
            ) : null}
        </div>
    );
};

export default MedicationsPage;
