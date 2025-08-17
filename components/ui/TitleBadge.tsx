import React from 'react';
import { View, Text } from 'react-native';

interface TitleBadgeProps {
  titleType: 'clean' | 'salvage' | 'rebuilt';
  size?: 'sm' | 'md';
}

export default function TitleBadge({ titleType, size = 'md' }: TitleBadgeProps) {
  const getBadgeClasses = () => {
    let classes = 'px-2 py-1 rounded-pill ';
    
    // Size classes
    switch (size) {
      case 'sm':
        classes += '';
        break;
      default:
        classes += '';
    }
    
    // Color classes based on title type
    switch (titleType) {
      case 'clean':
        classes += 'bg-chip-clean ';
        break;
      case 'salvage':
        classes += 'bg-chip-salvage ';
        break;
      case 'rebuilt':
        classes += 'bg-chip-rebuilt ';
        break;
    }
    
    return classes;
  };

  const getTextClasses = () => {
    let classes = 'text-white font-medium ';
    
    switch (size) {
      case 'sm':
        classes += 'text-xs ';
        break;
      default:
        classes += 'text-label ';
    }
    
    return classes;
  };

  const getBadgeText = () => {
    switch (titleType) {
      case 'clean':
        return 'Clean Title';
      case 'salvage':
        return 'Salvage';
      case 'rebuilt':
        return 'Rebuilt';
      default:
        return titleType;
    }
  };

  return (
    <View className={getBadgeClasses()}>
      <Text className={getTextClasses()}>
        {getBadgeText()}
      </Text>
    </View>
  );
}