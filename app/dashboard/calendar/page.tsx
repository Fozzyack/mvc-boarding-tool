"use client";

import MedicationActionConfirmModal from "@/components/medications/MedicationActionConfirmModal";
import MedicationStatusBadge from "@/components/medications/MedicationStatusBadge";
import Button from "@/components/ui/Button";
import type {
    CalendarMedicationEvent,
    CalendarMedicationStatus,
    CalendarResponsePayload,
    CalendarStay,
    MedicationLogAction,
} from "@/types";
import getBackendUrl from "@/utils/getBackendUrl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STATUS_FILTERS: Array<{ label: string; value: CalendarMedicationStatus | "all" }> = [
    { label: "All statuses", value: "all" },
    { label: "Due now", value: "due_now" },
    { label: "Due soon", value: "due_soon" },
    { label: "Overdue", value: "overdue" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Completed", value: "completed" },
    { label: "Skipped", value: "skipped" },
    { label: "Missed", value: "missed" },
];

type CalendarViewFilter = "all" | "stays" | "medications";

interface PendingMedicationAction {
    medicationId: string;
    medicationName: string;
    actionType: MedicationLogAction;
}

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const startOfDay = (value: Date): Date => {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
};

const startOfMonth = (value: Date): Date => {
    return new Date(value.getFullYear(), value.getMonth(), 1);
};

const addDays = (value: Date, days: number): Date => {
    const next = new Date(value);
    next.setDate(next.getDate() + days);
    return next;
};

const addMonths = (value: Date, months: number): Date => {
    return new Date(value.getFullYear(), value.getMonth() + months, 1);
};

const formatDateKey = (value: Date): string => {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, "0");
    const day = `${value.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const toDisplayDate = (value: Date): string => {
    return value.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const toClockLabel = (isoValue: string): string => {
    const parsed = new Date(isoValue);
    if (Number.isNaN(parsed.getTime())) {
        return "Unknown time";
    }

    return parsed.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const buildMonthGrid = (month: Date): Date[] => {
    const monthStart = startOfMonth(month);
    const gridStart = addDays(monthStart, -monthStart.getDay());
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
};

const isDateWithinRange = (target: string, start: string, end: string): boolean => {
    return target >= start && target <= end;
};

const CalendarPage = () => {
    const today = startOfDay(new Date());
    const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(today));
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [viewFilter, setViewFilter] = useState<CalendarViewFilter>("all");
    const [statusFilter, setStatusFilter] = useState<CalendarMedicationStatus | "all">("all");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [stays, setStays] = useState<CalendarStay[]>([]);
    const [medicationEvents, setMedicationEvents] = useState<CalendarMedicationEvent[]>([]);
    const [updatingMedicationId, setUpdatingMedicationId] = useState<string | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingMedicationAction | null>(null);
    const latestRequestIdRef = useRef(0);

    const monthGrid = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);

    const fetchCalendarData = useCallback(async () => {
        const localRequestId = latestRequestIdRef.current + 1;
        latestRequestIdRef.current = localRequestId;
        const from = formatDateKey(monthGrid[0]);
        const to = formatDateKey(monthGrid[monthGrid.length - 1]);

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetch(`${getBackendUrl()}/api/calendar?from=${from}&to=${to}`);
            const data = (await response.json()) as CalendarResponsePayload | { msg?: string };

            if (latestRequestIdRef.current !== localRequestId) {
                return;
            }

            if (!response.ok) {
                const message = "msg" in data && data.msg ? data.msg : "Failed to load calendar data.";
                setErrorMessage(message);
                return;
            }

            const payload = data as CalendarResponsePayload;
            setStays(payload.stays || []);
            setMedicationEvents(payload.medicationEvents || []);
        } catch (error) {
            if (latestRequestIdRef.current !== localRequestId) {
                return;
            }
            console.error(error);
            setErrorMessage("Failed to load calendar data.");
        } finally {
            if (latestRequestIdRef.current === localRequestId) {
                setIsLoading(false);
            }
        }
    }, [monthGrid]);

    useEffect(() => {
        fetchCalendarData();
    }, [fetchCalendarData]);

    const handleMedicationAction = async (
        medicationId: string,
        actionType: MedicationLogAction,
    ): Promise<boolean> => {
        setUpdatingMedicationId(medicationId);
        try {
            const response = await fetch(`${getBackendUrl()}/api/medications/${medicationId}/administer`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ actionType }),
            });

            if (!response.ok) {
                console.error("Failed to update medication status");
                return false;
            }

            await fetchCalendarData();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            setUpdatingMedicationId(null);
        }
    };

    const selectedDateKey = formatDateKey(selectedDate);
    const dayStays = useMemo(() => {
        const arrivals = stays.filter((stay) => stay.startDate === selectedDateKey);
        const departures = stays.filter((stay) => stay.endDate === selectedDateKey);
        const inHouse = stays.filter((stay) => isDateWithinRange(selectedDateKey, stay.startDate, stay.endDate));

        return {
            arrivals,
            departures,
            inHouse,
        };
    }, [selectedDateKey, stays]);

    const dayMedicationEvents = useMemo(() => {
        const byDate = medicationEvents.filter((event) => {
            const eventDate = event.scheduledFor.slice(0, 10);
            if (eventDate !== selectedDateKey) {
                return false;
            }

            if (statusFilter !== "all" && event.status !== statusFilter) {
                return false;
            }

            return true;
        });

        return byDate.sort((left, right) => {
            return new Date(left.scheduledFor).getTime() - new Date(right.scheduledFor).getTime();
        });
    }, [medicationEvents, selectedDateKey, statusFilter]);

    const cellSummaryByDate = useMemo(() => {
        const summaries = new Map<string, { stays: number; arrivals: number; departures: number; meds: number }>();

        for (const day of monthGrid) {
            const key = formatDateKey(day);
            summaries.set(key, {
                stays: 0,
                arrivals: 0,
                departures: 0,
                meds: 0,
            });
        }

        for (const stay of stays) {
            for (const day of monthGrid) {
                const key = formatDateKey(day);
                if (isDateWithinRange(key, stay.startDate, stay.endDate)) {
                    const summary = summaries.get(key);
                    if (summary) {
                        summary.stays += 1;
                    }
                }

                if (key === stay.startDate) {
                    const summary = summaries.get(key);
                    if (summary) {
                        summary.arrivals += 1;
                    }
                }

                if (key === stay.endDate) {
                    const summary = summaries.get(key);
                    if (summary) {
                        summary.departures += 1;
                    }
                }
            }
        }

        for (const event of medicationEvents) {
            const key = event.scheduledFor.slice(0, 10);
            const summary = summaries.get(key);
            if (summary) {
                summary.meds += 1;
            }
        }

        return summaries;
    }, [medicationEvents, monthGrid, stays]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-brand">Operations Calendar</h2>
                    <p className="text-text-muted">Unified view of boarder stays and medication tasks.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
                        Prev
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            const nextMonth = startOfMonth(new Date());
                            setCurrentMonth(nextMonth);
                            setSelectedDate(startOfDay(new Date()));
                        }}
                    >
                        Today
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        Next
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="font-semibold text-text">
                    {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        className={`rounded-full border px-3 py-1 text-sm ${
                            viewFilter === "all"
                                ? "border-brand/30 bg-brand/10 text-brand"
                                : "border-border bg-white text-text-muted"
                        }`}
                        onClick={() => setViewFilter("all")}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`rounded-full border px-3 py-1 text-sm ${
                            viewFilter === "stays"
                                ? "border-brand/30 bg-brand/10 text-brand"
                                : "border-border bg-white text-text-muted"
                        }`}
                        onClick={() => setViewFilter("stays")}
                    >
                        Stays
                    </button>
                    <button
                        type="button"
                        className={`rounded-full border px-3 py-1 text-sm ${
                            viewFilter === "medications"
                                ? "border-brand/30 bg-brand/10 text-brand"
                                : "border-border bg-white text-text-muted"
                        }`}
                        onClick={() => setViewFilter("medications")}
                    >
                        Medications
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
                <div className="ui-card overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-border bg-surface-muted text-xs font-semibold uppercase tracking-wide text-text-muted">
                        {WEEKDAY_NAMES.map((dayName) => (
                            <div key={dayName} className="px-3 py-2 text-center">
                                {dayName}
                            </div>
                        ))}
                    </div>
                    {isLoading ? (
                        <div className="p-8 text-center text-text-muted">Loading calendar...</div>
                    ) : errorMessage ? (
                        <div className="p-8 text-center text-red-600">{errorMessage}</div>
                    ) : (
                        <div className="grid grid-cols-7">
                            {monthGrid.map((day) => {
                                const key = formatDateKey(day);
                                const summary = cellSummaryByDate.get(key);
                                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                                const isSelected = key === selectedDateKey;
                                const isToday = key === formatDateKey(today);

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setSelectedDate(day)}
                                        className={`min-h-28 border-b border-r border-border p-2 text-left transition-colors ${
                                            isSelected ? "bg-brand/10" : "hover:bg-surface-muted/60"
                                        } ${isCurrentMonth ? "text-text" : "text-text-muted/60"}`}
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span
                                                className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                                                    isToday ? "bg-brand text-white" : ""
                                                }`}
                                            >
                                                {day.getDate()}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-[11px] leading-tight">
                                            {(viewFilter === "all" || viewFilter === "stays") && summary?.stays ? (
                                                <p className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">
                                                    {summary.stays} in-house
                                                </p>
                                            ) : null}
                                            {(viewFilter === "all" || viewFilter === "stays") && summary?.arrivals ? (
                                                <p className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700">
                                                    {summary.arrivals} arrivals
                                                </p>
                                            ) : null}
                                            {(viewFilter === "all" || viewFilter === "stays") && summary?.departures ? (
                                                <p className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">
                                                    {summary.departures} departures
                                                </p>
                                            ) : null}
                                            {(viewFilter === "all" || viewFilter === "medications") && summary?.meds ? (
                                                <p className="rounded bg-violet-100 px-1.5 py-0.5 text-violet-700">
                                                    {summary.meds} meds
                                                </p>
                                            ) : null}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="ui-card p-4">
                        <h4 className="mb-1">{toDisplayDate(selectedDate)}</h4>
                        <p className="text-sm text-text-muted">Daily operations agenda</p>
                    </div>

                    {(viewFilter === "all" || viewFilter === "stays") && (
                        <div className="ui-card p-4 space-y-3">
                            <h4>Stay Activity</h4>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-text-muted">Arrivals</p>
                                {dayStays.arrivals.length === 0 ? (
                                    <p className="text-sm text-text-muted">No arrivals.</p>
                                ) : (
                                    dayStays.arrivals.map((stay) => (
                                        <p key={`arrive-${stay.boarderId}`} className="text-sm text-text">
                                            {stay.boarderName}
                                        </p>
                                    ))
                                )}
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-text-muted">Departures</p>
                                {dayStays.departures.length === 0 ? (
                                    <p className="text-sm text-text-muted">No departures.</p>
                                ) : (
                                    dayStays.departures.map((stay) => (
                                        <p key={`depart-${stay.boarderId}`} className="text-sm text-text">
                                            {stay.boarderName}
                                        </p>
                                    ))
                                )}
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-text-muted">In-house</p>
                                {dayStays.inHouse.length === 0 ? (
                                    <p className="text-sm text-text-muted">No active boarders.</p>
                                ) : (
                                    <p className="text-sm text-text">{dayStays.inHouse.length} boarders in-house</p>
                                )}
                            </div>
                        </div>
                    )}

                    {(viewFilter === "all" || viewFilter === "medications") && (
                        <div className="ui-card p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4>Medication Agenda</h4>
                                <select
                                    className="rounded-lg border border-border bg-white px-2 py-1 text-xs"
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value as CalendarMedicationStatus | "all")
                                    }
                                >
                                    {STATUS_FILTERS.map((filter) => (
                                        <option key={filter.value} value={filter.value}>
                                            {filter.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {dayMedicationEvents.length === 0 ? (
                                <p className="text-sm text-text-muted">No medication events for this day.</p>
                            ) : (
                                <div className="space-y-2">
                                    {dayMedicationEvents.map((event) => {
                                        const canMarkGiven =
                                            event.status === "due_now" ||
                                            event.status === "due_soon" ||
                                            event.status === "overdue" ||
                                            event.status === "scheduled";

                                        return (
                                            <div key={event.id} className="rounded-xl border border-border bg-white p-3">
                                                <div className="mb-2 flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-sm font-semibold text-text">
                                                            {toClockLabel(event.scheduledFor)} · {event.medicationName}
                                                        </p>
                                                        <p className="text-xs text-text-muted">
                                                            {event.boarderName} · {event.dosage}
                                                        </p>
                                                        <p className="text-xs text-text-muted">
                                                            {event.timingLabel} · {event.scheduleLabel}
                                                        </p>
                                                    </div>
                                                    <MedicationStatusBadge status={event.status} />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            setPendingAction({
                                                                medicationId: event.medicationId,
                                                                medicationName: event.medicationName,
                                                                actionType: "administered",
                                                            })
                                                        }
                                                        disabled={!canMarkGiven || updatingMedicationId === event.medicationId}
                                                    >
                                                        {updatingMedicationId === event.medicationId ? "Saving..." : "Mark given"}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() =>
                                                            setPendingAction({
                                                                medicationId: event.medicationId,
                                                                medicationName: event.medicationName,
                                                                actionType: "skipped",
                                                            })
                                                        }
                                                        disabled={!canMarkGiven || updatingMedicationId === event.medicationId}
                                                    >
                                                        Skip
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            setPendingAction({
                                                                medicationId: event.medicationId,
                                                                medicationName: event.medicationName,
                                                                actionType: "missed",
                                                            })
                                                        }
                                                        disabled={!canMarkGiven || updatingMedicationId === event.medicationId}
                                                    >
                                                        Missed
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

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

export default CalendarPage;
