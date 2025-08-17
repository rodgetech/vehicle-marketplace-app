import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useListingForm } from '@/contexts/ListingFormContext';

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

export default function SellStep3() {
  const router = useRouter();
  const { formData, updateFormData, resetForm } = useListingForm();
  
  // Form state from context
  const [hasNoKnownIssues, setHasNoKnownIssues] = useState(formData.hasNoKnownIssues);
  const [selectedIssues, setSelectedIssues] = useState<string[]>(formData.selectedIssues);
  const [customIssue, setCustomIssue] = useState('');
  const [customIssues, setCustomIssues] = useState<string[]>(formData.customIssues);

  const toggleIssue = (issueId: string) => {
    if (hasNoKnownIssues) {
      setHasNoKnownIssues(false);
    }
    
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const toggleNoKnownIssues = () => {
    if (!hasNoKnownIssues) {
      // Clear all issues when selecting "no known issues"
      setSelectedIssues([]);
      setCustomIssues([]);
      setCustomIssue('');
    }
    setHasNoKnownIssues(!hasNoKnownIssues);
  };

  const addCustomIssue = () => {
    if (customIssue.trim() && !customIssues.includes(customIssue.trim())) {
      if (hasNoKnownIssues) {
        setHasNoKnownIssues(false);
      }
      setCustomIssues(prev => [...prev, customIssue.trim()]);
      setCustomIssue('');
    }
  };

  const removeCustomIssue = (issue: string) => {
    setCustomIssues(prev => prev.filter(i => i !== issue));
  };

  const validateForm = () => {
    // Either must select "no known issues" OR have at least one issue selected
    if (!hasNoKnownIssues && selectedIssues.length === 0 && customIssues.length === 0) {
      Alert.alert(
        'Required Information', 
        'Please either select "No known issues" or specify any known issues with the vehicle.'
      );
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    resetForm();
    router.push('/(tabs)/sell');
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    // Save form data to context
    updateFormData({
      hasNoKnownIssues,
      selectedIssues,
      customIssues,
    });

    router.push('/(tabs)/sell/step-4');
  };

  const handleBack = () => {
    router.push('/(tabs)/sell/step-2');
  };

  const allKnownIssues = [
    ...selectedIssues.map(id => COMMON_ISSUES.find(issue => issue.id === id)?.label || ''),
    ...customIssues
  ].filter(Boolean);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 border-b border-neutral-200">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable onPress={handleBack}>
            <Text className="text-body text-belize-blue">Back</Text>
          </Pressable>
          <Text className="text-body text-text-primary font-medium">Step 3 of 4</Text>
          <Pressable onPress={handleCancel}>
            <Text className="text-body text-text-muted">Cancel</Text>
          </Pressable>
        </View>
        
        {/* Progress Bar */}
        <View className="bg-neutral-200 h-1 rounded-full">
          <View className="bg-belize-blue h-1 rounded-full" style={{ width: '75%' }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-h1 text-text-primary font-semibold mb-2">
          Known Issues
        </Text>
        <Text className="text-body text-text-muted mb-6">
          Honest disclosure builds buyer trust and saves everyone time
        </Text>

        {/* Transparency Info */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <Text className="text-caption text-yellow-800 font-medium mb-1">
            🛡️ Why disclose issues?
          </Text>
          <Text className="text-caption text-yellow-700">
            Transparent listings rank higher, attract serious buyers, and build your reputation as a trustworthy seller.
          </Text>
        </View>

        {/* No Known Issues Toggle */}
        <Pressable
          className={`p-4 rounded-xl border-2 mb-6 ${
            hasNoKnownIssues 
              ? 'border-wreath-green bg-green-50' 
              : 'border-neutral-200 bg-white'
          }`}
          onPress={toggleNoKnownIssues}
        >
          <View className="flex-row items-center">
            <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
              hasNoKnownIssues 
                ? 'border-wreath-green bg-wreath-green' 
                : 'border-neutral-300'
            }`}>
              {hasNoKnownIssues && (
                <Text className="text-white text-xs font-bold">✓</Text>
              )}
            </View>
            <View className="flex-1">
              <Text className={`text-body font-semibold ${
                hasNoKnownIssues ? 'text-wreath-green' : 'text-text-primary'
              }`}>
                No known issues
              </Text>
              <Text className="text-caption text-text-muted">
                Vehicle is in good working condition
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-neutral-200" />
          <Text className="text-caption text-text-muted mx-4">OR</Text>
          <View className="flex-1 h-px bg-neutral-200" />
        </View>

        {/* Common Issues */}
        <Text className="text-body text-text-primary font-semibold mb-3">
          Select any known issues:
        </Text>
        
        <View className="space-y-3 mb-6">
          {COMMON_ISSUES.map((issue) => (
            <Pressable
              key={issue.id}
              className={`p-4 rounded-xl border-2 ${
                selectedIssues.includes(issue.id) 
                  ? 'border-flag-red bg-red-50' 
                  : 'border-neutral-200 bg-white'
              }`}
              onPress={() => toggleIssue(issue.id)}
            >
              <View className="flex-row items-center">
                <View className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                  selectedIssues.includes(issue.id) 
                    ? 'border-flag-red bg-flag-red' 
                    : 'border-neutral-300'
                }`}>
                  {selectedIssues.includes(issue.id) && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>
                <Text className={`text-body ${
                  selectedIssues.includes(issue.id) ? 'text-flag-red font-medium' : 'text-text-primary'
                }`}>
                  {issue.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Custom Issue Input */}
        <View className="mb-6">
          <Text className="text-body text-text-primary font-semibold mb-3">
            Other issues not listed:
          </Text>
          
          <View className="flex-row space-x-3 mb-3">
            <TextInput
              className="flex-1 input-base"
              placeholder="Describe any other issues..."
              value={customIssue}
              onChangeText={setCustomIssue}
              multiline
              numberOfLines={2}
            />
            <Pressable
              className={`px-4 py-3 rounded-xl ${
                customIssue.trim() ? 'bg-belize-blue' : 'bg-neutral-200'
              }`}
              onPress={addCustomIssue}
              disabled={!customIssue.trim()}
            >
              <Text className={`text-body font-semibold ${
                customIssue.trim() ? 'text-white' : 'text-neutral-400'
              }`}>
                Add
              </Text>
            </Pressable>
          </View>

          {/* Custom Issues List */}
          {customIssues.map((issue, index) => (
            <View key={index} className="flex-row items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl mb-2">
              <Text className="flex-1 text-body text-flag-red">{issue}</Text>
              <Pressable onPress={() => removeCustomIssue(issue)}>
                <Text className="text-flag-red text-lg">×</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Summary */}
        {(hasNoKnownIssues || allKnownIssues.length > 0) && (
          <View className="card-base mb-8">
            <Text className="text-body text-text-primary font-semibold mb-2">
              Disclosure Summary:
            </Text>
            {hasNoKnownIssues ? (
              <Text className="text-caption text-wreath-green">
                ✓ No known issues declared
              </Text>
            ) : (
              <View>
                <Text className="text-caption text-text-muted mb-2">
                  Known issues ({allKnownIssues.length}):
                </Text>
                {allKnownIssues.map((issue, index) => (
                  <Text key={index} className="text-caption text-flag-red">
                    • {issue}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-neutral-200 bg-white" style={{ paddingBottom: 34 }}>
        <Pressable 
          className="btn-primary"
          onPress={handleNext}
        >
          <Text className="text-body text-white font-semibold">
            Next: Photos & VIN
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}