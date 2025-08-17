import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - synced with Clerk authentication
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    district: v.optional(v.string()),
    userType: v.union(v.literal("buyer"), v.literal("seller"), v.literal("both")),
    phoneVerified: v.optional(v.boolean()),
    reputation: v.number(), // 0-100 score
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  // Listings table - vehicle listings
  listings: defineTable({
    userId: v.id("users"),
    
    // Basic Info
    title: v.string(),
    year: v.number(),
    make: v.string(),
    model: v.string(),
    trim: v.optional(v.string()),
    price: v.number(), // BZD
    
    // Title & Import Info
    titleType: v.union(v.literal("clean"), v.literal("salvage"), v.literal("rebuilt")),
    importedFromUS: v.boolean(),
    
    // Specs
    mileage: v.number(),
    transmission: v.union(v.literal("manual"), v.literal("automatic"), v.literal("cvt")),
    fuelType: v.union(v.literal("gasoline"), v.literal("diesel"), v.literal("hybrid"), v.literal("electric")),
    
    // Location
    district: v.string(),
    
    // Vehicle Details
    knownIssues: v.array(v.string()),
    hasNoKnownIssues: v.boolean(),
    
    // Media
    photos: v.array(v.string()), // URLs to photos
    hasRequiredPhotos: v.boolean(),
    coldStartVideo: v.optional(v.string()),
    
    // VIN (optional for now)
    vin: v.optional(v.string()),
    vinVerified: v.optional(v.boolean()),
    
    // Computed scores
    completenessScore: v.number(), // 0-100
    
    // Status
    isActive: v.boolean(),
    isSold: v.boolean(),
    
    // Metrics
    viewCount: v.number(),
    messageCount: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_district", ["district"])
    .index("by_titleType", ["titleType"])
    .index("by_isActive", ["isActive"])
    .index("by_createdAt", ["createdAt"]),

  // Reviews table - thumbs up/down system
  reviews: defineTable({
    listingId: v.id("listings"),
    reviewerId: v.id("users"),
    sellerId: v.id("users"),
    
    // Review data
    isPositive: v.boolean(), // thumbs up/down
    reason: v.optional(v.string()), // preset reason for negative reviews
    comment: v.optional(v.string()), // max 140 chars
    isAnonymous: v.boolean(),
    
    // Verification
    meetupVerified: v.boolean(), // only verified meetups can review
    
    // Evidence
    evidencePhoto: v.optional(v.string()),
    
    // Moderation
    isUpheld: v.optional(v.boolean()),
    moderatorId: v.optional(v.id("users")),
    moderatedAt: v.optional(v.number()),
    
    createdAt: v.number(),
  })
    .index("by_listingId", ["listingId"])
    .index("by_sellerId", ["sellerId"])
    .index("by_reviewerId", ["reviewerId"]),

  // Messages table - in-app chat
  messages: defineTable({
    conversationId: v.string(), // generated from listingId + participants
    listingId: v.id("listings"),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    
    content: v.string(),
    messageType: v.union(v.literal("text"), v.literal("quick_prompt")),
    
    // Quick prompts
    promptType: v.optional(v.union(
      v.literal("title_status"),
      v.literal("oil_leaks"),
      v.literal("service_date"),
      v.literal("cold_start_video")
    )),
    
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_listingId", ["listingId"])
    .index("by_senderId", ["senderId"])
    .index("by_receiverId", ["receiverId"]),

  // Meetup Verifications table - QR code meetups
  meetupVerifications: defineTable({
    listingId: v.id("listings"),
    sellerId: v.id("users"),
    buyerId: v.id("users"),
    
    // QR Code data
    qrCodeNonce: v.string(), // unique nonce for this meetup
    
    // Verification status
    isVerified: v.boolean(),
    verifiedAt: v.optional(v.number()),
    
    createdAt: v.number(),
  })
    .index("by_listingId", ["listingId"])
    .index("by_sellerId", ["sellerId"])
    .index("by_qrCodeNonce", ["qrCodeNonce"]),
});