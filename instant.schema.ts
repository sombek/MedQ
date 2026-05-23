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
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
