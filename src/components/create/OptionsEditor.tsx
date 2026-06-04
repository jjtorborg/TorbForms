"use client";

import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface OptionsEditorProps {
  fields: { id: string }[];
  append: (value: string) => void;
  remove: (index: number) => void;
  registerOption: (index: number) => UseFormRegisterReturn;
  error?: string;
}

export function OptionsEditor({
  fields,
  append,
  remove,
  registerOption,
  error,
}: OptionsEditorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide dark:text-neutral-400">
        Options
      </p>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Input
            {...registerOption(index)}
            placeholder={`Option ${index + 1}`}
          />
          <Button
            type="button"
            variant="transparent-background"
            className="shrink-0 px-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            onClick={() => remove(index)}
          >
            ✕
          </Button>
        </div>
      ))}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
      <Button
        type="button"
        variant="secondary"
        className="text-xs"
        onClick={() => append("")}
      >
        + Add option
      </Button>
    </div>
  );
}
