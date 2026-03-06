import db from "@/db/drizzle";
import { boardersTable, medicationAdministrationLogTable, medicationTable } from "@/db/schema";
import type {
    CalendarMedicationEvent,
    CalendarMedicationStatus,
    CalendarStay,
    sessionPayload,
} from "@/types";
import { getSession } from "@/utils/auth/auth";
import { and, eq, gte, inArray, isNull, lte, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const DUE_NOW_WINDOW_MINUTES = 60;
const DUE_SOON_WINDOW_MINUTES = 240;
const LOG_MATCH_WINDOW_MINUTES = 1;
const MAX_RANGE_DAYS = 93;

const parseDateOnly = (value: string | null): Date | null => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
};

const formatDateOnly = (value: Date): string => {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const addDays = (value: Date, days: number): Date => {
    const date = new Date(value);
    date.setDate(date.getDate() + days);
    return date;
};

const getDayDiff = (left: Date, right: Date): number => {
    const msPerDay = 24 * 60 * 60 * 1000;
    const leftUtc = Date.UTC(left.getFullYear(), left.getMonth(), left.getDate());
    const rightUtc = Date.UTC(right.getFullYear(), right.getMonth(), right.getDate());
    return Math.floor((leftUtc - rightUtc) / msPerDay);
};

const toTimestamp = (value: Date | string): Date => {
    const parsed = value instanceof Date ? value : new Date(value);
    return parsed;
};

const formatTimingLabel = (
    timingType: string,
    administrationTime: string | null,
    daySlot: string | null,
): string | null => {
    if (timingType === "clock") {
        if (!administrationTime || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(administrationTime)) {
            return null;
        }

        return administrationTime;
    }

    if (timingType === "slot" && (daySlot === "morning" || daySlot === "night")) {
        return daySlot === "morning" ? "Morning" : "Night";
    }

    return null;
};

const getScheduledClock = (
    timingType: string,
    administrationTime: string | null,
    daySlot: string | null,
): { hour: number; minute: number } | null => {
    if (timingType === "clock") {
        if (!administrationTime || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(administrationTime)) {
            return null;
        }

        const [hour, minute] = administrationTime.split(":").map(Number);
        return { hour, minute };
    }

    if (timingType === "slot") {
        if (daySlot === "morning") {
            return { hour: 9, minute: 0 };
        }

        if (daySlot === "night") {
            return { hour: 20, minute: 0 };
        }
    }

    return null;
};

const buildDateTime = (day: Date, hour: number, minute: number): Date => {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute, 0, 0);
};

const classifyMedicationStatus = (dueAt: Date, now: Date): CalendarMedicationStatus => {
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

const getScheduleLabel = (scheduleType: string, intervalDays: number | null): string => {
    if (scheduleType === "one_off") {
        return "One-off";
    }

    if (!intervalDays || intervalDays < 1) {
        return "Recurring";
    }

    return intervalDays === 1 ? "Daily" : `Every ${intervalDays} days`;
};

const expandRecurringDays = (
    startDay: Date,
    intervalDays: number,
    fromDay: Date,
    untilDay: Date,
): Date[] => {
    if (intervalDays < 1) {
        return [];
    }

    const days: Date[] = [];
    const diff = getDayDiff(fromDay, startDay);
    const steps = diff > 0 ? Math.ceil(diff / intervalDays) : 0;
    let cursor = addDays(startDay, steps * intervalDays);

    while (cursor <= untilDay) {
        days.push(new Date(cursor));
        cursor = addDays(cursor, intervalDays);
    }

    return days;
};

const getMatchedLogAction = (
    logs: Array<{ actionType: "administered" | "skipped" | "missed"; scheduledFor: Date }>,
    dueAt: Date,
): "administered" | "skipped" | "missed" | null => {
    let matchedAction: "administered" | "skipped" | "missed" | null = null;
    let smallestDiffMs = Number.POSITIVE_INFINITY;

    for (const log of logs) {
        const diffMs = Math.abs(log.scheduledFor.getTime() - dueAt.getTime());
        if (diffMs > LOG_MATCH_WINDOW_MINUTES * 60 * 1000) {
            continue;
        }

        if (diffMs < smallestDiffMs) {
            smallestDiffMs = diffMs;
            matchedAction = log.actionType;
        }
    }

    return matchedAction;
};

export const GET = async (req: NextRequest) => {
    const session = (await getSession()) as sessionPayload;
    if (!session) {
        return NextResponse.json(
            { msg: "Cannot complete this action: unAuthorized" },
            { status: 401 },
        );
    }

    const fromParam = req.nextUrl.searchParams.get("from");
    const toParam = req.nextUrl.searchParams.get("to");

    const fromDay = parseDateOnly(fromParam);
    const toDay = parseDateOnly(toParam);

    if (!fromDay || !toDay) {
        return NextResponse.json(
            { msg: "Invalid or missing date range. Use from=YYYY-MM-DD&to=YYYY-MM-DD" },
            { status: 400 },
        );
    }

    if (fromDay > toDay) {
        return NextResponse.json(
            { msg: "Invalid date range. `from` must be before `to`." },
            { status: 400 },
        );
    }

    const rangeDays = getDayDiff(toDay, fromDay) + 1;
    if (rangeDays > MAX_RANGE_DAYS) {
        return NextResponse.json(
            { msg: `Range too large. Maximum is ${MAX_RANGE_DAYS} days.` },
            { status: 400 },
        );
    }

    const fromDateString = formatDateOnly(fromDay);
    const toDateString = formatDateOnly(toDay);

    const boarders = await db
        .select({
            id: boardersTable.id,
            name: boardersTable.name,
            ownerName: boardersTable.ownerName,
            startDate: boardersTable.startDate,
            endDate: boardersTable.endDate,
        })
        .from(boardersTable)
        .where(
            and(
                eq(boardersTable.organisationId, session.organisationId),
                eq(boardersTable.isActive, true),
                lte(boardersTable.startDate, toDateString),
                gte(boardersTable.endDate, fromDateString),
            ),
        );

    const stays: CalendarStay[] = boarders.map((boarder) => ({
        boarderId: boarder.id,
        boarderName: boarder.name,
        ownerName: boarder.ownerName || null,
        startDate: boarder.startDate,
        endDate: boarder.endDate,
    }));

    const medications = await db
        .select({
            id: medicationTable.id,
            boarderId: medicationTable.boarderId,
            boarderName: boardersTable.name,
            ownerName: boardersTable.ownerName,
            medicationName: medicationTable.name,
            dosage: medicationTable.dosage,
            scheduleType: medicationTable.scheduleType,
            intervalDays: medicationTable.intervalDays,
            timingType: medicationTable.timingType,
            administrationTime: medicationTable.administrationTime,
            daySlot: medicationTable.daySlot,
            startDate: medicationTable.startDate,
            endDate: medicationTable.endDate,
        })
        .from(medicationTable)
        .innerJoin(boardersTable, eq(medicationTable.boarderId, boardersTable.id))
        .where(
            and(
                eq(medicationTable.organisationId, session.organisationId),
                eq(medicationTable.isActive, true),
                eq(boardersTable.isActive, true),
                lte(medicationTable.startDate, toDateString),
                or(gte(medicationTable.endDate, fromDateString), isNull(medicationTable.endDate)),
            ),
        );

    const medicationIds = medications.map((medication) => medication.id);
    const logs = medicationIds.length
        ? await db
              .select({
                  medicationId: medicationAdministrationLogTable.medicationId,
                  actionType: medicationAdministrationLogTable.actionType,
                  scheduledFor: medicationAdministrationLogTable.scheduledFor,
              })
              .from(medicationAdministrationLogTable)
              .where(
                  and(
                      eq(medicationAdministrationLogTable.organisationId, session.organisationId),
                      inArray(medicationAdministrationLogTable.medicationId, medicationIds),
                      gte(
                          medicationAdministrationLogTable.scheduledFor,
                          buildDateTime(fromDay, 0, 0),
                      ),
                      lte(
                          medicationAdministrationLogTable.scheduledFor,
                          buildDateTime(toDay, 23, 59),
                      ),
                  ),
              )
        : [];

    const logsByMedication = new Map<
        string,
        Array<{ actionType: "administered" | "skipped" | "missed"; scheduledFor: Date }>
    >();

    for (const log of logs) {
        const logTime = toTimestamp(log.scheduledFor);
        if (Number.isNaN(logTime.getTime())) {
            continue;
        }

        const actionType = log.actionType as "administered" | "skipped" | "missed";
        const existing = logsByMedication.get(log.medicationId) || [];
        existing.push({
            actionType,
            scheduledFor: logTime,
        });
        logsByMedication.set(log.medicationId, existing);
    }

    const now = new Date();
    const medicationEvents: CalendarMedicationEvent[] = [];
    for (const medication of medications) {
        const timing = getScheduledClock(
            medication.timingType,
            medication.administrationTime,
            medication.daySlot,
        );
        const timingLabel = formatTimingLabel(
            medication.timingType,
            medication.administrationTime,
            medication.daySlot,
        );
        const startDay = parseDateOnly(medication.startDate);
        const medicationEndDate = medication.endDate
            ? parseDateOnly(medication.endDate)
            : null;

        if (!timing || !timingLabel || !startDay) {
            continue;
        }

        const untilDay = medicationEndDate && medicationEndDate < toDay ? medicationEndDate : toDay;
        if (startDay > untilDay) {
            continue;
        }

        const days: Date[] = [];
        if (medication.scheduleType === "one_off") {
            if (startDay >= fromDay && startDay <= untilDay) {
                days.push(startDay);
            }
        } else if (medication.scheduleType === "recurring") {
            if (!medication.intervalDays || medication.intervalDays < 1) {
                continue;
            }

            days.push(...expandRecurringDays(startDay, medication.intervalDays, fromDay, untilDay));
        } else {
            continue;
        }

        const medicationLogs = logsByMedication.get(medication.id) || [];
        for (const day of days) {
            const scheduledFor = buildDateTime(day, timing.hour, timing.minute);
            const matchedAction = getMatchedLogAction(medicationLogs, scheduledFor);

            let status: CalendarMedicationStatus;
            if (matchedAction === "administered") {
                status = "completed";
            } else if (matchedAction === "skipped") {
                status = "skipped";
            } else if (matchedAction === "missed") {
                status = "missed";
            } else {
                status = classifyMedicationStatus(scheduledFor, now);
            }

            medicationEvents.push({
                id: `${medication.id}-${scheduledFor.toISOString()}`,
                medicationId: medication.id,
                boarderId: medication.boarderId,
                boarderName: medication.boarderName,
                ownerName: medication.ownerName,
                medicationName: medication.medicationName,
                dosage: medication.dosage,
                scheduledFor: scheduledFor.toISOString(),
                status,
                timingLabel,
                scheduleLabel: getScheduleLabel(medication.scheduleType, medication.intervalDays),
            });
        }
    }

    medicationEvents.sort((left, right) => {
        return new Date(left.scheduledFor).getTime() - new Date(right.scheduledFor).getTime();
    });

    return NextResponse.json({
        from: fromDateString,
        to: toDateString,
        stays,
        medicationEvents,
    });
};
