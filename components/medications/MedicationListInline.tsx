"use client";

import AddMedicationModal from "@/components/AddMedicationModal";
import MedicationActionConfirmModal from "@/components/medications/MedicationActionConfirmModal";
import MedicationStatusBadge from "@/components/medications/MedicationStatusBadge";
import Button from "@/components/ui/Button";
import { useBoardersContext } from "@/contexts/BoardersContext";
import { BoarderMedicationSummary, MedicationLogAction } from "@/types";
import getBackendUrl from "@/utils/getBackendUrl";
import getMedicationScheduleLabel from "@/utils/medications/getMedicationScheduleLabel";
import getMedicationStatus, {
    type MedicationStatus,
} from "@/utils/medications/getMedicationStatus";
import getMedicationTimingLabel from "@/utils/medications/getMedicationTimingLabel";
import { useState } from "react";

const STATUS_CARD_STYLE: Record<MedicationStatus, string> = {
    due_now: "border-red-200 bg-gradient-to-r from-red-50 to-white",
    due_soon: "border-amber-200 bg-gradient-to-r from-amber-50 to-white",
    scheduled:
        "border-sky-300 border-dashed bg-gradient-to-r from-sky-50 via-cyan-50 to-white shadow-[inset_0_0_0_1px_rgba(14,165,233,0.1)]",
    overdue: "border-rose-200 bg-gradient-to-r from-rose-50 to-white",
    completed: "border-emerald-200 bg-gradient-to-r from-emerald-50 to-white",
    skipped: "border-orange-200 bg-gradient-to-r from-orange-50 to-white",
    missed: "border-fuchsia-200 bg-gradient-to-r from-fuchsia-50 to-white",
};

const formatLastGiven = (value: string | null): string => {
    if (!value) {
        return "Not yet administered";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return "Not yet administered";
    }

    return parsed.toLocaleString();
};

interface MedicationListInlineProps {
    boarderId: string;
    medications: BoarderMedicationSummary[];
}

interface PendingMedicationAction {
    medicationId: string;
    medicationName: string;
    actionType: MedicationLogAction;
}

const MedicationListInline = ({
    boarderId,
    medications,
}: MedicationListInlineProps) => {
    const { refreshBoarders } = useBoardersContext();
    const [updatingMedicationId, setUpdatingMedicationId] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingMedicationAction | null>(null);

    const handleMedicationAction = async (
        medicationId: string,
        actionType: "administered" | "skipped" | "missed",
    ): Promise<boolean> => {
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
                console.error("Failed to update medication status");
                return false;
            }

            refreshBoarders();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setUpdatingMedicationId(null);
        }
    };

    if (medications.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-4 text-center">
                <p className="mb-3 text-sm text-text-muted">No active medications for this boarder</p>
                <AddMedicationModal boarderId={boarderId} />
            </div>
        );
    }

    return (
        <div className="space-y-3 text-left">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-white/80 px-4 py-2">
                <p className="text-sm font-semibold text-text">Medication Plan</p>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
                    {medications.length} active
                </span>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {medications.map((medication) => {
                    const status = getMedicationStatus(medication);
                    return (
                        <div
                            key={medication.id}
                            className={`rounded-2xl border px-4 py-3 shadow-sm ${STATUS_CARD_STYLE[status]}`}
                        >
                            <div className="mb-2 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-base font-semibold text-text">{medication.name}</p>
                                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                        {medication.dosage}
                                    </p>
                                </div>
                                <MedicationStatusBadge status={status} />
                            </div>
                            <div className="mb-2 flex flex-wrap gap-1.5">
                                <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs text-slate-700 ring-1 ring-slate-200">
                                    {getMedicationScheduleLabel(medication)}
                                </span>
                                <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs text-slate-700 ring-1 ring-slate-200">
                                    {getMedicationTimingLabel(medication)}
                                </span>
                            </div>
                            <p className="text-xs text-text-muted">
                                Last given: {formatLastGiven(medication.lastAdministeredAt)}
                            </p>
                            {medication.instructions ? (
                                <p className="mt-1 text-xs text-text-muted">
                                    Instructions: {medication.instructions}
                                </p>
                            ) : null}
                            <div className="mt-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            setPendingAction({
                                                medicationId: medication.id,
                                                medicationName: medication.name,
                                                actionType: "administered",
                                            })
                                        }
                                        disabled={updatingMedicationId === medication.id}
                                    >
                                        {updatingMedicationId === medication.id ? "Saving..." : "Mark given"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                            setPendingAction({
                                                medicationId: medication.id,
                                                medicationName: medication.name,
                                                actionType: "skipped",
                                            })
                                        }
                                        disabled={updatingMedicationId === medication.id}
                                    >
                                        Skip
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <AddMedicationModal boarderId={boarderId} />
            {pendingAction ? (
                <MedicationActionConfirmModal
                    actionType={pendingAction.actionType}
                    medicationName={pendingAction.medicationName}
                    isLoading={updatingMedicationId === pendingAction.medicationId}
                    onCancel={() => setPendingAction(null)}
                    onConfirm={async () => {
                        const didSucceed = await handleMedicationAction(
                            pendingAction.medicationId,
                            pendingAction.actionType,
                        );
                        if (didSucceed) {
                            setPendingAction(null);
                        }
                    }}
                />
            ) : null}
        </div>
    );
};

export default MedicationListInline;
