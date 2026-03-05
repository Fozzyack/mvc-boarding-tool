import AddMedicationModal from "@/components/AddMedicationModal";
import MedicationStatusBadge from "@/components/medications/MedicationStatusBadge";
import { BoarderMedicationSummary } from "@/types";
import getMedicationScheduleLabel from "@/utils/medications/getMedicationScheduleLabel";
import getMedicationStatus, {
    type MedicationStatus,
} from "@/utils/medications/getMedicationStatus";
import getMedicationTimingLabel from "@/utils/medications/getMedicationTimingLabel";

const STATUS_CARD_STYLE: Record<MedicationStatus, string> = {
    due_now: "border-red-200 bg-gradient-to-r from-red-50 to-white",
    due_soon: "border-amber-200 bg-gradient-to-r from-amber-50 to-white",
    scheduled: "border-slate-200 bg-gradient-to-r from-slate-50 to-white",
    overdue: "border-rose-200 bg-gradient-to-r from-rose-50 to-white",
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

const MedicationListInline = ({
    boarderId,
    medications,
}: MedicationListInlineProps) => {
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
                        </div>
                    );
                })}
            </div>
            <AddMedicationModal boarderId={boarderId} />
        </div>
    );
};

export default MedicationListInline;
