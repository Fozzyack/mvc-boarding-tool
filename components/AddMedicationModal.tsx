"use client";

import { useBoardersContext } from "@/contexts/BoardersContext";
import getBackendUrl from "@/utils/getBackendUrl";
import { useState } from "react";
import { createPortal } from "react-dom";

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
        frequency: "",
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
                    frequency: formValues.frequency,
                    startDate: formValues.startDate,
                    endDate: formValues.endDate || null,
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

    return createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center">
            <div
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-slate-900/35"
            />
            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-slate-900">
                            Add Medication
                        </h4>
                        <p className="text-sm text-slate-600">
                            Add dosage and schedule for a boarder.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 transition-colors hover:text-slate-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {!boarderId && (
                        <div>
                            <label
                                htmlFor="boarderId"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Boarder <span className="ml-1 text-red-500">*</span>
                            </label>
                            <select
                                id="boarderId"
                                name="boarderId"
                                value={formValues.boarderId}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="">Select a boarder</option>
                                {boarders.map((boarder) => (
                                    <option key={boarder.id} value={boarder.id}>
                                        {boarder.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Medication Name
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={formValues.name}
                                onChange={handleInputChange}
                                placeholder="Carprofen"
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="dosage"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Dosage <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                                id="dosage"
                                name="dosage"
                                value={formValues.dosage}
                                onChange={handleInputChange}
                                placeholder="50mg"
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="frequency"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Frequency <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                                id="frequency"
                                name="frequency"
                                value={formValues.frequency}
                                onChange={handleInputChange}
                                placeholder="Twice daily"
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="startDate"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Start Date <span className="ml-1 text-red-500">*</span>
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                name="startDate"
                                value={formValues.startDate}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label
                                htmlFor="endDate"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                End Date
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                name="endDate"
                                value={formValues.endDate}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label
                                htmlFor="instructions"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Instructions
                            </label>
                            <textarea
                                id="instructions"
                                name="instructions"
                                value={formValues.instructions}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Give with food. Monitor for drowsiness."
                                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                            Save Medication
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
};

const AddMedicationModal = ({ boarderId }: { boarderId?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const buttonLabel = boarderId ? "Add" : "Add Medication";

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 ${
                    boarderId
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
                        : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
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
