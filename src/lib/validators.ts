import { z } from "zod";
import { QuestionType } from "./constants";

export const questionTypeSchema = z.enum(QuestionType);

// Create Form

export const createQuestionSchema = z
  .object({
    label: z.string().min(1, "Question label is required"),
    description: z.string().optional(),
    type: questionTypeSchema,
    required: z.boolean().default(false),
    position: z.number().int().nonnegative(),
    options: z.array(z.string().min(1, "Option cannot be empty")).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== QuestionType.FreeResponse) {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message: "Choice questions require at least 2 options",
        });
      }
    }
  });

export const createFormSchema = z.object({
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  questions: z.array(createQuestionSchema).min(1, "Add at least one question"),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;

// Submit Answers

export const submitAnswerSchema = z.object({
  questionId: z.uuid(),
  value: z.union([z.string(), z.array(z.string())]),
});

export const submitFormSchema = z.object({
  formId: z.uuid(),
  answers: z.array(submitAnswerSchema),
});

export type SubmitFormInput = z.infer<typeof submitFormSchema>;

// View-page dynamic schema builder

export type ViewQuestion = {
  id: string;
  type: string;
  required: boolean;
};

const REQUIRED_FIELD_MSG = "This question is required";

export function buildViewSchema(questions: ViewQuestion[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const question of questions) {
    let field: z.ZodTypeAny;

    if (question.type === QuestionType.MultipleChoice) {
      const base = z.array(z.string());
      field = question.required ? base.min(1, REQUIRED_FIELD_MSG) : base;
    } else {
      const base = z.string();
      field = question.required ? base.min(1, REQUIRED_FIELD_MSG) : base;
    }
    shape[question.id] = field;
  }

  return z.object(shape);
}
