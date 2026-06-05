import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "cursor-pointer focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

export function SubmitButton({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${base} inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${className}`}
    >
      {children}
    </button>
  );
}

export function AddItemButton({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${base} inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-700 ${className}`}
    >
      {children}
    </button>
  );
}

export function ActionButton({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${base} inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 dark:text-neutral-400 dark:hover:bg-neutral-800 ${className}`}
    >
      {children}
    </button>
  );
}
