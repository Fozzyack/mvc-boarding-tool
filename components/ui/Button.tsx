import { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md";
}

const Button = ({
    variant = "primary",
    size = "md",
    className,
    type = "button",
    ...props
}: ButtonProps) => {
    const variantClass = {
        primary: "ui-button-primary",
        secondary: "ui-button-secondary",
        ghost: "ui-button-ghost",
    }[variant];

    const sizeClass = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-2.5",
    }[size];

    return (
        <button
            type={type}
            className={cn("ui-button-base", variantClass, sizeClass, className)}
            {...props}
        />
    );
};

export default Button;
