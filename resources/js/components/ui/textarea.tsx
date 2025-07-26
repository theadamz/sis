import * as React from "react";

import { cn } from "@/lib/utils";
import InputError from "../input-error";

interface TextAreaProps {
    error?: string;
    showErrorMessage?: boolean;
}

function Textarea({ className, error, showErrorMessage = true, ...props }: React.ComponentProps<"textarea"> & TextAreaProps) {
  return (
    <>
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        error ? "border-red-500" : "",
        className
      )}
      {...props}
    />
    {error && showErrorMessage && <InputError message={error} />}
    </>
  )
}

export { Textarea };

