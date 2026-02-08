"use client";

import { useBoardersContext } from "@/contexts/BoardersContext";
import getBackendUrl from "@/utils/getBackendUrl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const InputField = ({
    label,
    name,
    placeholder,
    onChangeFunction,
    type,
    step,
    required,
    value,
}: {
    label: string;
    name: string;
    placeholder: string;
    onChangeFunction: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    step?: string;
    required?: boolean;
    value: string;
}) => {
    return (
        <div className="mb-3">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-slate-700 mb-1"
            >
                {label}
                {required ? (
                    <span className="text-red-500 ml-1">*</span>
                ) : (
                    <span className="text-slate-400 ml-1 text-xs">
                        (optional)
                    </span>
                )}
            </label>
            <input
                type={type || "text"}
                id={name}
                name={name}
                value={value}
                onChange={onChangeFunction}
                placeholder={placeholder}
                step={step}
                required={required}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>
    );
};

const TextareaField = ({
    label,
    name,
    placeholder,
    onChangeFunction,
    required,
    value,
}: {
    label: string;
    name: string;
    placeholder: string;
    onChangeFunction: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
    value: string;
}) => {
    return (
        <div className="mb-3">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-slate-700 mb-1"
            >
                {label}
                {required ? (
                    <span className="text-red-500 ml-1">*</span>
                ) : (
                    <span className="text-slate-400 ml-1 text-xs">
                        (optional)
                    </span>
                )}
            </label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChangeFunction}
                placeholder={placeholder}
                rows={3}
                required={required}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
        </div>
    );
};

const BoarderModal = ({
    setIsOpen,
}: {
    setIsOpen: (value: boolean) => void;
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formValues, setFormValues] = useState({
        name: "",
        animalType: "",
        species: "",
        dateOfBirth: "",
        weight: "",
        startDate: "",
        endDate: "",
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",
        medicalNotes: "",
        allergies: "",
        feedingInstructions: "",
        specialCareInstructions: "",
    });

    const { refreshBoarders } = useBoardersContext();

    useEffect(() => {
        // Just here as the next buttons are a bit buggy.
        // May have to return to this at a later date
    }, [currentStep]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const nextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();
        setCurrentStep((prev) => prev + 1);
    };
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(`${getBackendUrl()}/api/boarders`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    name: formValues.name,
                    animalType: formValues.animalType,
                    species: formValues.species,
                    dateOfBirth: formValues.dateOfBirth,
                    weight: formValues.weight,
                    startDate: formValues.startDate,
                    endDate: formValues.endDate,
                    ownerName: formValues.ownerName,
                    ownerPhone: formValues.ownerPhone,
                    ownerEmail: formValues.ownerEmail,
                    medicalNotes: formValues.medicalNotes,
                    allergies: formValues.allergies,
                    feedingInstructions: formValues.feedingInstructions,
                    specialCareInstructions: formValues.specialCareInstructions,
                }),
            });
            if (!res.ok) {
                return console.error(
                    "There was an Error (probably should put a popup here)",
                );
            }
            const data = await res.json();
            console.log(data);
            setIsOpen(false);
            refreshBoarders();
            setFormValues({
                name: "",
                animalType: "",
                species: "",
                dateOfBirth: "",
                weight: "",
                startDate: "",
                endDate: "",
                ownerName: "",
                ownerPhone: "",
                ownerEmail: "",
                medicalNotes: "",
                allergies: "",
                feedingInstructions: "",
                specialCareInstructions: "",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const step1Required = ["name", "animalType"];
    const step2Required = ["ownerName", "ownerPhone"];

    const isStepValid = () => {
        if (currentStep === 1) {
            return step1Required.every(
                (field) =>
                    formValues[field as keyof typeof formValues].trim() !== "",
            );
        }
        if (currentStep === 2) {
            return step2Required.every(
                (field) =>
                    formValues[field as keyof typeof formValues].trim() !== "",
            );
        }
        return true;
    };

    const steps = [
        {
            title: "Animal Info",
            description: "Basic information about the boarder",
        },
        { title: "Owner Info", description: "Owner's contact details" },
        {
            title: "Care Instructions",
            description: "Special care and feeding notes",
        },
    ];

    return createPortal(
        <div className="z-20 w-full h-screen fixed inset-0 flex flex-col items-center justify-center">
            <div
                onClick={() => setIsOpen(false)}
                className="absolute z-0 h-full w-full bg-gray-800/30"
            />
            <div className="p-6 bg-white rounded-xl border border-slate-200 z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h4 className="text-lg font-semibold text-slate-900">
                            Add New Boarder
                        </h4>
                        <p className="text-sm text-slate-600">
                            {steps[currentStep - 1].description}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="hover:cursor-pointer text-slate-400 hover:text-slate-600"
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

                <div className="flex items-center gap-2 mb-6">
                    {steps.map((_, index) => (
                        <div key={index} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    index + 1 <= currentStep
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-200 text-slate-500"
                                }`}
                            >
                                {index + 1}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-12 h-1 mx-1 ${
                                        index + 1 < currentStep
                                            ? "bg-emerald-600"
                                            : "bg-slate-200"
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Name"
                                name="name"
                                placeholder="Wesley"
                                value={formValues.name}
                                onChangeFunction={handleInputChange}
                                required
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <InputField
                                    label="Animal Type"
                                    name="animalType"
                                    placeholder="Dog"
                                    value={formValues.animalType}
                                    onChangeFunction={handleInputChange}
                                    required
                                />
                                <InputField
                                    label="Species"
                                    name="species"
                                    placeholder="Golden Retriever"
                                    value={formValues.species}
                                    onChangeFunction={handleInputChange}
                                />
                            </div>
                            <InputField
                                label="Date of Birth"
                                name="dateOfBirth"
                                placeholder="2020-01-01"
                                type="date"
                                value={formValues.dateOfBirth}
                                onChangeFunction={handleInputChange}
                            />
                            <InputField
                                label="Weight (kg)"
                                name="weight"
                                placeholder="25.5"
                                type="number"
                                step="0.01"
                                value={formValues.weight}
                                onChangeFunction={handleInputChange}
                            />
                            <InputField
                                label="Start Date"
                                name="startDate"
                                placeholder="2026-02-08"
                                type="date"
                                value={formValues.startDate}
                                onChangeFunction={handleInputChange}
                                required
                            />
                            <InputField
                                label="End Date"
                                name="endDate"
                                placeholder="2026-02-15"
                                type="date"
                                value={formValues.endDate}
                                onChangeFunction={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Owner Name"
                                name="ownerName"
                                placeholder="Roddo"
                                value={formValues.ownerName}
                                onChangeFunction={handleInputChange}
                                required
                            />
                            <InputField
                                label="Owner Phone"
                                name="ownerPhone"
                                placeholder="+1 234 567 8900"
                                type="tel"
                                value={formValues.ownerPhone}
                                onChangeFunction={handleInputChange}
                                required
                            />
                            <InputField
                                label="Owner Email"
                                name="ownerEmail"
                                placeholder="john@example.com"
                                type="email"
                                value={formValues.ownerEmail}
                                onChangeFunction={handleInputChange}
                            />
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextareaField
                                label="Medical Notes"
                                name="medicalNotes"
                                placeholder="Any medical conditions, medications..."
                                value={formValues.medicalNotes}
                                onChangeFunction={handleInputChange}
                            />
                            <TextareaField
                                label="Allergies"
                                name="allergies"
                                placeholder="Known allergies..."
                                value={formValues.allergies}
                                onChangeFunction={handleInputChange}
                            />
                            <TextareaField
                                label="Feeding Instructions"
                                name="feedingInstructions"
                                placeholder="Diet, feeding schedule..."
                                value={formValues.feedingInstructions}
                                onChangeFunction={handleInputChange}
                            />
                            <TextareaField
                                label="Special Care Instructions"
                                name="specialCareInstructions"
                                placeholder="Any special care needs..."
                                value={formValues.specialCareInstructions}
                                onChangeFunction={handleInputChange}
                            />
                        </div>
                    )}

                    <div className="flex justify-between mt-6">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                Previous
                            </button>
                        ) : (
                            <div />
                        )}

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={!isStepValid()}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    isStepValid()
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                }`}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Add Boarder
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
};

const AddBoarder = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-emerald-600 text-white flex items-center justify-center px-4 py-2 rounded-xl hover:cursor-pointer hover:-translate-y-1 transition-all ease-in-out duration-150"
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
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                Add New Boarder
            </button>
            {isOpen && <BoarderModal setIsOpen={setIsOpen} />}
        </>
    );
};

export default AddBoarder;
