import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useListingForm } from '@/contexts/ListingFormContext';

const TRANSMISSION_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'cvt', label: 'CVT' }
] as const;

const FUEL_TYPES = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' }
] as const;

export default function SellStep2() {
  const router = useRouter();
  const { formData, updateFormData, resetForm } = useListingForm();
  
  // Form state from context
  const [price, setPrice] = useState(formData.price);
  const [mileage, setMileage] = useState(formData.mileage);
  const [transmission, setTransmission] = useState(formData.transmission);
  const [fuelType, setFuelType] = useState(formData.fuelType);
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Format with commas
    if (numericValue) {
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '';
  };

  const formatMileage = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Format with commas
    if (numericValue) {
      return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    const numericPrice = price.replace(/[^0-9]/g, '');
    const numericMileage = mileage.replace(/[^0-9]/g, '');
    
    if (!numericPrice || parseInt(numericPrice) < 1000) {
      newErrors.price = 'Price must be at least $1,000 BZD';
    } else if (parseInt(numericPrice) > 500000) {
      newErrors.price = 'Price seems too high. Please verify.';
    }
    
    if (!numericMileage) {
      newErrors.mileage = 'Mileage is required';
    } else if (parseInt(numericMileage) > 999999) {
      newErrors.mileage = 'Mileage seems too high. Please verify.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    resetForm();
    router.push('/(tabs)/sell');
  };

  const handleNext = () => {
    if (!validateForm()) {
      Alert.alert('Invalid Information', 'Please check the highlighted fields.');
      return;
    }

    // Save form data to context
    updateFormData({
      price,
      mileage,
      transmission,
      fuelType,
    });

    router.push('/(tabs)/sell/step-3');
  };

  const handleBack = () => {
    router.push('/(tabs)/sell/step-1');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 border-b border-neutral-200">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable onPress={handleBack}>
            <Text className="text-body text-belize-blue">Back</Text>
          </Pressable>
          <Text className="text-body text-text-primary font-medium">Step 2 of 4</Text>
          <Pressable onPress={handleCancel}>
            <Text className="text-body text-text-muted">Cancel</Text>
          </Pressable>
        </View>
        
        {/* Progress Bar */}
        <View className="bg-neutral-200 h-1 rounded-full">
          <View className="bg-belize-blue h-1 rounded-full" style={{ width: '50%' }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-h1 text-text-primary font-semibold mb-2">
          Vehicle Specs
        </Text>
        <Text className="text-body text-text-muted mb-6">
          Add pricing and technical details
        </Text>

        {/* Price */}
        <View className="mb-6">
          <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
            Price (BZD) *
          </Text>
          <View className="flex-row items-center">
            <View className="flex-1 border border-neutral-200 rounded-xl bg-white flex-row items-center">
              <Text className="text-body text-text-muted pl-4">$</Text>
              <TextInput
                className="flex-1 p-4 text-body text-text-primary"
                placeholder="0"
                value={price}
                onChangeText={(text) => setPrice(formatPrice(text))}
                keyboardType="numeric"
              />
              <Text className="text-body text-text-muted pr-4">BZD</Text>
            </View>
          </View>
          {errors.price && <Text className="text-caption text-flag-red mt-1">{errors.price}</Text>}
          <Text className="text-caption text-text-muted mt-1">
            Enter the asking price in Belize Dollars
          </Text>
        </View>

        {/* Mileage */}
        <View className="mb-6">
          <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
            Mileage *
          </Text>
          <View className="flex-row items-center">
            <View className="flex-1 border border-neutral-200 rounded-xl bg-white flex-row items-center">
              <TextInput
                className="flex-1 p-4 text-body text-text-primary"
                placeholder="0"
                value={mileage}
                onChangeText={(text) => setMileage(formatMileage(text))}
                keyboardType="numeric"
              />
              <Text className="text-body text-text-muted pr-4">miles</Text>
            </View>
          </View>
          {errors.mileage && <Text className="text-caption text-flag-red mt-1">{errors.mileage}</Text>}
          <Text className="text-caption text-text-muted mt-1">
            Current odometer reading
          </Text>
        </View>

        {/* Transmission */}
        <View className="mb-6">
          <Text className="text-label text-text-muted mb-3 uppercase tracking-wider">
            Transmission *
          </Text>
          <View className="flex-row space-x-3">
            {TRANSMISSION_TYPES.map((type) => (
              <Pressable
                key={type.value}
                className={`flex-1 p-4 rounded-xl border-2 ${
                  transmission === type.value 
                    ? 'border-belize-blue bg-belize-blue/5' 
                    : 'border-neutral-200 bg-white'
                }`}
                onPress={() => setTransmission(type.value)}
              >
                <Text className={`text-body font-semibold text-center ${
                  transmission === type.value ? 'text-belize-blue' : 'text-text-primary'
                }`}>
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Fuel Type */}
        <View className="mb-8">
          <Text className="text-label text-text-muted mb-3 uppercase tracking-wider">
            Fuel Type *
          </Text>
          <View className="space-y-3">
            {FUEL_TYPES.map((type) => (
              <Pressable
                key={type.value}
                className={`p-4 rounded-xl border-2 ${
                  fuelType === type.value 
                    ? 'border-belize-blue bg-belize-blue/5' 
                    : 'border-neutral-200 bg-white'
                }`}
                onPress={() => setFuelType(type.value)}
              >
                <Text className={`text-body font-semibold ${
                  fuelType === type.value ? 'text-belize-blue' : 'text-text-primary'
                }`}>
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <Text className="text-caption text-blue-800 font-medium mb-1">
            💡 Pricing Tip
          </Text>
          <Text className="text-caption text-blue-700">
            Competitive pricing gets more views. Check similar vehicles to set a fair price.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-neutral-200 bg-white" style={{ paddingBottom: 34 }}>
        <Pressable 
          className="btn-primary"
          onPress={handleNext}
        >
          <Text className="text-body text-white font-semibold">
            Next: Known Issues
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}