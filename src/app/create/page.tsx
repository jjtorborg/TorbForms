"use client";

import { useState } from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateFormInput, createFormSchema } from "@/lib/validators";
import { QuestionType } from "@/lib/constants";
import { QuestionCard } from "@/components/create/QuestionCard";
import { SubmitButton, AddItemButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FieldLabel } from "@/components/ui/Label";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

export default function CreatePage() {
  const [formCreated, setFormCreated] = useState(false);

  function defaultQuestion(
    position: number,
  ): CreateFormInput["questions"][number] {
    return {
      label: "",
      description: "",
      type: QuestionType.FreeResponse,
      required: false,
      position,
      options: [],
    };
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CreateFormInput>({
    resolver: zodResolver(createFormSchema) as Resolver<CreateFormInput>,
    defaultValues: {
      title: "",
      description: "",
      questions: [defaultQuestion(0)],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "questions",
  });

  useUnsavedChanges(isDirty && !formCreated);

  async function onSubmit(data: CreateFormInput) {
    const payload: CreateFormInput = {
      ...data,
      questions: data.questions.map((question, index) => ({
        ...question,
        position: index,
      })),
    };

    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Failed to create form: ${err.error}`);
      return;
    }

    const { formId } = await res.json();
    setFormCreated(true);
    window.open(`/form/${formId}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-gray-200 py-10 px-4 dark:bg-black">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
            Create a form
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Build your form below, then share the link with respondents.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 shadow-sm space-y-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="space-y-1">
              <FieldLabel htmlFor="title" required>
                Form title
              </FieldLabel>
              <Input
                id="title"
                placeholder="e.g. Fall Semester Student Enrollment"
                error={errors.title?.message}
                {...register("title")}
              />
            </div>
            <div className="space-y-1">
              <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
              <Textarea
                id="description"
                placeholder="Collect information from incoming students for the upcoming semester."
                {...register("description")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
              Questions
            </h2>

            {errors.questions?.root?.message && (
              <p className="text-sm text-red-500">
                {errors.questions.root.message}
              </p>
            )}
            {typeof errors.questions?.message === "string" && (
              <p className="text-sm text-red-500">{errors.questions.message}</p>
            )}

            {fields.map((field, index) => (
              <QuestionCard
                key={field.id}
                index={index}
                register={register}
                control={control}
                errors={errors}
                onRemove={() => remove(index)}
                onMoveUp={() => move(index, index - 1)}
                onMoveDown={() => move(index, index + 1)}
                isFirst={index === 0}
                isLast={index === fields.length - 1}
              />
            ))}

            <AddItemButton
              type="button"
              onClick={() => append(defaultQuestion(fields.length))}
            >
              + Add question
            </AddItemButton>
          </div>

          <SubmitButton type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create form"}
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
