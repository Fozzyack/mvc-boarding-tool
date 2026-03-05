"use client";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { useBoardersContext } from "@/contexts/BoardersContext";
import getBackendUrl from "@/utils/getBackendUrl";
import { useState } from "react";

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
        <FormField label={label} htmlFor={name} required={required}>
            <Input
                type={type || "text"}
                id={name}
                name={name}
                value={value}
                onChange={onChangeFunction}
                placeholder={placeholder}
                step={step}
                required={required}
            />
        </FormField>
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
        <FormField label={label} htmlFor={name} required={required}>
            <Textarea
                id={name}
                name={name}
                value={value}
                onChange={onChangeFunction}
                placeholder={placeholder}
                rows={3}
                required={required}
            />
        </FormField>
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

    const step1Required = ["name", "animalType", "startDate", "endDate"];
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

    return (
        <Modal
            title="Add New Boarder"
            description={steps[currentStep - 1].description}
            onClose={() => setIsOpen(false)}
            contentClassName="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
            <div className="mb-6 flex items-center gap-2">
                {steps.map((_, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                index + 1 <= currentStep
                                    ? "bg-brand text-white"
                                    : "bg-slate-200 text-slate-500"
                            }`}
                        >
                            {index + 1}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`mx-1 h-1 w-12 ${
                                    index + 1 < currentStep
                                        ? "bg-brand"
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

                    <div className="mt-6 flex justify-between">
                        {currentStep > 1 ? (
                            <Button type="button" variant="secondary" onClick={prevStep}>
                                Previous
                            </Button>
                        ) : (
                            <div />
                        )}

                        {currentStep < 3 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                disabled={!isStepValid()}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button type="submit">
                                Add Boarder
                            </Button>
                        )}
                    </div>
                </form>
        </Modal>
    );
};

const AddBoarder = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <Button onClick={() => setIsOpen(!isOpen)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                Add New Boarder
            </Button>
            {isOpen && <BoarderModal setIsOpen={setIsOpen} />}
        </>
    );
};

export default AddBoarder;
