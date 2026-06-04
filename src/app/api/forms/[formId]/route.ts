import { NextRequest, NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { forms, questions } from "@/db/schema";
import { UUID_REGEX, ApiError } from "@/lib/constants";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> },
) {
  const { formId } = await params;

  if (!UUID_REGEX.test(formId)) {
    return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
  }

  try {
    const db = getDb();
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));

    if (!form) {
      return NextResponse.json({ error: ApiError.FormNotFound }, { status: 404 });
    }

    const formQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.formId, formId))
      .orderBy(asc(questions.position));

    return NextResponse.json({ ...form, questions: formQuestions });
  } catch (err) {
    console.error("GET /api/forms/[formId] error:", err);
    return NextResponse.json(
      { error: ApiError.InternalServerError },
      { status: 500 },
    );
  }
}
