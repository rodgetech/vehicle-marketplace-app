import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import TitleBadge from './TitleBadge';

interface ListingCardProps {
  listing: {
    _id: string;
    title: string;
    year: number;
    make: string;
    model: string;
    price: number;
    titleType: 'clean' | 'salvage' | 'rebuilt';
    mileage: number;
    transmission: string;
    district: string;
    photos: string[]; // File IDs
    photoUrls: string[]; // Resolved URLs
    seller?: {
      name: string;
      reputation: number;
    };
  };
  onPress?: () => void;
}

export default function ListingCard({ listing, onPress }: ListingCardProps) {
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()} BZD`;
  };

  const formatMileage = (mileage: number) => {
    return `${mileage.toLocaleString()} mi`;
  };

  const getMainPhoto = () => {
    // Use photoUrls (resolved URLs) instead of photos (file IDs)
    return listing.photoUrls?.[0] || 'https://via.placeholder.com/300x200?text=No+Photo';
  };

  return (
    <Pressable 
      className="card-base mb-4 overflow-hidden"
      onPress={onPress}
    >
      {/* Main Photo */}
      <View className="relative">
        <Image 
          source={{ uri: getMainPhoto() }}
          className="w-full h-48"
          resizeMode="cover"
        />
        
        {/* Title Badge Overlay */}
        <View className="absolute top-3 left-3">
          <TitleBadge titleType={listing.titleType} size="sm" />
        </View>
        
        {/* Price Overlay */}
        <View className="absolute bottom-3 right-3 bg-black/70 px-3 py-1 rounded-pill">
          <Text className="text-white text-body font-bold">
            {formatPrice(listing.price)}
          </Text>
        </View>
      </View>
      
      {/* Content */}
      <View className="p-4">
        {/* Title */}
        <Text className="text-body font-semibold text-text-primary mb-1">
          {listing.year} {listing.make} {listing.model}
        </Text>
        
        {/* Details Row */}
        <Text className="text-caption text-text-muted mb-3">
          {formatMileage(listing.mileage)} • {listing.transmission} • {listing.district}
        </Text>
        
        {/* Seller Info */}
        {listing.seller && (
          <View className="flex-row items-center justify-between">
            <Text className="text-caption text-text-muted">
              Seller: {listing.seller.name}
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-wreath-green rounded-full mr-1" />
              <Text className="text-caption text-text-muted">
                {listing.seller.reputation}% positive
              </Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}