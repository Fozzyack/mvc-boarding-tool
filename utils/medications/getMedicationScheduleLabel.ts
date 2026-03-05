import { BoarderMedicationSummary } from "@/types";

const getMedicationScheduleLabel = (medication: BoarderMedicationSummary): string => {
    if (medication.scheduleType === "one_off") {
        return "One-time dose";
    }

    const intervalDays = medication.intervalDays || 1;
    return `Every ${intervalDays} day${intervalDays === 1 ? "" : "s"}`;
};

export default getMedicationScheduleLabel;
