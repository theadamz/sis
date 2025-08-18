import * as React from "react";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import InputError from "../input-error";
import { Button } from "./button";

interface InputLOVProps {
    error?: string;
    showErrorMessage?: boolean;
    onSearchClick?: () => void;
    valueDisplay: string | number | undefined;
}

function InputLOV({ className, type, error, onSearchClick,valueDisplay, showErrorMessage = true, ...props }: React.ComponentProps<"input"> & InputLOVProps) {
  return (
    <>
    <div className="flex items-center">
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border border-input border-r-0 rounded-l-md file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 min-w-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        error ? "border-red-500" : "",
        className
      )}
      value={valueDisplay}
      readOnly
      {...props}
    />
    <Button
        type="button"
        className={cn("rounded-l-none rounded-r-md", error ? "border-red-500" : "")}
        variant={"outline"}
        onClick={onSearchClick}
    >
        <SearchIcon className="size-4 stroke-black" />
    </Button>
    </div>
    {error && showErrorMessage && <InputError message={error} />}
    </>
  )
}

export { InputLOV };

