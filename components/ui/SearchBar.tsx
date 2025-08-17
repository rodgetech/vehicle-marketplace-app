import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Search cars...",
  onFilterPress 
}: SearchBarProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center input-base">
        {/* Search Icon */}
        <View className="mr-3">
          <Search size={20} color="#737373" />
        </View>
        
        <TextInput
          className="flex-1 text-body text-text-primary"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#737373"
          autoCorrect={false}
          autoCapitalize="none"
        />
        
        {/* Filter Button - Integrated */}
        {onFilterPress && (
          <>
            {/* Divider */}
            <View className="w-px h-6 bg-neutral-200 mx-3" />
            <Pressable 
              className="p-2 rounded-lg"
              onPress={onFilterPress}
            >
              <SlidersHorizontal size={20} color="#737373" />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}