# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo application for a vehicle marketplace, built with TypeScript and using Expo Router for file-based navigation.

## Key Commands

### Development

- `npm install` - Install all dependencies
- `npm start` or `npx expo start` - Start the development server
- `npm run android` - Start on Android emulator/device
- `npm run ios` - Start on iOS simulator/device
- `npm run web` - Start in web browser

### Code Quality

- `npm run lint` - Run ESLint to check code quality

### Project Management

- `npm run reset-project` - Move current code to app-example/ and create a fresh app/ directory

## Architecture

### Navigation Structure

- **Expo Router** with file-based routing
- Root layout: `app/_layout.tsx` - Handles theme provider, font loading, and navigation stack
- Tab navigation: `app/(tabs)/_layout.tsx` - Bottom tab navigator with Home and Explore tabs
- Platform-specific components use `.ios.tsx` extension for iOS-specific implementations

### Component Organization

- `components/` - Reusable UI components
  - Themed components (`ThemedText`, `ThemedView`) for consistent dark/light mode support
  - Platform-specific UI components in `components/ui/`
- `hooks/` - Custom React hooks for color scheme, theme colors
- `constants/` - App constants including theme colors

### Styling Approach

- React Native StyleSheet for component styles
- Theme-aware components using `useColorScheme` hook
- Light/dark mode support via React Navigation themes
- Colors defined in `constants/Colors.ts`

### TypeScript Configuration

- Strict mode enabled
- Path alias `@/` configured for root imports
- ESLint configured with expo preset

### Key Dependencies

- **expo-router** - File-based routing
- **react-navigation** - Navigation primitives
- **react-native-reanimated** - Animation library
- **expo-image** - Optimized image component
- **expo-haptics** - Haptic feedback for tabs

## Development Notes

- The app uses React 19.0.0 with React Native 0.79.5
- Expo SDK 53 with new architecture enabled
- TypeScript strict mode is enabled - ensure proper typing
- Use `@/` import alias for absolute imports from project root
- Components should support both light and dark color schemes
