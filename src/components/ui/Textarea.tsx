import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", ...props }, ref) => (
    <div>
      <textarea
        ref={ref}
        rows={3}
        {...props}
        className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 dark:border-neutral-700"
        } ${className}`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  ),
);
Textarea.displayName = "Textarea";
