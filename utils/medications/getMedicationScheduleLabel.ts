import { BoarderMedicationSummary } from "@/types";

const getMedicationScheduleLabel = (medication: BoarderMedicationSummary): string => {
    if (medication.scheduleType === "one_off") {
        return "One-time dose";
    }

    if (medication.intervalDays === null || !Number.isInteger(medication.intervalDays)) {
        return "Invalid interval";
    }

    if (medication.intervalDays < 1) {
        return "Invalid interval";
    }

    const intervalDays = medication.intervalDays;
    return `Every ${intervalDays} day${intervalDays === 1 ? "" : "s"}`;
};

export default getMedicationScheduleLabel;
