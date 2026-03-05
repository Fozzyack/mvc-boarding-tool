import { forwardRef, InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type = "text", ...props }, ref) => {
        return <input ref={ref} type={type} className={cn("ui-input", className)} {...props} />;
    },
);

Input.displayName = "Input";

export default Input;
