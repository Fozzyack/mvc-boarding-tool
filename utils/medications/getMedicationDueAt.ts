type DateInput = string | Date | null;

export interface MedicationDueInput {
    scheduleType: "recurring" | "one_off";
    intervalDays: number | null;
    timingType: "clock" | "slot";
    administrationTime: string | null;
    daySlot: "morning" | "night" | null;
    startDate: DateInput;
    endDate: DateInput;
    lastAdministeredAt: DateInput;
}

const MORNING_HOUR = 9;
const NIGHT_HOUR = 20;

const parseDateInput = (value: DateInput): Date | null => {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
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

const isValidClockTime = (value: string): boolean => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
};

const hasValidInvariant = (input: MedicationDueInput): boolean => {
    if (input.scheduleType === "recurring") {
        if (input.intervalDays === null || !Number.isInteger(input.intervalDays) || input.intervalDays < 1) {
            return false;
        }
    }

    if (input.scheduleType === "one_off" && input.intervalDays !== null) {
        return false;
    }

    if (input.timingType === "clock") {
        if (!input.administrationTime || !isValidClockTime(input.administrationTime)) {
            return false;
        }

        return input.daySlot === null;
    }

    if (input.daySlot !== "morning" && input.daySlot !== "night") {
        return false;
    }

    return input.administrationTime === null;
};

const getScheduledTime = (input: MedicationDueInput): { hour: number; minute: number } | null => {
    if (input.timingType === "clock" && input.administrationTime) {
        const [hours, minutes] = input.administrationTime.split(":").map(Number);

        if (
            Number.isNaN(hours) ||
            Number.isNaN(minutes) ||
            hours < 0 ||
            hours > 23 ||
            minutes < 0 ||
            minutes > 59
        ) {
            return null;
        }

        return {
            hour: hours,
            minute: minutes,
        };
    }

    if (input.daySlot === "night") {
        return { hour: NIGHT_HOUR, minute: 0 };
    }

    if (input.daySlot === "morning") {
        return { hour: MORNING_HOUR, minute: 0 };
    }

    return null;
};

const buildDateTime = (dateOnly: Date, timing: { hour: number; minute: number }): Date => {
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

const getMedicationDueAt = (input: MedicationDueInput, now: Date = new Date()): Date | null => {
    if (!hasValidInvariant(input)) {
        return null;
    }

    const startDate = parseDateInput(input.startDate);
    if (!startDate) {
        return null;
    }

    const timing = getScheduledTime(input);
    if (!timing) {
        return null;
    }

    const lastAdministeredAt = parseDateInput(input.lastAdministeredAt);

    if (input.scheduleType === "one_off") {
        return buildDateTime(toDateOnly(startDate), timing);
    }

    const intervalDays = input.intervalDays;
    if (intervalDays === null) {
        return null;
    }

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

    const endDate = parseDateInput(input.endDate);
    if (endDate && toDateOnly(dueAt) > toDateOnly(endDate)) {
        return null;
    }

    return dueAt;
};

export default getMedicationDueAt;
