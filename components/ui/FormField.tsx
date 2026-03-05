import { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    htmlFor: string;
    required?: boolean;
    children: ReactNode;
}

const FormField = ({ label, htmlFor, required = false, children }: FormFieldProps) => {
    return (
        <div className="mb-3">
            <label htmlFor={htmlFor} className="ui-field-label">
                {label}
                {required ? (
                    <span className="ui-required">*</span>
                ) : (
                    <span className="ui-field-help">(optional)</span>
                )}
            </label>
            {children}
        </div>
    );
};

export default FormField;
