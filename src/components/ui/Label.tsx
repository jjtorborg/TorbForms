import { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  required,
  children,
  className = "",
  ...props
}: LabelProps) {
  return (
    <label
      {...props}
      className={`block text-sm font-medium text-gray-700 dark:text-neutral-300 ${className}`}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-500 dark:text-red-400">*</span>
      )}
    </label>
  );
}
