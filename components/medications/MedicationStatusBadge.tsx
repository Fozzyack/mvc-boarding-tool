import { MedicationStatus } from "@/utils/medications/getMedicationStatus";

const STATUS_STYLE: Record<MedicationStatus, string> = {
    due_now: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
    due_soon: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    scheduled: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
    overdue: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    completed: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    skipped: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
    missed: "bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-200",
};

const STATUS_LABEL: Record<MedicationStatus, string> = {
    due_now: "Due now",
    due_soon: "Due soon",
    scheduled: "Scheduled",
    overdue: "Overdue",
    completed: "Completed",
    skipped: "Skipped",
    missed: "Missed",
};

const MedicationStatusBadge = ({ status }: { status: MedicationStatus }) => {
    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
            {STATUS_LABEL[status]}
        </span>
    );
};

export default MedicationStatusBadge;
