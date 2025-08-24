import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMemories = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("memories").order("desc").collect();
  },
});

export const addMemory = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    driveUrl: v.string(),
    originalSize: v.number(),
    compressedSize: v.number(),
    uploadDate: v.string(),
    likes: v.number(),
    tags: v.array(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("memories", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateMemory = mutation({
  args: {
    id: v.id("memories"),
    likes: v.optional(v.number()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx: any, args: any) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteMemory = mutation({
  args: {
    id: v.id("memories"),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.delete(args.id);
  },
});
