import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserLocations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("userLocations").collect();
  },
});

export const updateUserLocation = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check if user location already exists
    const existing = await ctx.db
      .query("userLocations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existing) {
      // Update existing location
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
    } else {
      // Create new location entry
      await ctx.db.insert("userLocations", {
        ...args,
        updatedAt: Date.now(),
      });
    }
  },
});

export const updateUserStatus = mutation({
  args: {
    userId: v.string(),
    status: v.string(),
    currentActivity: v.string(),
    lastSeen: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userLocations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        currentActivity: args.currentActivity,
        lastSeen: args.lastSeen,
        updatedAt: Date.now(),
      });
    }
  },
});
