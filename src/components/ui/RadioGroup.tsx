interface RadioGroupProps {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
}: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="h-4 w-4 cursor-pointer border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700"
          />
          <span className="text-sm text-gray-700 dark:text-neutral-300">
            {option}
          </span>
        </label>
      ))}
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
