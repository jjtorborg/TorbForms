"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Question } from "@/db/schema";
import { buildViewSchema, SubmitFormInput } from "@/lib/validators";
import { FormHeader } from "./FormHeader";
import { QuestionField } from "./QuestionField";
import { SubmissionSuccess } from "./SubmissionSuccess";
import { Button } from "@/components/ui/Button";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

interface FormViewerProps {
  form: Form;
  questions: Question[];
}

export function FormViewer({ form, questions }: FormViewerProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = buildViewSchema(questions);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Record<string, string | string[]>>({
    resolver: zodResolver(schema) as Resolver<
      Record<string, string | string[]>
    >,
  });

  useUnsavedChanges(isDirty && !submitted);

  async function onSubmit(data: Record<string, string | string[]>) {
    setSubmitError(null);

    const payload: SubmitFormInput = {
      formId: form.id,
      answers: Object.entries(data).map(([questionId, value]) => ({
        questionId,
        value,
      })),
    };

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      setSubmitError(err.error ?? "Submission failed. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return <SubmissionSuccess />;
  }

  return (
    <div className="space-y-8">
      <FormHeader title={form.title} description={form.description} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            control={control}
            errors={errors}
          />
        ))}

        {submitError && (
          <p className="text-sm text-red-500 rounded-md border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            {submitError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
