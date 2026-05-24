import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),

    profiles: i.entity({
      displayName: i.string().optional(),
      isAdmin: i.boolean().indexed(),
      isActive: i.boolean().indexed(),
      createdAt: i.date().indexed(),
    }),

    questions: i.entity({
      specialty: i.string().indexed(),
      stem: i.string(),
      choices: i.json<string[]>(),
      correctIndex: i.number(),
      explanation: i.string(),
      tags: i.json<string[]>().indexed(),
      isPublished: i.boolean().indexed(),
      createdAt: i.date().indexed(),
    }),

    answers: i.entity({
      selectedIndex: i.number(),
      isCorrect: i.boolean().indexed(),
      answeredAt: i.date().indexed(),
      userId: i.string().indexed(),
    }),

    subscriptions: i.entity({
      userId: i.string().indexed(),
      planId: i.string().indexed(),
      status: i.string().indexed(),
      startsAt: i.date().indexed(),
      endsAt: i.date().indexed(),
      lastPaymentId: i.string().indexed(),
      createdAt: i.date().indexed(),
      updatedAt: i.date().indexed(),
    }),

    payments: i.entity({
      userId: i.string().indexed(),
      planId: i.string().indexed(),
      moyasarPaymentId: i.string().indexed(),
      amount: i.number(),
      currency: i.string().indexed(),
      status: i.string().indexed(),
      paidAt: i.date().optional().indexed(),
      sourceType: i.string().optional().indexed(),
      sourceCompany: i.string().optional(),
      sourceLast4: i.string().optional(),
      tokenId: i.string().optional().indexed(),
      rawMeta: i.json<Record<string, unknown>>().optional(),
      createdAt: i.date().indexed(),
    }),

    dailyUsage: i.entity({
      userId: i.string().indexed(),
      dateKey: i.string().indexed(),
      questionsCount: i.number(),
      updatedAt: i.date().indexed(),
    }),
  },

  links: {
    userProfile: {
      forward: { on: "$users", has: "one", label: "profile" },
      reverse: { on: "profiles", has: "one", label: "user" },
    },
    questionCreator: {
      forward: { on: "questions", has: "one", label: "createdBy" },
      reverse: { on: "$users", has: "many", label: "createdQuestions" },
    },
    answerUser: {
      forward: { on: "answers", has: "one", label: "user" },
      reverse: { on: "$users", has: "many", label: "answers" },
    },
    answerQuestion: {
      forward: { on: "answers", has: "one", label: "question" },
      reverse: { on: "questions", has: "many", label: "answers" },
    },
  },
});

type _AppSchema = typeof _schema;
type AppSchema = _AppSchema;
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
