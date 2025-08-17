import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { View, Text } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // User not signed in, go to welcome
      router.replace('/(auth)/welcome');
    } else if (!user?.publicMetadata?.profileComplete && !user?.unsafeMetadata?.profileComplete) {
      // User signed in but profile not complete
      router.replace('/(auth)/profile-setup');
    } else {
      // User signed in and profile complete
      router.replace('/(tabs)');
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Show loading state while checking auth
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <View className="w-20 h-20 bg-belize-blue rounded-xl mb-4 items-center justify-center">
        <Text className="text-white text-h1 font-bold">BC</Text>
      </View>
      <Text className="text-body text-text-muted">Loading...</Text>
    </View>
  );
}