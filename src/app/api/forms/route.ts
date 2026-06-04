import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { forms, questions } from "@/db/schema";
import { createFormSchema } from "@/lib/validators";
import { ApiError } from "@/lib/constants";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: ApiError.InvalidJson }, { status: 400 });
  }

  const result = createFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: ApiError.ValidationFailed, details: result.error.issues },
      { status: 400 },
    );
  }

  const { title, description, questions: questionInputs } = result.data;

  try {
    const db = getDb();

    const [form] = await db
      .insert(forms)
      .values({ title, description })
      .returning({ id: forms.id });

    await db.insert(questions).values(
      questionInputs.map((question) => ({
        formId: form.id,
        label: question.label,
        description: question.description,
        type: question.type,
        required: question.required,
        position: question.position,
        options: question.options ?? null,
      })),
    );

    return NextResponse.json({ formId: form.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/forms error:", err);
    return NextResponse.json(
      { error: ApiError.InternalServerError },
      { status: 500 },
    );
  }
}
