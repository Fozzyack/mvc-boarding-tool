import { BoarderMedicationSummary } from "@/types";

const getMedicationTimingLabel = (medication: BoarderMedicationSummary): string => {
    if (medication.timingType === "clock") {
        return medication.administrationTime || "Time not set";
    }

    if (medication.daySlot === "morning") {
        return "Morning";
    }

    if (medication.daySlot === "night") {
        return "Night";
    }

    return "Timing not set";
};

export default getMedicationTimingLabel;
