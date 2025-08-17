import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for images
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if user is authenticated with Clerk
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Get file URL from storage ID
export const getFileUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});

// Get multiple file URLs
export const getFileUrls = query({
  args: { fileIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    const urls = await Promise.all(
      args.fileIds.map(async (fileId) => {
        const url = await ctx.storage.getUrl(fileId);
        return { fileId, url };
      })
    );
    return urls;
  },
});

// Delete a file from storage
export const deleteFile = mutation({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    // Check if user is authenticated with Clerk
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.storage.delete(args.fileId);
  },
});