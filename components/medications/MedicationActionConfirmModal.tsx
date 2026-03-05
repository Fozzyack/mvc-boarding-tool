"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { MedicationLogAction } from "@/types";

interface MedicationActionConfirmModalProps {
    actionType: MedicationLogAction;
    medicationName: string;
    isLoading: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const getActionLabel = (actionType: MedicationLogAction): string => {
    if (actionType === "administered") {
        return "mark this medication as given";
    }

    if (actionType === "skipped") {
        return "mark this medication as skipped";
    }

    return "mark this medication as missed";
};

const MedicationActionConfirmModal = ({
    actionType,
    medicationName,
    isLoading,
    onCancel,
    onConfirm,
}: MedicationActionConfirmModalProps) => {
    const actionLabel = getActionLabel(actionType);

    return (
        <Modal
            title="Confirm Medication Update"
            description="Please confirm this medication action."
            onClose={onCancel}
            contentClassName="max-w-md"
        >
            <div className="space-y-4">
                <p className="text-sm text-text">
                    You are about to {actionLabel} for <span className="font-semibold">{medicationName}</span>.
                </p>
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Confirm"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default MedicationActionConfirmModal;
