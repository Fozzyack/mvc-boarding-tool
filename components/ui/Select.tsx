import { forwardRef, SelectHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
    ({ className, ...props }, ref) => {
        return <select ref={ref} className={cn("ui-input", className)} {...props} />;
    },
);

Select.displayName = "Select";

export default Select;
