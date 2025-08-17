import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Belize districts
const BELIZE_DISTRICTS = [
  'Belize',
  'Cayo',
  'Corozal',
  'Orange Walk',
  'Stann Creek',
  'Toledo'
];

const USER_TYPES = [
  { value: 'buyer', label: 'Buyer', description: 'I want to buy a car' },
  { value: 'seller', label: 'Seller', description: 'I want to sell my car' },
  { value: 'both', label: 'Both', description: 'I buy and sell cars' }
] as const;

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const completeProfile = useMutation(api.users.completeProfile);
  const createUser = useMutation(api.users.createUser);
  
  // Form state
  const [name, setName] = useState(user?.fullName || '');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedUserType, setSelectedUserType] = useState<'buyer' | 'seller' | 'both'>('buyer');
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);

  const handleComplete = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!selectedDistrict) {
      Alert.alert('Error', 'Please select your district');
      return;
    }

    setLoading(true);

    try {
      if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error('User information not available');
      }

      // Create or update user in Convex database
      await createUser({
        clerkId: user.id,
        name: name.trim(),
        email: user.primaryEmailAddress.emailAddress,
      });

      // Complete profile in Convex
      await completeProfile({
        clerkId: user.id,
        district: selectedDistrict,
        userType: selectedUserType,
      });

      // For OAuth users, use unsafeMetadata (writable from frontend)
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          profileComplete: true,
          district: selectedDistrict,
          userType: selectedUserType,
          displayName: name.trim(),
        }
      });

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Profile setup error:', error);
      Alert.alert('Error', 'Failed to complete profile setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-h1 text-text-primary font-semibold mb-2">
            Complete Your Profile
          </Text>
          <Text className="text-body text-text-muted">
            Help us personalize your marketplace experience
          </Text>
        </View>

        {/* Name Input */}
        <View className="mb-6">
          <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
            Your Name
          </Text>
          <TextInput
            className="input-base"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            autoCapitalize="words"
            autoComplete="name"
          />
        </View>

        {/* District Selection */}
        <View className="mb-6">
          <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
            District
          </Text>
          <Pressable 
            className="input-base justify-center"
            onPress={() => setShowDistrictPicker(!showDistrictPicker)}
          >
            <Text className={selectedDistrict ? "text-text-primary" : "text-text-muted"}>
              {selectedDistrict || "Select your district"}
            </Text>
          </Pressable>
          
          {showDistrictPicker && (
            <View className="mt-2 card-base">
              {BELIZE_DISTRICTS.map((district) => (
                <Pressable
                  key={district}
                  className="p-4 border-b border-neutral-100 last:border-b-0"
                  onPress={() => {
                    setSelectedDistrict(district);
                    setShowDistrictPicker(false);
                  }}
                >
                  <Text className="text-body text-text-primary">{district}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* User Type Selection */}
        <View className="mb-8">
          <Text className="text-label text-text-muted mb-4 uppercase tracking-wider">
            I'm Here To
          </Text>
          <View className="space-y-3">
            {USER_TYPES.map((type) => (
              <Pressable
                key={type.value}
                className={`p-4 rounded-xl border-2 ${
                  selectedUserType === type.value 
                    ? 'border-belize-blue bg-belize-blue/5' 
                    : 'border-neutral-200 bg-white'
                }`}
                onPress={() => setSelectedUserType(type.value)}
              >
                <Text className={`text-body font-semibold ${
                  selectedUserType === type.value ? 'text-belize-blue' : 'text-text-primary'
                }`}>
                  {type.label}
                </Text>
                <Text className="text-caption text-text-muted mt-1">
                  {type.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Complete Button */}
        <Pressable 
          className={`btn-primary ${loading ? 'opacity-50' : ''}`}
          onPress={handleComplete}
          disabled={loading}
        >
          <Text className="text-body text-white font-semibold">
            {loading ? 'Setting up...' : 'Get Started'}
          </Text>
        </Pressable>

        {/* Info Note */}
        <View className="mt-6 p-4 bg-neutral-100 rounded-xl">
          <Text className="text-caption text-text-muted text-center">
            You can update these preferences anytime in your profile settings
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}