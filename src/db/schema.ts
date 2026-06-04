import { QuestionType } from "@/lib/constants";
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

export const questionTypeEnum = pgEnum("question_type", [
  QuestionType.FreeResponse,
  QuestionType.SingleChoiceDropdown,
  QuestionType.SingleChoiceRadio,
  QuestionType.MultipleChoice,
]);

export const forms = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    description: text("description"),
    type: questionTypeEnum("type").notNull(),
    required: boolean("required").notNull().default(false),
    position: integer("position").notNull(),
    options: jsonb("options").$type<string[]>(),
  },
  (columns) => [unique().on(columns.formId, columns.position)],
);

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  value: jsonb("value").notNull().$type<string | string[]>(),
});

export type Form = typeof forms.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Answer = typeof answers.$inferSelect;
