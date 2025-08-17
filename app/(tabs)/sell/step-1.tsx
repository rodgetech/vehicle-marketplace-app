import { useListingForm } from "@/contexts/ListingFormContext";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Common car makes in Belize
const CAR_MAKES = [
  "Toyota",
  "Honda",
  "Nissan",
  "Mazda",
  "Ford",
  "Chevrolet",
  "Hyundai",
  "Kia",
  "Mitsubishi",
  "Suzuki",
  "Subaru",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Jeep",
  "Dodge",
  "RAM",
  "GMC",
  "Isuzu",
  "Other",
];

const TITLE_TYPES = [
  {
    value: "clean",
    label: "Clean Title",
    description: "No major damage history",
  },
  {
    value: "salvage",
    label: "Salvage Title",
    description: "Declared total loss by insurance",
  },
  {
    value: "rebuilt",
    label: "Rebuilt Title",
    description: "Previously salvage, now repaired",
  },
] as const;

const DISTRICTS = [
  "Belize",
  "Cayo",
  "Corozal",
  "Orange Walk",
  "Stann Creek",
  "Toledo",
];

export default function SellStep1() {
  const router = useRouter();
  const { user } = useUser();
  const { formData, updateFormData, resetForm } = useListingForm();

  // Local state for form fields
  const [year, setYear] = useState(formData.year);
  const [make, setMake] = useState(formData.make);
  const [customMake, setCustomMake] = useState(formData.customMake);
  const [model, setModel] = useState(formData.model);
  const [trim, setTrim] = useState(formData.trim);
  const [titleType, setTitleType] = useState(formData.titleType);
  const [importedFromUS, setImportedFromUS] = useState(formData.importedFromUS);
  const [district, setDistrict] = useState(
    formData.district ||
      user?.unsafeMetadata?.district ||
      user?.publicMetadata?.district ||
      ""
  );

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data from user profile on mount
  useEffect(() => {
    if (
      !formData.district &&
      (user?.unsafeMetadata?.district || user?.publicMetadata?.district)
    ) {
      const userDistrict =
        user?.unsafeMetadata?.district || user?.publicMetadata?.district || "";
      setDistrict(userDistrict);
      updateFormData({ district: userDistrict });
    }
  }, [user]);

  // Generate years (1990 to current + 1)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) =>
    (currentYear + 1 - i).toString()
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!year) newErrors.year = "Year is required";
    if (!make) newErrors.make = "Make is required";
    if (make === "Other" && !customMake)
      newErrors.customMake = "Please specify the make";
    if (!model.trim()) newErrors.model = "Model is required";
    if (!district) newErrors.district = "District is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    resetForm();
    router.push('/(tabs)/sell');
  };

  const handleNext = () => {
    if (!validateForm()) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    // Save form data to context
    updateFormData({
      year,
      make,
      customMake,
      model,
      trim,
      titleType,
      importedFromUS,
      district,
    });

    router.push("/(tabs)/sell/step-2");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-4 pb-2 border-b border-neutral-200">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable onPress={handleCancel}>
            <Text className="text-body text-belize-blue">Cancel</Text>
          </Pressable>
          <Text className="text-body text-text-primary font-medium">
            Step 1 of 4
          </Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Progress Bar */}
        <View className="bg-neutral-200 h-1 rounded-full">
          <View
            className="bg-belize-blue h-1 rounded-full"
            style={{ width: "25%" }}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-h1 text-text-primary font-semibold mb-2">
          Vehicle Basics
        </Text>
        <Text className="text-body text-text-muted mb-6">
          Tell us about your vehicle
        </Text>

        {/* Year */}
        <View className="mb-4">
          <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
            Year *
          </Text>
          <View className="border border-neutral-200 rounded-xl bg-white">
            <Pressable className="p-4">
              {/* TODO: Implement dropdown */}
              <TextInput
                placeholder="Select year..."
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
                className="text-body text-text-primary"
              />
            </Pressable>
          </View>
          {errors.year && (
            <Text className="text-caption text-flag-red mt-1">
              {errors.year}
            </Text>
          )}
        </View>

        {/* Make */}
        <View className="mb-4">
          <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
            Make *
          </Text>
          <View className="border border-neutral-200 rounded-xl bg-white">
            <Pressable className="p-4">
              {/* TODO: Implement dropdown */}
              <TextInput
                placeholder="Select make..."
                value={make}
                onChangeText={setMake}
                className="text-body text-text-primary"
              />
            </Pressable>
          </View>
          {errors.make && (
            <Text className="text-caption text-flag-red mt-1">
              {errors.make}
            </Text>
          )}
        </View>

        {/* Custom Make (if Other selected) */}
        {make === "Other" && (
          <View className="mb-4">
            <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
              Specify Make *
            </Text>
            <TextInput
              className="input-base"
              placeholder="Enter vehicle make..."
              value={customMake}
              onChangeText={setCustomMake}
              autoCapitalize="words"
            />
            {errors.customMake && (
              <Text className="text-caption text-flag-red mt-1">
                {errors.customMake}
              </Text>
            )}
          </View>
        )}

        {/* Model */}
        <View className="mb-4">
          <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
            Model *
          </Text>
          <TextInput
            className="input-base"
            placeholder="e.g., Corolla, Civic, F-150..."
            value={model}
            onChangeText={setModel}
            autoCapitalize="words"
          />
          {errors.model && (
            <Text className="text-caption text-flag-red mt-1">
              {errors.model}
            </Text>
          )}
        </View>

        {/* Trim (Optional) */}
        <View className="mb-6">
          <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
            Trim (Optional)
          </Text>
          <TextInput
            className="input-base"
            placeholder="e.g., LE, EX, XLT..."
            value={trim}
            onChangeText={setTrim}
            autoCapitalize="words"
          />
        </View>

        {/* Title Type */}
        <View className="mb-6">
          <Text className="text-label text-text-muted mb-3 uppercase tracking-wider">
            Title Type *
          </Text>
          <View className="space-y-3">
            {TITLE_TYPES.map((type) => (
              <Pressable
                key={type.value}
                className={`p-4 rounded-xl border-2 ${
                  titleType === type.value
                    ? "border-belize-blue bg-belize-blue/5"
                    : "border-neutral-200 bg-white"
                }`}
                onPress={() => setTitleType(type.value)}
              >
                <Text
                  className={`text-body font-semibold ${
                    titleType === type.value
                      ? "text-belize-blue"
                      : "text-text-primary"
                  }`}
                >
                  {type.label}
                </Text>
                <Text className="text-caption text-text-muted mt-1">
                  {type.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Imported from US */}
        <View className="mb-6">
          <Text className="text-label text-text-muted mb-3 uppercase tracking-wider">
            Imported from U.S.?
          </Text>
          <View className="flex-row space-x-3">
            <Pressable
              className={`flex-1 p-4 rounded-xl border-2 ${
                importedFromUS
                  ? "border-belize-blue bg-belize-blue/5"
                  : "border-neutral-200 bg-white"
              }`}
              onPress={() => setImportedFromUS(true)}
            >
              <Text
                className={`text-body font-semibold text-center ${
                  importedFromUS ? "text-belize-blue" : "text-text-primary"
                }`}
              >
                Yes
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 p-4 rounded-xl border-2 ${
                !importedFromUS
                  ? "border-belize-blue bg-belize-blue/5"
                  : "border-neutral-200 bg-white"
              }`}
              onPress={() => setImportedFromUS(false)}
            >
              <Text
                className={`text-body font-semibold text-center ${
                  !importedFromUS ? "text-belize-blue" : "text-text-primary"
                }`}
              >
                No
              </Text>
            </Pressable>
          </View>
        </View>

        {/* District */}
        <View className="mb-8">
          <Text className="text-label text-text-muted mb-2 uppercase tracking-wider">
            District *
          </Text>
          <View className="border border-neutral-200 rounded-xl bg-white">
            <Pressable className="p-4">
              {/* TODO: Implement dropdown */}
              <TextInput
                placeholder="Select district..."
                value={district}
                onChangeText={setDistrict}
                className="text-body text-text-primary"
              />
            </Pressable>
          </View>
          {errors.district && (
            <Text className="text-caption text-flag-red mt-1">
              {errors.district}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-neutral-200 bg-white"
        style={{ paddingBottom: 34 }}
      >
        <Pressable className="btn-primary" onPress={handleNext}>
          <Text className="text-body text-white font-semibold">
            Next: Vehicle Specs
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
