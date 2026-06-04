import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { forms, questions } from "@/db/schema";
import { FormViewer } from "@/components/form/FormViewer";
import { UUID_REGEX } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface FormPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function FormPage({ searchParams }: FormPageProps) {
  const { id } = await searchParams;

  if (!id || !UUID_REGEX.test(id)) {
    notFound();
  }

  const db = getDb();
  const [form] = await db.select().from(forms).where(eq(forms.id, id));

  if (!form) {
    notFound();
  }

  const formQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.formId, id))
    .orderBy(asc(questions.position));

  return (
    <main className="min-h-screen py-10 px-4 bg-gray-100 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <FormViewer form={form} questions={formQuestions} />
      </div>
    </main>
  );
}
