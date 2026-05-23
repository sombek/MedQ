import { z } from "zod";

export type QuestionRow = {
  id: string;
  specialty: string;
  stem: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
};

/**
 * Returns a question the user has NOT yet answered, picked at random.
 * Returns null when there are no more unanswered questions.
 *
 * Uses Math.random by default; pass a custom rng for deterministic tests.
 */
export function pickNextQuestion(
  questions: QuestionRow[],
  answeredIds: Set<string>,
  rng: () => number = Math.random
): QuestionRow | null {
  const remaining = questions.filter((q) => !answeredIds.has(q.id));
  if (remaining.length === 0) return null;
  const idx = Math.floor(rng() * remaining.length);
  return remaining[idx];
}

/**
 * Splits a comma-separated tag string into normalized tags.
 * - Lowercased
 * - Trimmed
 * - Empty entries removed
 * - Duplicates removed
 */
export function normalizeTags(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(",")) {
    const tag = raw.trim().toLowerCase();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
}

const MAX_STEM_LEN = 4000;
const MAX_CHOICE_LEN = 500;
const MAX_EXPLANATION_LEN = 4000;
const MAX_TAG_LEN = 40;
const MAX_TAGS = 10;

/**
 * Zod schema for the admin question form. Accepts a raw comma-separated
 * tags string and validates it via normalizeTags.
 */
export const questionFormSchema = z.object({
  specialty: z.string().min(1),
  stem: z.string().min(1).max(MAX_STEM_LEN),
  choices: z
    .array(z.string().min(1).max(MAX_CHOICE_LEN))
    .length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(1).max(MAX_EXPLANATION_LEN),
  tagsInput: z
    .string()
    .min(1)
    .refine((value) => {
      const tags = normalizeTags(value);
      return (
        tags.length > 0 &&
        tags.length <= MAX_TAGS &&
        tags.every((t) => t.length <= MAX_TAG_LEN)
      );
    }),
  isPublished: z.boolean(),
});

export type QuestionFormValues = z.infer<typeof questionFormSchema>;
