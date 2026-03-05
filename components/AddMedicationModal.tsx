"use client";

import { useBoardersContext } from "@/contexts/BoardersContext";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import getBackendUrl from "@/utils/getBackendUrl";
import { useState } from "react";

const MedicationFormModal = ({
    setIsOpen,
    boarderId,
}: {
    setIsOpen: (value: boolean) => void;
    boarderId?: string;
}) => {
    const { boarders, refreshBoarders } = useBoardersContext();
    const [formValues, setFormValues] = useState({
        boarderId: boarderId || "",
        name: "",
        dosage: "",
        isOneOff: false,
        intervalDays: "1",
        timingType: "slot",
        administrationTime: "",
        daySlot: "morning",
        startDate: "",
        endDate: "",
        instructions: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(`${getBackendUrl()}/api/medications`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    boarderId: formValues.boarderId,
                    name: formValues.name,
                    dosage: formValues.dosage,
                    isOneOff: formValues.isOneOff,
                    intervalDays: formValues.isOneOff
                        ? null
                        : Number(formValues.intervalDays),
                    timingType: formValues.timingType,
                    administrationTime:
                        formValues.timingType === "clock"
                            ? formValues.administrationTime
                            : null,
                    daySlot:
                        formValues.timingType === "slot"
                            ? formValues.daySlot
                            : null,
                    startDate: formValues.startDate,
                    endDate: formValues.isOneOff ? null : formValues.endDate || null,
                    instructions: formValues.instructions || null,
                }),
            });

            if (!res.ok) {
                console.error("Failed to add medication");
                return;
            }

            setIsOpen(false);
            refreshBoarders();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal
            title="Add Medication"
            description="Add dosage and schedule for a boarder."
            onClose={() => setIsOpen(false)}
            contentClassName="max-w-lg"
        >
            <form onSubmit={handleSubmit} className="space-y-3">
                {!boarderId && (
                    <FormField label="Boarder" htmlFor="boarderId" required>
                        <Select
                            id="boarderId"
                            name="boarderId"
                            value={formValues.boarderId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select a boarder</option>
                            {boarders.map((boarder) => (
                                <option key={boarder.id} value={boarder.id}>
                                    {boarder.name}
                                </option>
                            ))}
                        </Select>
                    </FormField>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <FormField label="Medication Name" htmlFor="name" required>
                        <Input
                            id="name"
                            name="name"
                            value={formValues.name}
                            onChange={handleInputChange}
                            placeholder="Carprofen"
                            required
                        />
                    </FormField>
                    <FormField label="Dosage" htmlFor="dosage" required>
                        <Input
                            id="dosage"
                            name="dosage"
                            value={formValues.dosage}
                            onChange={handleInputChange}
                            placeholder="50mg"
                            required
                        />
                    </FormField>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 md:col-span-2">
                        <input
                            id="isOneOff"
                            name="isOneOff"
                            type="checkbox"
                            checked={formValues.isOneOff}
                            onChange={handleCheckboxChange}
                            className="size-4 accent-brand"
                        />
                        <label htmlFor="isOneOff" className="text-sm font-medium text-text">
                            One-time dose
                        </label>
                    </div>
                    {!formValues.isOneOff && (
                        <FormField label="Every X days" htmlFor="intervalDays" required>
                            <Input
                                id="intervalDays"
                                name="intervalDays"
                                type="number"
                                min={1}
                                step={1}
                                value={formValues.intervalDays}
                                onChange={handleInputChange}
                                placeholder="1"
                                required
                            />
                        </FormField>
                    )}
                    <FormField label="Timing" htmlFor="timingType" required>
                        <Select
                            id="timingType"
                            name="timingType"
                            value={formValues.timingType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="slot">Morning or night</option>
                            <option value="clock">Specific time</option>
                        </Select>
                    </FormField>
                    {formValues.timingType === "clock" ? (
                        <FormField label="Administration Time" htmlFor="administrationTime" required>
                            <Input
                                id="administrationTime"
                                name="administrationTime"
                                type="time"
                                value={formValues.administrationTime}
                                onChange={handleInputChange}
                                required
                            />
                        </FormField>
                    ) : (
                        <FormField label="Time of day" htmlFor="daySlot" required>
                            <Select
                                id="daySlot"
                                name="daySlot"
                                value={formValues.daySlot}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="morning">Morning</option>
                                <option value="night">Night</option>
                            </Select>
                        </FormField>
                    )}
                    <FormField
                        label={formValues.isOneOff ? "Administration Date" : "Start Date"}
                        htmlFor="startDate"
                        required
                    >
                        <Input
                            id="startDate"
                            type="date"
                            name="startDate"
                            value={formValues.startDate}
                            onChange={handleInputChange}
                            required
                        />
                    </FormField>
                    {!formValues.isOneOff && (
                        <div className="md:col-span-2">
                            <FormField label="End Date" htmlFor="endDate">
                                <Input
                                    id="endDate"
                                    type="date"
                                    name="endDate"
                                    value={formValues.endDate}
                                    onChange={handleInputChange}
                                />
                            </FormField>
                        </div>
                    )}
                    <div className="md:col-span-2">
                        <FormField label="Instructions" htmlFor="instructions">
                            <Textarea
                                id="instructions"
                                name="instructions"
                                value={formValues.instructions}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Give with food. Monitor for drowsiness."
                            />
                        </FormField>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit">Save Medication</Button>
                </div>
            </form>
        </Modal>
    );
};

const AddMedicationModal = ({ boarderId }: { boarderId?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const buttonLabel = boarderId ? "Add" : "Add Medication";

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`ui-button-base px-3 py-2 text-sm ${
                    boarderId
                        ? "border border-brand/20 bg-brand/10 text-brand hover:border-brand/30 hover:bg-brand/15"
                        : "border border-border bg-white text-text hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                {buttonLabel}
            </button>
            {isOpen && (
                <MedicationFormModal
                    boarderId={boarderId}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    );
};

export default AddMedicationModal;
