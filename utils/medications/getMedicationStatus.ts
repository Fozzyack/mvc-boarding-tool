import { BoarderMedicationSummary } from "@/types";
import getMedicationDueAt from "@/utils/medications/getMedicationDueAt";

export type MedicationStatus =
    | "due_now"
    | "due_soon"
    | "scheduled"
    | "overdue"
    | "completed"
    | "skipped"
    | "missed";

const DUE_NOW_WINDOW_MINUTES = 15;
const DUE_SOON_WINDOW_MINUTES = 60;
const DUE_MATCH_WINDOW_MINUTES = 1;

const parseDateInput = (value: string | null): Date | null => {
    if (!value) {
        return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
};

const classifyStatus = (dueAt: Date, now: Date): MedicationStatus => {
    const diffMinutes = (dueAt.getTime() - now.getTime()) / (60 * 1000);

    if (diffMinutes < -DUE_NOW_WINDOW_MINUTES) {
        return "overdue";
    }

    if (diffMinutes <= DUE_NOW_WINDOW_MINUTES) {
        return "due_now";
    }

    if (diffMinutes <= DUE_SOON_WINDOW_MINUTES) {
        return "due_soon";
    }

    return "scheduled";
};

const getLoggedStatus = (medication: BoarderMedicationSummary, dueAt: Date): MedicationStatus | null => {
    const loggedAt = parseDateInput(medication.latestLogScheduledFor);
    if (!loggedAt || !medication.latestLogAction) {
        return null;
    }

    const diffMinutes = Math.abs((loggedAt.getTime() - dueAt.getTime()) / (60 * 1000));
    if (diffMinutes > DUE_MATCH_WINDOW_MINUTES) {
        return null;
    }

    if (medication.latestLogAction === "administered") {
        return "completed";
    }

    if (medication.latestLogAction === "skipped") {
        return "skipped";
    }

    return "missed";
};

const getMedicationStatus = (
    medication: BoarderMedicationSummary,
    now: Date = new Date(),
): MedicationStatus => {
    const dueAt = getMedicationDueAt(medication, now);
    if (!dueAt) {
        return "scheduled";
    }

    const loggedStatus = getLoggedStatus(medication, dueAt);
    if (loggedStatus) {
        return loggedStatus;
    }

    return classifyStatus(dueAt, now);
};

export default getMedicationStatus;
