import { forwardRef, TextareaHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return <textarea ref={ref} className={cn("ui-textarea", className)} {...props} />;
    },
);

Textarea.displayName = "Textarea";

export default Textarea;
