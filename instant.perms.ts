import type { InstantRules } from "@instantdb/react";

const rules = {
  $default: {
    allow: { $default: "false" },
  },

  $users: {
    allow: {
      view: "auth.id == data.id || isAdmin",
      create: "auth.id != null",
      update: "auth.id == data.id || isAdmin",
      delete: "false",
    },
    bind: {
      isAdmin: "true in auth.ref('$user.profile.isAdmin')",
    },
  },

  profiles: {
    allow: {
      view: "isOwnProfile || isAdmin",
      create: "isCreatingOwnSafe",
      update: "isAdmin || isOwnSafeUpdate",
      delete: "isAdmin",
    },
    bind: {
      isOwnProfile: "auth.id in data.ref('user.id')",
      isAdmin: "true in auth.ref('$user.profile.isAdmin')",
      isCreatingOwnSafe: "auth.id != null",
      isOwnSafeUpdate:
        "auth.id in data.ref('user.id') && newData.isAdmin == data.isAdmin && newData.isActive == data.isActive",
    },
  },

  questions: {
    allow: {
      view: "(isActiveUser && data.isPublished == true) || isAdmin",
      create: "isAdmin",
      update: "isAdmin",
      delete: "isAdmin",
    },
    bind: {
      isAdmin: "true in auth.ref('$user.profile.isAdmin')",
      isActiveUser: "true in auth.ref('$user.profile.isActive')",
    },
  },

  answers: {
    allow: {
      view: "isOwner || isAdmin",
      create: "isCreatingOwn && isActiveUser",
      update: "false",
      delete: "isAdmin",
    },
    bind: {
      isOwner: "auth.id in data.ref('user.id')",
      isCreatingOwn: "auth.id in newData.ref('user.id')",
      isActiveUser: "true in auth.ref('$user.profile.isActive')",
      isAdmin: "true in auth.ref('$user.profile.isAdmin')",
    },
  },
} satisfies InstantRules;

export default rules;
