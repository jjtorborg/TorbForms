"use client";

import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { ActionButton, AddItemButton } from "@/components/ui/Button";

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
          <ActionButton
            type="button"
            className="shrink-0 px-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            onClick={() => remove(index)}
          >
            ✕
          </ActionButton>
        </div>
      ))}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
      <AddItemButton
        type="button"
        className="text-xs"
        onClick={() => append("")}
      >
        + Add option
      </AddItemButton>
    </div>
  );
}
