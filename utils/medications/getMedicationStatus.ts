import { BoarderMedicationSummary } from "@/types";

export type MedicationStatus = "due_now" | "due_soon" | "scheduled" | "overdue";

const DUE_NOW_WINDOW_MINUTES = 15;
const DUE_SOON_WINDOW_MINUTES = 60;
const MORNING_HOUR = 9;
const NIGHT_HOUR = 20;

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

const addDays = (value: Date, days: number): Date => {
    const date = new Date(value);
    date.setDate(date.getDate() + days);
    return date;
};

const toDateOnly = (value: Date): Date => {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
};

const getDayDiff = (left: Date, right: Date): number => {
    const msPerDay = 24 * 60 * 60 * 1000;
    const leftUtc = Date.UTC(left.getFullYear(), left.getMonth(), left.getDate());
    const rightUtc = Date.UTC(right.getFullYear(), right.getMonth(), right.getDate());
    return Math.floor((leftUtc - rightUtc) / msPerDay);
};

const getScheduledTime = (
    medication: BoarderMedicationSummary,
): { hour: number; minute: number } => {
    if (medication.timingType === "clock" && medication.administrationTime) {
        const [hours, minutes] = medication.administrationTime.split(":").map(Number);
        return {
            hour: Number.isNaN(hours) ? MORNING_HOUR : hours,
            minute: Number.isNaN(minutes) ? 0 : minutes,
        };
    }

    if (medication.daySlot === "night") {
        return { hour: NIGHT_HOUR, minute: 0 };
    }

    return { hour: MORNING_HOUR, minute: 0 };
};

const buildDateTime = (
    dateOnly: Date,
    timing: { hour: number; minute: number },
): Date => {
    return new Date(
        dateOnly.getFullYear(),
        dateOnly.getMonth(),
        dateOnly.getDate(),
        timing.hour,
        timing.minute,
        0,
        0,
    );
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

const getMedicationStatus = (
    medication: BoarderMedicationSummary,
    now: Date = new Date(),
): MedicationStatus => {
    const startDate = parseDateInput(medication.startDate);
    if (!startDate) {
        return "scheduled";
    }

    const timing = getScheduledTime(medication);
    const lastAdministeredAt = parseDateInput(medication.lastAdministeredAt);

    if (medication.scheduleType === "one_off") {
        const oneOffDueAt = buildDateTime(toDateOnly(startDate), timing);

        if (lastAdministeredAt && lastAdministeredAt >= oneOffDueAt) {
            return "scheduled";
        }

        return classifyStatus(oneOffDueAt, now);
    }

    const intervalDays = medication.intervalDays || 1;
    const today = toDateOnly(now);
    const startDay = toDateOnly(startDate);

    let cycleDay = startDay;
    const elapsedDays = getDayDiff(today, startDay);

    if (elapsedDays > 0) {
        const cyclesPassed = Math.floor(elapsedDays / intervalDays);
        cycleDay = addDays(startDay, cyclesPassed * intervalDays);
    }

    let dueAt = buildDateTime(cycleDay, timing);

    if (lastAdministeredAt && lastAdministeredAt >= dueAt) {
        dueAt = buildDateTime(addDays(cycleDay, intervalDays), timing);
    }

    const endDate = parseDateInput(medication.endDate);
    if (endDate && toDateOnly(dueAt) > toDateOnly(endDate)) {
        return "scheduled";
    }

    return classifyStatus(dueAt, now);
};

export default getMedicationStatus;
