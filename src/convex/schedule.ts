import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

export const addTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    time: v.string(),
    location: v.string(),
    priority: v.string(),
    assignedTo: v.array(v.string()),
    completed: v.boolean(),
    date: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("tasks", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    priority: v.optional(v.string()),
    assignedTo: v.optional(v.array(v.string())),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx: any, args: any) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteTask = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.delete(args.id);
  },
});
