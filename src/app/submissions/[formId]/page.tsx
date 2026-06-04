import { notFound } from "next/navigation";
import { eq, asc, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { forms, questions, submissions, answers } from "@/db/schema";
import { UUID_REGEX } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface SubmissionsPageProps {
  params: Promise<{ formId: string }>;
}

function formatValue(value: string | string[] | undefined): string {
  if (value === undefined) return "-";
  return Array.isArray(value) ? value.join(", ") : value;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function SubmissionsPage({ params }: SubmissionsPageProps) {
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

  const formSubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.formId, formId))
    .orderBy(desc(submissions.submittedAt));

  const formAnswers = await db
    .select({
      id: answers.id,
      submissionId: answers.submissionId,
      questionId: answers.questionId,
      value: answers.value,
    })
    .from(answers)
    .innerJoin(submissions, eq(answers.submissionId, submissions.id))
    .where(eq(submissions.formId, formId));

  const answersMap = new Map<string, Map<string, string | string[]>>();
  for (const answer of formAnswers) {
    if (!answersMap.has(answer.submissionId)) {
      answersMap.set(answer.submissionId, new Map());
    }
    answersMap.get(answer.submissionId)!.set(answer.questionId, answer.value);
  }

  const count = formSubmissions.length;

  return (
    <main className="min-h-screen bg-gray-200 py-10 px-4 dark:bg-black">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
            {form.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            {count === 0
              ? "No submissions yet"
              : `${count} submission${count === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {count === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500 dark:text-neutral-400">
              Submissions will appear here once respondents complete the form.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-neutral-800">
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                      Submitted at
                    </th>
                    {formQuestions.map((questions) => (
                      <th
                        key={questions.id}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400"
                      >
                        {questions.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {formSubmissions.map((submission) => {
                    const submissionAnswers = answersMap.get(submission.id);
                    return (
                      <tr
                        key={submission.id}
                        className="hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-neutral-400">
                          {formatDate(submission.submittedAt)}
                        </td>
                        {formQuestions.map((q) => (
                          <td
                            key={q.id}
                            className="px-4 py-3 text-gray-800 dark:text-neutral-200"
                          >
                            {formatValue(submissionAnswers?.get(q.id))}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
