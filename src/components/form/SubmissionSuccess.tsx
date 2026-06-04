export function SubmissionSuccess() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="rounded-lg border border-green-700 bg-green-700 p-8 text-center dark:border-green-800 dark:bg-green-950">
        <div className="text-4xl mb-3 text-green-100 dark:text-green-300">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-green-100 dark:text-green-300">
          Response submitted
        </h2>
        <p className="mt-2 text-sm text-green-200 dark:text-green-400">
          Thank you for filling out this form.
        </p>
      </div>
    </div>
  );
}
