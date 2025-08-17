import React from 'react';
import { View, TextInput, Pressable } from 'react-native';

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
    <View className="flex-row items-center space-x-3 mb-4">
      <View className="flex-1 flex-row items-center input-base">
        {/* Search Icon */}
        <View className="mr-3">
          <View className="w-5 h-5 rounded-full border-2 border-text-muted" />
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
      </View>
      
      {/* Filter Button */}
      {onFilterPress && (
        <Pressable 
          className="w-12 h-12 bg-belize-blue rounded-xl items-center justify-center"
          onPress={onFilterPress}
        >
          {/* Filter Icon - simplified */}
          <View className="space-y-1">
            <View className="w-4 h-0.5 bg-white" />
            <View className="w-3 h-0.5 bg-white" />
            <View className="w-4 h-0.5 bg-white" />
          </View>
        </Pressable>
      )}
    </View>
  );
}