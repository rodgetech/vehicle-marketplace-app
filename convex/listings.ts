import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all active listings with ranking
export const getListings = query({
  args: {
    district: v.optional(v.string()),
    titleType: v.optional(v.union(v.literal("clean"), v.literal("salvage"), v.literal("rebuilt"))),
    maxPrice: v.optional(v.number()),
    minPrice: v.optional(v.number()),
    sortBy: v.optional(v.union(v.literal("recommended"), v.literal("newest"), v.literal("price_low"), v.literal("price_high"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("listings").withIndex("by_isActive", (q) => q.eq("isActive", true));

    // Apply filters
    let listings = await query.collect();

    // Filter by district
    if (args.district) {
      listings = listings.filter(listing => listing.district === args.district);
    }

    // Filter by title type
    if (args.titleType) {
      listings = listings.filter(listing => listing.titleType === args.titleType);
    }

    // Filter by price range
    if (args.minPrice !== undefined) {
      listings = listings.filter(listing => listing.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      listings = listings.filter(listing => listing.price <= args.maxPrice!);
    }

    // Get seller info for each listing
    const listingsWithSellers = await Promise.all(
      listings.map(async (listing) => {
        const seller = await ctx.db.get(listing.userId);
        
        // Calculate ranking score (simplified version of PRD algorithm)
        const listingScore = calculateListingScore(listing, seller?.reputation || 0);
        
        return {
          ...listing,
          seller: seller ? {
            _id: seller._id,
            name: seller.name,
            district: seller.district,
            reputation: seller.reputation,
          } : null,
          rankingScore: listingScore,
        };
      })
    );

    // Sort listings
    const sortBy = args.sortBy || "recommended";
    listingsWithSellers.sort((a, b) => {
      switch (sortBy) {
        case "recommended":
          return b.rankingScore - a.rankingScore;
        case "newest":
          return b.createdAt - a.createdAt;
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        default:
          return b.rankingScore - a.rankingScore;
      }
    });

    // Apply limit
    const limit = args.limit || 50;
    return listingsWithSellers.slice(0, limit);
  },
});

// Get single listing by ID
export const getListing = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    
    if (!listing) {
      return null;
    }

    // Get seller info
    const seller = await ctx.db.get(listing.userId);
    
    // Get reviews for this listing
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_listingId", (q) => q.eq("listingId", args.listingId))
      .collect();

    return {
      ...listing,
      seller: seller ? {
        _id: seller._id,
        name: seller.name,
        district: seller.district,
        reputation: seller.reputation,
      } : null,
      reviews: reviews.map(review => ({
        ...review,
        // Hide reviewer identity if anonymous
        reviewerId: review.isAnonymous ? null : review.reviewerId,
      })),
    };
  },
});

// Increment view count mutation
export const incrementViewCount = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }
    
    await ctx.db.patch(args.listingId, {
      viewCount: listing.viewCount + 1,
    });
  },
});

// Create a new listing
export const createListing = mutation({
  args: {
    clerkId: v.string(),
    title: v.string(),
    year: v.number(),
    make: v.string(),
    model: v.string(),
    trim: v.optional(v.string()),
    price: v.number(),
    titleType: v.union(v.literal("clean"), v.literal("salvage"), v.literal("rebuilt")),
    importedFromUS: v.boolean(),
    mileage: v.number(),
    transmission: v.union(v.literal("manual"), v.literal("automatic"), v.literal("cvt")),
    fuelType: v.union(v.literal("gasoline"), v.literal("diesel"), v.literal("hybrid"), v.literal("electric")),
    district: v.string(),
    knownIssues: v.array(v.string()),
    hasNoKnownIssues: v.boolean(),
    photos: v.array(v.string()),
    coldStartVideo: v.optional(v.string()),
    vin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Calculate completeness score
    const completenessScore = calculateCompletenessScore({
      photos: args.photos,
      knownIssues: args.knownIssues,
      hasNoKnownIssues: args.hasNoKnownIssues,
      vin: args.vin,
      coldStartVideo: args.coldStartVideo,
      importedFromUS: args.importedFromUS,
    });

    // Check if required photos are present (simplified check)
    const hasRequiredPhotos = args.photos.length >= 6; // front, rear, left, right, interior, engine bay

    const listingId = await ctx.db.insert("listings", {
      userId: user._id,
      title: args.title,
      year: args.year,
      make: args.make,
      model: args.model,
      trim: args.trim,
      price: args.price,
      titleType: args.titleType,
      importedFromUS: args.importedFromUS,
      mileage: args.mileage,
      transmission: args.transmission,
      fuelType: args.fuelType,
      district: args.district,
      knownIssues: args.knownIssues,
      hasNoKnownIssues: args.hasNoKnownIssues,
      photos: args.photos,
      hasRequiredPhotos,
      coldStartVideo: args.coldStartVideo,
      vin: args.vin,
      vinVerified: args.vin ? false : undefined, // Will be verified later
      completenessScore,
      isActive: true,
      isSold: false,
      viewCount: 0,
      messageCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return listingId;
  },
});

// Helper function to calculate listing completeness score (0-100)
function calculateCompletenessScore(data: {
  photos: string[];
  knownIssues: string[];
  hasNoKnownIssues: boolean;
  vin?: string;
  coldStartVideo?: string;
  importedFromUS: boolean;
}): number {
  let score = 0;

  // Required photos (40%)
  const requiredPhotoCount = 6; // front, rear, left, right, interior, engine bay
  const photoScore = Math.min(data.photos.length / requiredPhotoCount, 1) * 40;
  score += photoScore;

  // Issues answered (20%)
  const issuesScore = (data.hasNoKnownIssues || data.knownIssues.length > 0) ? 20 : 0;
  score += issuesScore;

  // VIN present (20% - required if imported from US)
  if (data.importedFromUS) {
    const vinScore = data.vin ? 20 : 0;
    score += vinScore;
  } else {
    // If not imported, give partial credit for VIN
    const vinScore = data.vin ? 20 : 10;
    score += vinScore;
  }

  // Cold-start video (10%)
  const videoScore = data.coldStartVideo ? 10 : 0;
  score += videoScore;

  // Odometer close-up (10% - simplified, assume present if photos > 5)
  const odometerScore = data.photos.length > 5 ? 10 : 0;
  score += odometerScore;

  return Math.round(score);
}

// Helper function to calculate listing ranking score
function calculateListingScore(listing: any, sellerReputation: number): number {
  // Simplified version of the PRD ranking algorithm
  const listingCompleteness = listing.completenessScore / 100; // 0-1
  const sellerRep = sellerReputation / 100; // 0-1
  const meetupRatio = 0.8; // Placeholder - would calculate from actual meetup data
  const vinSignals = listing.vin ? 0.1 : 0; // 0-1

  // ListingScore = 0.50 * ListingCompleteness + 0.25 * SellerReputation + 0.15 * MeetupVerifiedRatio + 0.10 * VINSignals
  const score = (0.50 * listingCompleteness) + 
                (0.25 * sellerRep) + 
                (0.15 * meetupRatio) + 
                (0.10 * vinSignals);

  return score * 100; // Convert to 0-100 scale
}