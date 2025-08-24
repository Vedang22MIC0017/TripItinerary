import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDocuments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("documents").order("desc").collect();
  },
});

export const addDocument = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    size: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    fileUrl: v.optional(v.string()),
    previewUrl: v.optional(v.string()),
    uploadDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateDocument = mutation({
  args: {
    id: v.id("documents"),
    name: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
