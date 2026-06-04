"use client";

import { QUESTION_TYPE_LABELS } from "@/lib/constants";
import {
  UseFormRegister,
  Control,
  Controller,
  FieldErrors,
  useWatch,
  useFieldArray,
  ArrayPath,
  Path,
} from "react-hook-form";
import { CreateFormInput } from "@/lib/validators";
import { QuestionType } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { OptionsEditor } from "./OptionsEditor";

interface QuestionCardProps {
  index: number;
  register: UseFormRegister<CreateFormInput>;
  control: Control<CreateFormInput>;
  errors: FieldErrors<CreateFormInput>;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function QuestionCard({
  index,
  register,
  control,
  errors,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: QuestionCardProps) {
  const questionErrors = errors.questions?.[index];
  const selectedType = useWatch({ control, name: `questions.${index}.type` });
  const needsOptions =
    selectedType !== QuestionType.FreeResponse && selectedType !== undefined;

  const {
    fields: optionFields,
    append: appendOptionRaw,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${index}.options` as ArrayPath<CreateFormInput>,
  });
  const appendOption = appendOptionRaw as unknown as (value: string) => void;

  const optionError = (
    questionErrors?.options as { message?: string } | undefined
  )?.message;

  const registerOption = (optionIndex: number) =>
    register(
      `questions.${index}.options.${optionIndex}` as Path<CreateFormInput>,
    );

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm space-y-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500 dark:text-neutral-400">
          Question {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="transparent-background"
            className="px-2 py-1 text-xs"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            ↑
          </Button>
          <Button
            type="button"
            variant="transparent-background"
            className="px-2 py-1 text-xs"
            onClick={onMoveDown}
            disabled={isLast}
          >
            ↓
          </Button>
          <Button
            type="button"
            variant="transparent-background"
            className="px-2 py-1 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            onClick={onRemove}
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={`q-label-${index}`} required>
          Question label
        </Label>
        <Input
          id={`q-label-${index}`}
          placeholder="e.g. What grade level is the student enrolling in?"
          error={questionErrors?.label?.message}
          {...register(`questions.${index}.label`)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={`q-desc-${index}`}>Description (optional)</Label>
        <Textarea
          id={`q-desc-${index}`}
          placeholder="e.g. Select the grade the student will be entering this fall."
          rows={2}
          {...register(`questions.${index}.description`)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor={`q-type-${index}`} required>
            Question type
          </Label>
          <Controller
            control={control}
            name={`questions.${index}.type`}
            render={({ field }) => (
              <Dropdown
                id={`q-type-${index}`}
                options={Object.entries(QUESTION_TYPE_LABELS).map(
                  ([value, label]) => ({ value, label }),
                )}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register(`questions.${index}.required`)}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700"
            />
            <span className="text-sm text-gray-700 dark:text-neutral-300">
              Required
            </span>
          </label>
        </div>
      </div>

      {needsOptions && (
        <OptionsEditor
          fields={optionFields}
          append={appendOption}
          remove={removeOption}
          registerOption={registerOption}
          error={optionError}
        />
      )}
    </div>
  );
}
