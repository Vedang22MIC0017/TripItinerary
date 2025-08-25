import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  expenses: defineTable({
    title: v.string(),
    amount: v.number(),
    paidBy: v.string(),
    splitBetween: v.array(v.string()),
    category: v.string(),
    description: v.optional(v.string()),
    billImage: v.optional(v.string()),
    date: v.string(),
    createdAt: v.number(),
  }),

  payments: defineTable({
    from: v.string(),
    to: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    date: v.string(),
    createdAt: v.number(),
  }),

  documents: defineTable({
    name: v.string(),
    type: v.string(),
    size: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    fileUrl: v.optional(v.string()),
    previewUrl: v.optional(v.string()),
    uploadDate: v.string(),
    createdAt: v.number(),
  }),

  userLocations: defineTable({
    userId: v.string(),
    name: v.string(),
    avatar: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    status: v.string(),
    currentActivity: v.string(),
    lastSeen: v.string(),
    updatedAt: v.number(),
  }),
});
