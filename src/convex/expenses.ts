import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getExpenses = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("expenses").order("desc").collect();
  },
});

export const addExpense = mutation({
  args: {
    title: v.string(),
    amount: v.number(),
    paidBy: v.string(),
    splitBetween: v.array(v.string()),
    category: v.string(),
    description: v.optional(v.string()),
    billImage: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("expenses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const deleteExpense = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});
