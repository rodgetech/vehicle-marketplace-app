import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled = false,
  className = '',
  ...props 
}: ButtonProps) {
  const getButtonClasses = () => {
    let classes = 'items-center justify-center rounded-xl ';
    
    // Size classes
    switch (size) {
      case 'sm':
        classes += 'h-button-sm px-3 ';
        break;
      case 'lg':
        classes += 'h-button-lg px-6 ';
        break;
      default:
        classes += 'h-button px-4 ';
    }
    
    // Variant classes
    switch (variant) {
      case 'secondary':
        classes += 'bg-neutral-100 border border-neutral-200 active:bg-neutral-200 ';
        break;
      case 'danger':
        classes += 'bg-flag-red active:bg-flag-red-dark ';
        break;
      default:
        classes += 'bg-belize-blue active:bg-belize-blue-dark ';
    }
    
    // Disabled state
    if (disabled) {
      classes += 'opacity-50 ';
    }
    
    return classes + className;
  };

  const getTextClasses = () => {
    let classes = 'font-semibold ';
    
    // Size text
    switch (size) {
      case 'sm':
        classes += 'text-sm ';
        break;
      case 'lg':
        classes += 'text-lg ';
        break;
      default:
        classes += 'text-body ';
    }
    
    // Variant text color
    switch (variant) {
      case 'secondary':
        classes += 'text-text-primary ';
        break;
      default:
        classes += 'text-white ';
    }
    
    return classes;
  };

  return (
    <Pressable 
      className={getButtonClasses()}
      disabled={disabled}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={getTextClasses()}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}