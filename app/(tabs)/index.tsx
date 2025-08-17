import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import SearchBar from '@/components/ui/SearchBar';
import ListingCard from '@/components/ui/ListingCard';
import TitleBadge from '@/components/ui/TitleBadge';


const FILTER_CHIPS = [
  { id: 'clean', label: 'Clean Title', active: false },
  { id: 'all-districts', label: 'All Districts', active: true },
  { id: 'under-30k', label: 'Under $30k', active: false },
];

export default function HomeScreen() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChips, setFilterChips] = useState(FILTER_CHIPS);
  const [sortBy, setSortBy] = useState<'recommended' | 'newest' | 'price_low'>('recommended');
  
  // Get active filters
  const activeCleanFilter = filterChips.find(chip => chip.id === 'clean')?.active;
  const activePriceFilter = filterChips.find(chip => chip.id === 'under-30k')?.active;
  
  // Fetch listings from Convex
  const listings = useQuery(api.listings.getListings, {
    titleType: activeCleanFilter ? 'clean' : undefined,
    maxPrice: activePriceFilter ? 30000 : undefined,
    sortBy: sortBy === 'price' ? 'price_low' : sortBy,
    limit: 50,
  });

  const toggleFilterChip = (chipId: string) => {
    setFilterChips(prev => 
      prev.map(chip => 
        chip.id === chipId 
          ? { ...chip, active: !chip.active }
          : chip
      )
    );
  };

  const getFilteredListings = () => {
    if (!listings) return [];
    
    let filtered = [...listings];
    
    // Apply search filter (client-side for responsiveness)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.make.toLowerCase().includes(query) ||
        listing.model.toLowerCase().includes(query) ||
        listing.title.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const handleListingPress = (listing: any) => {
    // TODO: Navigate to listing detail screen
    console.log('Pressed listing:', listing.title);
  };

  const handleFilterPress = () => {
    // TODO: Open filter bottom sheet
    console.log('Filter pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-h1 text-text-primary font-semibold">
              Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}
            </Text>
            <Text className="text-body text-text-muted">
              {user?.firstName || user?.publicMetadata?.displayName?.split(' ')[0] || user?.unsafeMetadata?.displayName?.split(' ')[0] || 'there'}! Find your next car
            </Text>
          </View>
          
          {/* Sort Button */}
          <Pressable 
            className="bg-neutral-100 px-3 py-2 rounded-xl"
            onPress={() => {
              const nextSort = sortBy === 'recommended' ? 'newest' : 
                              sortBy === 'newest' ? 'price_low' : 'recommended';
              setSortBy(nextSort);
            }}
          >
            <Text className="text-caption text-text-muted">
              {sortBy === 'recommended' ? 'Recommended' : 
               sortBy === 'newest' ? 'Newest' : 'Price Low'}
            </Text>
          </Pressable>
        </View>
        
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={handleFilterPress}
        />
        
        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <View className="flex-row space-x-2">
            {filterChips.map((chip) => (
              <Pressable
                key={chip.id}
                className={`px-4 py-2 rounded-pill border ${
                  chip.active 
                    ? 'bg-belize-blue border-belize-blue' 
                    : 'bg-white border-neutral-200'
                }`}
                onPress={() => toggleFilterChip(chip.id)}
              >
                <Text className={`text-caption font-medium ${
                  chip.active ? 'text-white' : 'text-text-muted'
                }`}>
                  {chip.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
      
      {/* Listings */}
      <FlatList
        data={getFilteredListings()}
        renderItem={({ item }) => (
          <ListingCard 
            listing={item} 
            onPress={() => handleListingPress(item)}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={listings === undefined}
        onRefresh={() => {
          // Convex queries automatically refresh
        }}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-12">
            <Text className="text-h2 text-text-muted mb-2">
              {listings === undefined ? 'Loading...' : 'No cars found'}
            </Text>
            <Text className="text-body text-text-muted text-center">
              {listings === undefined 
                ? 'Getting the latest listings'
                : 'Try adjusting your search or filters'
              }
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
