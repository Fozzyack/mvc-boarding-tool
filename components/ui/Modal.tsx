"use client";

import { ReactNode } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/utils/cn";

interface ModalProps {
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
    contentClassName?: string;
}

const Modal = ({
    title,
    description,
    onClose,
    children,
    contentClassName,
}: ModalProps) => {
    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div className="ui-modal-backdrop">
            <div onClick={onClose} className="absolute inset-0" />
            <div className={cn("ui-modal-panel", contentClassName)}>
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h4 className="text-lg font-semibold text-text">{title}</h4>
                        {description ? <p className="text-sm text-text-muted">{description}</p> : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close modal"
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
                {children}
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
