import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

export default function SellScreen() {
  const router = useRouter();
  const { user } = useUser();

  const onCreateListing = () => {
    // Navigate to the first step of the wizard
    router.push('/(tabs)/sell/step-1');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="pt-4 pb-6">
          <Text className="text-h1 text-text-primary font-semibold mb-2">
            Sell Your Car
          </Text>
          <Text className="text-body text-text-muted">
            Create a transparent listing to reach serious buyers in Belize
          </Text>
        </View>

        {/* Features List */}
        <View className="mb-8">
          <Text className="text-h2 text-text-primary font-semibold mb-4">
            Why list with us?
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-start">
              <View className="w-6 h-6 bg-belize-blue rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-body text-text-primary font-medium">
                  Transparent Requirements
                </Text>
                <Text className="text-caption text-text-muted">
                  Required photos and honest disclosure build buyer trust
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 bg-belize-blue rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-body text-text-primary font-medium">
                  Serious Buyers Only
                </Text>
                <Text className="text-caption text-text-muted">
                  Better filters mean fewer time-wasters
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 bg-belize-blue rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-body text-text-primary font-medium">
                  Build Your Reputation
                </Text>
                <Text className="text-caption text-text-muted">
                  Honest sellers get higher ranking and more visibility
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 bg-belize-blue rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-body text-text-primary font-medium">
                  Belize-Focused
                </Text>
                <Text className="text-caption text-text-muted">
                  All listings include title type and import status
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Requirements Preview */}
        <View className="card-base mb-8 p-4">
          <Text className="text-body text-text-primary font-semibold mb-4">
            What you'll need:
          </Text>
          
          <View className="space-y-4">
            <Text className="text-caption text-text-muted leading-6">
              • Vehicle details (year, make, model, mileage, etc.)
            </Text>
            <Text className="text-caption text-text-muted leading-6">
              • Title type (Clean, Salvage, or Rebuilt)
            </Text>
            <Text className="text-caption text-text-muted leading-6">
              • 7 required photos (all angles + interior + engine)
            </Text>
            <Text className="text-caption text-text-muted leading-6">
              • Known issues or "No known issues" declaration
            </Text>
            <Text className="text-caption text-text-muted leading-6">
              • VIN (if imported from U.S.)
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable 
          className="btn-primary mb-6"
          onPress={onCreateListing}
        >
          <Text className="text-body text-white font-semibold">
            Create Listing
          </Text>
        </Pressable>

        {/* User Info */}
        <View className="bg-neutral-100 p-4 rounded-xl mb-6">
          <Text className="text-caption text-text-muted text-center">
            Listing as {user?.firstName || user?.unsafeMetadata?.displayName?.split(' ')[0] || 'User'} from{' '}
            {user?.unsafeMetadata?.district || user?.publicMetadata?.district || 'Belize'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}