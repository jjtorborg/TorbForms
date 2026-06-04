"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { Question } from "@/db/schema";
import { QuestionType } from "@/lib/constants";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { CheckboxGroup } from "@/components/ui/CheckboxGroup";

interface QuestionFieldProps {
  question: Question;
  control: Control<Record<string, string | string[]>>;
  errors: FieldErrors<Record<string, string | string[]>>;
}

export function QuestionField({
  question,
  control,
  errors,
}: QuestionFieldProps) {
  const error = (errors[question.id] as { message?: string } | undefined)
    ?.message;
  const options = question.options ?? [];

  return (
    <div className="space-y-2">
      <Label required={question.required}>{question.label}</Label>
      {question.description && (
        <p className="text-xs text-gray-500 dark:text-neutral-500">
          {question.description}
        </p>
      )}

      <Controller
        control={control}
        name={question.id}
        defaultValue={question.type === QuestionType.MultipleChoice ? [] : ""}
        render={({ field }) => {
          switch (question.type) {
            case QuestionType.FreeResponse:
              return (
                <Textarea
                  value={field.value as string}
                  onChange={(event) => field.onChange(event.target.value)}
                  error={error}
                  placeholder="Type your response here"
                />
              );

            case QuestionType.SingleChoiceDropdown:
              return (
                <Select
                  value={field.value as string}
                  onChange={(event) => field.onChange(event.target.value)}
                  options={options.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  placeholder="Select one"
                  error={error}
                />
              );

            case QuestionType.SingleChoiceRadio:
              return (
                <RadioGroup
                  name={question.id}
                  options={options}
                  value={field.value as string}
                  onChange={field.onChange}
                  error={error}
                />
              );

            case QuestionType.MultipleChoice:
              return (
                <CheckboxGroup
                  options={options}
                  value={field.value as string[]}
                  onChange={field.onChange}
                  error={error}
                />
              );

            default:
              return <></>;
          }
        }}
      />
    </div>
  );
}
