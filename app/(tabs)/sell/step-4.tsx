import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useListingForm } from '@/contexts/ListingFormContext';
import * as ImagePicker from 'expo-image-picker';

const REQUIRED_PHOTOS = [
  { id: 'front', label: 'Front view', description: 'Full front of the vehicle' },
  { id: 'rear', label: 'Rear view', description: 'Full rear of the vehicle' },
  { id: 'left_side', label: 'Left side', description: 'Driver side profile' },
  { id: 'right_side', label: 'Right side', description: 'Passenger side profile' },
  { id: 'interior', label: 'Interior/Dashboard', description: 'Dashboard and front seats' },
  { id: 'odometer', label: 'Odometer close-up', description: 'Clear reading of mileage' },
  { id: 'engine_bay', label: 'Engine bay', description: 'Open hood showing engine' },
  { id: 'tires', label: 'Tires', description: 'Condition of tires' }
];

const COMMON_ISSUES = [
  { id: 'oil_leaks', label: 'Oil leaks' },
  { id: 'engine_problems', label: 'Engine problems' },
  { id: 'transmission_issues', label: 'Transmission issues' },
  { id: 'ac_problems', label: 'AC problems' },
  { id: 'electrical_issues', label: 'Electrical issues' },
  { id: 'body_damage', label: 'Body damage' },
  { id: 'paint_issues', label: 'Paint issues' },
  { id: 'interior_damage', label: 'Interior damage' },
  { id: 'brake_issues', label: 'Brake issues' },
  { id: 'suspension_problems', label: 'Suspension problems' },
  { id: 'exhaust_issues', label: 'Exhaust issues' },
  { id: 'tire_wear', label: 'Excessive tire wear' }
];

export default function SellStep4() {
  const router = useRouter();
  const { user } = useUser();
  const { formData, updateFormData, resetForm, getCompletenessScore } = useListingForm();
  const createListing = useMutation(api.listings.createListing);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  
  // Form state from context
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, Id<"_storage">>>(formData.uploadedPhotos || {});
  const [vin, setVin] = useState(formData.vin);
  const [coldStartVideo, setColdStartVideo] = useState<Id<"_storage"> | null>(formData.coldStartVideo || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState<Record<string, boolean>>({});
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  const completenessScore = getCompletenessScore();

  // Helper function to upload file to Convex storage
  const uploadFileToConvex = async (uri: string): Promise<Id<"_storage">> => {
    try {
      console.log('Starting file upload for URI:', uri);
      
      // Get upload URL from Convex
      console.log('Requesting upload URL...');
      const uploadUrl = await generateUploadUrl();
      console.log('Got upload URL:', uploadUrl);
      
      // Get file info
      console.log('Fetching file from URI...');
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Got blob, size:', blob.size, 'type:', blob.type);
      
      // Upload file to Convex
      console.log('Uploading file to Convex...');
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type },
        body: blob,
      });
      
      console.log('Upload result status:', result.status);
      
      if (!result.ok) {
        const errorText = await result.text();
        throw new Error(`Failed to upload file: ${result.status} - ${errorText}`);
      }
      
      const responseData = await result.json();
      console.log('Upload response:', responseData);
      
      const { storageId } = responseData;
      if (!storageId) {
        throw new Error('No storageId returned from upload');
      }
      
      console.log('Upload successful, storageId:', storageId);
      return storageId as Id<"_storage">;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handlePhotoUpload = async (photoId: string) => {
    if (uploadingPhotos[photoId]) {
      Alert.alert('Please wait', 'This photo is currently being uploaded.');
      return;
    }

    // Check if user is authenticated
    if (!user?.id) {
      Alert.alert('Authentication required', 'Please sign in to upload photos.');
      return;
    }

    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera roll access is required to upload photos.');
        return;
      }

      // Show photo selection options
      Alert.alert(
        'Select Photo',
        'Choose how you want to add a photo',
        [
          { text: 'Camera', onPress: () => openCamera(photoId) },
          { text: 'Photo Library', onPress: () => openImageLibrary(photoId) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const openCamera = async (photoId: string) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to take photos.');
        return;
      }

      // Set upload state for this specific photo
      setUploadingPhotos(prev => ({ ...prev, [photoId]: true }));

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Upload to Convex storage
        const storageId = await uploadFileToConvex(result.assets[0].uri);
        
        const newPhotos = {
          ...uploadedPhotos,
          [photoId]: storageId
        };
        
        setUploadedPhotos(newPhotos);
        updateFormData({ uploadedPhotos: newPhotos });
        
        Alert.alert('Success', 'Photo uploaded successfully!');
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      
      // Show specific error message
      let errorMessage = 'Failed to take and upload photo';
      if (error instanceof Error) {
        if (error.message.includes('Not authenticated')) {
          errorMessage = 'Authentication failed. Please sign in again.';
        } else if (error.message.includes('Failed to upload file')) {
          errorMessage = 'Upload failed. Please check your internet connection.';
        } else {
          errorMessage = `Upload failed: ${error.message}`;
        }
      }
      
      Alert.alert('Upload Error', errorMessage);
    } finally {
      // Clear upload state for this specific photo
      setUploadingPhotos(prev => ({ ...prev, [photoId]: false }));
    }
  };

  const openImageLibrary = async (photoId: string) => {
    try {
      // Set upload state for this specific photo
      setUploadingPhotos(prev => ({ ...prev, [photoId]: true }));

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Upload to Convex storage
        const storageId = await uploadFileToConvex(result.assets[0].uri);
        
        const newPhotos = {
          ...uploadedPhotos,
          [photoId]: storageId
        };
        
        setUploadedPhotos(newPhotos);
        updateFormData({ uploadedPhotos: newPhotos });
        
        Alert.alert('Success', 'Photo uploaded successfully!');
      }
    } catch (error) {
      console.error('Error opening image library:', error);
      
      // Show specific error message
      let errorMessage = 'Failed to select and upload photo';
      if (error instanceof Error) {
        if (error.message.includes('Not authenticated')) {
          errorMessage = 'Authentication failed. Please sign in again.';
        } else if (error.message.includes('Failed to upload file')) {
          errorMessage = 'Upload failed. Please check your internet connection.';
        } else {
          errorMessage = `Upload failed: ${error.message}`;
        }
      }
      
      Alert.alert('Upload Error', errorMessage);
    } finally {
      // Clear upload state for this specific photo
      setUploadingPhotos(prev => ({ ...prev, [photoId]: false }));
    }
  };

  const handleVideoUpload = async () => {
    try {
      // Show video selection options
      Alert.alert(
        'Select Video',
        'Choose how you want to add a cold-start video',
        [
          { text: 'Camera', onPress: () => recordVideo() },
          { text: 'Video Library', onPress: () => selectVideo() },
          { text: 'Remove Video', onPress: () => removeVideo(), style: 'destructive' },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error with video upload:', error);
      Alert.alert('Error', 'Failed to handle video upload');
    }
  };

  const recordVideo = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to record videos.');
        return;
      }

      setIsVideoUploading(true);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
        videoMaxDuration: 30, // 30 second limit for cold-start videos
      });

      if (!result.canceled && result.assets[0]) {
        // Upload to Convex storage
        const storageId = await uploadFileToConvex(result.assets[0].uri);
        
        setColdStartVideo(storageId);
        updateFormData({ coldStartVideo: storageId });
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record and upload video');
    } finally {
      setIsVideoUploading(false);
    }
  };

  const selectVideo = async () => {
    try {
      setIsVideoUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      });

      if (!result.canceled && result.assets[0]) {
        // Upload to Convex storage
        const storageId = await uploadFileToConvex(result.assets[0].uri);
        
        setColdStartVideo(storageId);
        updateFormData({ coldStartVideo: storageId });
      }
    } catch (error) {
      console.error('Error selecting video:', error);
      Alert.alert('Error', 'Failed to select and upload video');
    } finally {
      setIsVideoUploading(false);
    }
  };

  const removeVideo = () => {
    setColdStartVideo(null);
    updateFormData({ coldStartVideo: null });
  };

  const validateForm = () => {
    const uploadedCount = Object.values(uploadedPhotos).filter(Boolean).length;
    
    if (uploadedCount < REQUIRED_PHOTOS.length) {
      Alert.alert(
        'Missing Photos', 
        `Please upload all ${REQUIRED_PHOTOS.length} required photos. You have ${uploadedCount} of ${REQUIRED_PHOTOS.length}.`
      );
      return false;
    }
    
    if (formData.importedFromUS && vin.trim().length < 17) {
      Alert.alert(
        'VIN Required', 
        'VIN is required for vehicles imported from the U.S. Please enter the 17-character VIN.'
      );
      return false;
    }
    
    return true;
  };

  const handleCancel = () => {
    resetForm();
    router.push('/(tabs)/sell');
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'You must be signed in to create a listing.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Update form data with final values
      updateFormData({ 
        uploadedPhotos, 
        vin: vin.trim(), 
        coldStartVideo 
      });

      // Prepare known issues array
      const allKnownIssues = [
        ...formData.selectedIssues.map(id => 
          COMMON_ISSUES.find(issue => issue.id === id)?.label || ''
        ).filter(Boolean),
        ...formData.customIssues
      ];

      // Create listing in Convex
      await createListing({
        clerkId: user.id,
        title: `${formData.year} ${formData.make === 'Other' ? formData.customMake : formData.make} ${formData.model}${formData.trim ? ' ' + formData.trim : ''}`,
        year: parseInt(formData.year),
        make: formData.make === 'Other' ? formData.customMake : formData.make,
        model: formData.model,
        trim: formData.trim || undefined,
        price: parseInt(formData.price.replace(/[^0-9]/g, '')),
        titleType: formData.titleType,
        importedFromUS: formData.importedFromUS,
        mileage: parseInt(formData.mileage.replace(/[^0-9]/g, '')),
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        district: formData.district,
        knownIssues: allKnownIssues,
        hasNoKnownIssues: formData.hasNoKnownIssues,
        photos: Object.values(uploadedPhotos).filter(Boolean),
        coldStartVideo: coldStartVideo || undefined,
        vin: vin.trim() || undefined,
      });

      // Reset form and navigate to success
      resetForm();
      
      Alert.alert(
        'Success!', 
        'Your listing has been created and is now live!',
        [
          {
            text: 'View Listings',
            onPress: () => router.push('/(tabs)')
          }
        ]
      );
    } catch (error) {
      console.error('Failed to create listing:', error);
      Alert.alert(
        'Error', 
        'Failed to create listing. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/(tabs)/sell/step-3');
  };

  const uploadedCount = Object.values(uploadedPhotos).filter(Boolean).length;
  const allPhotosUploaded = uploadedCount === REQUIRED_PHOTOS.length;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 border-b border-neutral-200">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable onPress={handleBack}>
            <Text className="text-body text-belize-blue">Back</Text>
          </Pressable>
          <Text className="text-body text-text-primary font-medium">Step 4 of 4</Text>
          <Pressable onPress={handleCancel}>
            <Text className="text-body text-text-muted">Cancel</Text>
          </Pressable>
        </View>
        
        {/* Progress Bar */}
        <View className="bg-neutral-200 h-1 rounded-full">
          <View className="bg-belize-blue h-1 rounded-full" style={{ width: '100%' }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-h1 text-text-primary font-semibold mb-2">
          Photos & VIN
        </Text>
        <Text className="text-body text-text-muted mb-6">
          Add required photos and VIN to complete your listing
        </Text>

        {/* Completeness Score */}
        <View className="card-base mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-body text-text-primary font-semibold">
              Listing Completeness
            </Text>
            <Text className={`text-h2 font-bold ${
              completenessScore >= 80 ? 'text-wreath-green' : 
              completenessScore >= 60 ? 'text-yellow-600' : 'text-flag-red'
            }`}>
              {completenessScore}%
            </Text>
          </View>
          
          <View className="bg-neutral-200 h-2 rounded-full">
            <View 
              className={`h-2 rounded-full ${
                completenessScore >= 80 ? 'bg-wreath-green' : 
                completenessScore >= 60 ? 'bg-yellow-500' : 'bg-flag-red'
              }`}
              style={{ width: `${completenessScore}%` }}
            />
          </View>
          
          <Text className="text-caption text-text-muted mt-2">
            Higher completeness = better ranking and more views
          </Text>
        </View>

        {/* Required Photos */}
        <View className="mb-6">
          <Text className="text-body text-text-primary font-semibold mb-3">
            Required Photos ({uploadedCount}/{REQUIRED_PHOTOS.length})
          </Text>
          
          <View className="space-y-3">
            {REQUIRED_PHOTOS.map((photo) => (
              <Pressable
                key={photo.id}
                className={`p-4 rounded-xl border-2 ${
                  uploadedPhotos[photo.id] 
                    ? 'border-wreath-green bg-green-50' 
                    : 'border-neutral-200 bg-white'
                }`}
                onPress={() => handlePhotoUpload(photo.id)}
              >
                <View className="flex-row items-center">
                  <View className={`w-8 h-8 rounded border-2 mr-3 items-center justify-center ${
                    uploadedPhotos[photo.id] 
                      ? 'border-wreath-green bg-wreath-green' 
                      : 'border-neutral-300'
                  }`}>
                    {uploadedPhotos[photo.id] ? (
                      <Text className="text-white text-sm font-bold">✓</Text>
                    ) : (
                      <Text className="text-neutral-400 text-lg">📷</Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className={`text-body font-medium ${
                      uploadedPhotos[photo.id] ? 'text-wreath-green' : 'text-text-primary'
                    }`}>
                      {photo.label}
                    </Text>
                    <Text className="text-caption text-text-muted">
                      {photo.description}
                    </Text>
                  </View>
                  <Text className={`text-caption ${
                    uploadedPhotos[photo.id] ? 'text-wreath-green' : uploadingPhotos[photo.id] ? 'text-yellow-600' : 'text-belize-blue'
                  }`}>
                    {uploadingPhotos[photo.id] ? 'Uploading...' : uploadedPhotos[photo.id] ? 'Uploaded' : 'Tap to add'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* VIN Input */}
        <View className="mb-6">
          <Text className="text-body text-text-primary font-semibold mb-2">
            VIN {formData.importedFromUS ? '(Required)' : '(Optional)'}
          </Text>
          
          <TextInput
            className={`input-base ${formData.importedFromUS && vin.trim().length < 17 ? 'border-flag-red' : ''}`}
            placeholder="Enter 17-character VIN..."
            value={vin}
            onChangeText={(text) => {
              setVin(text);
              updateFormData({ vin: text });
            }}
            maxLength={17}
            autoCapitalize="characters"
          />
          
          <Text className="text-caption text-text-muted mt-1">
            {formData.importedFromUS 
              ? 'Required for vehicles imported from the U.S.'
              : 'Optional but helps buyers verify vehicle history'
            }
          </Text>
          
          {vin.length > 0 && vin.length < 17 && (
            <Text className="text-caption text-flag-red mt-1">
              VIN must be exactly 17 characters ({vin.length}/17)
            </Text>
          )}
        </View>

        {/* Cold Start Video */}
        <View className="mb-8">
          <Text className="text-body text-text-primary font-semibold mb-2">
            Cold-start Video (Optional)
          </Text>
          
          <Pressable
            className={`p-4 rounded-xl border-2 ${
              coldStartVideo 
                ? 'border-wreath-green bg-green-50' 
                : 'border-neutral-200 bg-white'
            }`}
            onPress={handleVideoUpload}
          >
            <View className="flex-row items-center">
              <View className={`w-8 h-8 rounded border-2 mr-3 items-center justify-center ${
                coldStartVideo 
                  ? 'border-wreath-green bg-wreath-green' 
                  : 'border-neutral-300'
              }`}>
                {coldStartVideo ? (
                  <Text className="text-white text-sm font-bold">✓</Text>
                ) : (
                  <Text className="text-neutral-400 text-lg">🎥</Text>
                )}
              </View>
              <View className="flex-1">
                <Text className={`text-body font-medium ${
                  coldStartVideo ? 'text-wreath-green' : 'text-text-primary'
                }`}>
                  Cold-start video
                </Text>
                <Text className="text-caption text-text-muted">
                  Video of engine starting from cold
                </Text>
              </View>
              <Text className={`text-caption ${
                coldStartVideo ? 'text-wreath-green' : isVideoUploading ? 'text-yellow-600' : 'text-belize-blue'
              }`}>
                {isVideoUploading ? 'Uploading...' : coldStartVideo ? 'Uploaded' : 'Tap to add'}
              </Text>
            </View>
          </Pressable>
          
          <Text className="text-caption text-text-muted mt-1">
            Helps buyers assess engine condition (+10% completeness)
          </Text>
        </View>

        {/* Publishing Guidelines */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <Text className="text-caption text-blue-800 font-medium mb-2">
            📋 Before Publishing
          </Text>
          <Text className="text-caption text-blue-700 mb-1">
            • Double-check all information is accurate
          </Text>
          <Text className="text-caption text-blue-700 mb-1">
            • Photos clearly show vehicle condition
          </Text>
          <Text className="text-caption text-blue-700">
            • All known issues have been disclosed
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-neutral-200 bg-white" style={{ paddingBottom: 34 }}>
        <Pressable 
          className={`btn-primary ${(!allPhotosUploaded || isSubmitting || Object.values(uploadingPhotos).some(Boolean) || isVideoUploading) ? 'opacity-50' : ''}`}
          onPress={handlePublish}
          disabled={!allPhotosUploaded || isSubmitting || Object.values(uploadingPhotos).some(Boolean) || isVideoUploading}
        >
          <Text className="text-body text-white font-semibold">
            {Object.values(uploadingPhotos).some(Boolean) || isVideoUploading
              ? 'Uploading...'
              : isSubmitting 
                ? 'Creating Listing...' 
                : allPhotosUploaded 
                  ? 'Publish Listing' 
                  : `Upload ${REQUIRED_PHOTOS.length - uploadedCount} More Photos`
            }
          </Text>
        </Pressable>
        
        {!allPhotosUploaded && !isSubmitting && (
          <Text className="text-caption text-text-muted text-center mt-2">
            All photos required to publish
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}