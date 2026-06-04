interface FormHeaderProps {
  title: string;
  description?: string | null;
}

export function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <div className="border-b border-gray-400 pb-4 dark:border-neutral-800">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
          {description}
        </p>
      )}
    </div>
  );
}
