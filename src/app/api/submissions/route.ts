import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { forms, questions, submissions, answers } from "@/db/schema";
import { submitFormSchema } from "@/lib/validators";
import { ApiError } from "@/lib/constants";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: ApiError.InvalidJson }, { status: 400 });
  }

  const result = submitFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: ApiError.ValidationFailed, details: result.error.issues },
      { status: 400 },
    );
  }

  const { formId, answers: answerInputs } = result.data;

  try {
    const db = getDb();

    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    if (!form) {
      return NextResponse.json({ error: ApiError.FormNotFound }, { status: 404 });
    }

    const formQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.formId, formId));

    const validQuestionIds = new Set(
      formQuestions.map((question) => question.id),
    );

    const foreignAnswers = answerInputs.filter(
      (answer) => !validQuestionIds.has(answer.questionId),
    );
    if (foreignAnswers.length > 0) {
      return NextResponse.json(
        { error: "Answers reference invalid question IDs" },
        { status: 400 },
      );
    }

    const missing = formQuestions
      .filter((question) => question.required)
      .filter((question) => {
        const answer = answerInputs.find(
          (answer) => answer.questionId === question.id,
        );
        if (!answer) return true;
        const answerValue = answer.value;
        return Array.isArray(answerValue)
          ? answerValue.length === 0
          : answerValue.trim() === "";
      })
      .map((question) => question.id);

    if (missing.length > 0) {
      return NextResponse.json(
        { error: "Missing required answers", missing },
        { status: 400 },
      );
    }

    const [submission] = await db
      .insert(submissions)
      .values({ formId })
      .returning({ id: submissions.id });

    if (answerInputs.length > 0) {
      await db.insert(answers).values(
        answerInputs.map((answer) => ({
          submissionId: submission.id,
          questionId: answer.questionId,
          value: answer.value,
        })),
      );
    }

    return NextResponse.json({ submissionId: submission.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/submissions error:", err);
    return NextResponse.json(
      { error: ApiError.InternalServerError },
      { status: 500 },
    );
  }
}
