import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useOAuth, useUser } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { user } = useUser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  // Redirect if user is already signed in
  useEffect(() => {
    if (user) {
      // Check if user has completed profile setup
      if (!user.publicMetadata?.profileComplete && !user.unsafeMetadata?.profileComplete) {
        router.replace('/(auth)/profile-setup');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [user, router]);

  const onGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(auth)/profile-setup', { scheme: 'vehiclemarketplaceapp' }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        
        // Check if this is a new user or returning user
        if (signUp?.createdUserId) {
          // New user - go to profile setup
          router.replace('/(auth)/profile-setup');
        } else {
          // Returning user - check if profile is complete
          router.replace('/(tabs)');
        }
      }
    } catch (err) {
      console.error('OAuth error:', JSON.stringify(err, null, 2));
    }
  }, [startOAuthFlow, router]);

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      {/* App Branding */}
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-belize-blue rounded-xl mb-6 items-center justify-center">
          <Text className="text-white text-h1 font-bold">BC</Text>
        </View>
        <Text className="text-h1 text-text-primary text-center font-semibold">
          Belize Car Marketplace
        </Text>
        <Text className="text-body text-text-muted text-center mt-2">
          Transparent car listings for Belize
        </Text>
      </View>

      {/* Main Content */}
      <View className="mb-8">
        <Text className="text-h2 text-text-primary text-center mb-2">
          Welcome
        </Text>
        <Text className="text-body text-text-muted text-center">
          Find your next car with confidence. All listings include title type, known issues, and verified photos.
        </Text>
      </View>

      {/* Sign In Button */}
      <Pressable 
        className="btn-primary mb-4"
        onPress={onGoogleSignIn}
      >
        <Text className="text-body text-white font-semibold">
          Continue with Gmail
        </Text>
      </Pressable>

      {/* Footer */}
      <View className="mt-8">
        <Text className="text-caption text-text-muted text-center">
          By continuing, you agree to our{' '}
          <Text className="text-belize-blue">Terms of Service</Text>
          {' '}and{' '}
          <Text className="text-belize-blue">Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}