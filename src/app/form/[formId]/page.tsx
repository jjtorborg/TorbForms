import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { forms, questions } from "@/db/schema";
import { FormViewer } from "@/components/form/FormViewer";
import { UUID_REGEX } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface FormPageProps {
  params: Promise<{ formId: string }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { formId } = await params;

  if (!UUID_REGEX.test(formId)) {
    notFound();
  }

  const db = getDb();
  const [form] = await db.select().from(forms).where(eq(forms.id, formId));

  if (!form) {
    notFound();
  }

  const formQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.formId, formId))
    .orderBy(asc(questions.position));

  return (
    <main className="min-h-screen py-10 px-4 bg-gray-100 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <FormViewer form={form} questions={formQuestions} />
      </div>
    </main>
  );
}
