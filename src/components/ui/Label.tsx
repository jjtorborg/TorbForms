import { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function FieldLabel({
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

export function CheckboxLabel({
  children,
  className = "",
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={`flex cursor-pointer items-center gap-2 ${className}`}
    >
      {children}
    </label>
  );
}
