export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export enum ApiError {
  InvalidJson = "Invalid JSON",
  ValidationFailed = "Validation failed",
  FormNotFound = "Form not found",
  InternalServerError = "Internal server error",
}

export enum QuestionType {
  FreeResponse = "free_response",
  SingleChoiceDropdown = "single_choice_dropdown",
  SingleChoiceRadio = "single_choice_radio",
  MultipleChoice = "multiple_choice",
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.FreeResponse]: "Free response (text input)",
  [QuestionType.SingleChoiceDropdown]: "Dropdown (single choice)",
  [QuestionType.SingleChoiceRadio]: "Radio buttons (single choice)",
  [QuestionType.MultipleChoice]: "Checkboxes (multiple choice)",
};
