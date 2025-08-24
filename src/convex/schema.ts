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

  documents: defineTable({
    name: v.string(),
    type: v.string(),
    size: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    fileUrl: v.optional(v.union(v.string(), v.null())),
    previewUrl: v.optional(v.union(v.string(), v.null())),
    uploadDate: v.string(),
    createdAt: v.number(),
  }),


  memories: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    driveUrl: v.string(),
    originalSize: v.number(),
    compressedSize: v.number(),
    uploadDate: v.string(),
    likes: v.number(),
    tags: v.array(v.string()),
    createdAt: v.number(),
  }),
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    time: v.string(),
    location: v.string(),
    priority: v.string(),
    assignedTo: v.array(v.string()),
    completed: v.boolean(),
    date: v.string(),
    createdAt: v.number(),
  }),
});
