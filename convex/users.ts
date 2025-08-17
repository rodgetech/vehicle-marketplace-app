import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update user from Clerk webhook
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      userType: "buyer", // default to buyer
      reputation: 100, // start with perfect score
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Complete user profile setup
export const completeProfile = mutation({
  args: {
    clerkId: v.string(),
    district: v.string(),
    userType: v.union(v.literal("buyer"), v.literal("seller"), v.literal("both")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      district: args.district,
      userType: args.userType,
    });

    return user._id;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

// Get user profile
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    if (!user) {
      return null;
    }

    // Calculate reputation metrics (simplified for now)
    const listings = await ctx.db
      .query("listings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const totalListings = listings.length;
    const activeListings = listings.filter(l => l.isActive).length;

    // Get recent reviews for this seller
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_sellerId", (q) => q.eq("sellerId", args.userId))
      .collect();

    const positiveReviews = reviews.filter(r => r.isPositive).length;
    const totalReviews = reviews.length;
    const positivePercentage = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 100;

    return {
      ...user,
      stats: {
        totalListings,
        activeListings,
        totalReviews,
        positivePercentage,
      },
    };
  },
});