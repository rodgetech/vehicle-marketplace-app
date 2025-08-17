import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Id } from '@/convex/_generated/dataModel';

export interface ListingFormData {
  // Step 1: Vehicle Basics
  year: string;
  make: string;
  customMake: string;
  model: string;
  trim: string;
  titleType: 'clean' | 'salvage' | 'rebuilt';
  importedFromUS: boolean;
  district: string;
  
  // Step 2: Vehicle Specs
  price: string;
  mileage: string;
  transmission: 'manual' | 'automatic' | 'cvt';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  
  // Step 3: Known Issues
  hasNoKnownIssues: boolean;
  selectedIssues: string[];
  customIssues: string[];
  
  // Step 4: Photos & VIN
  uploadedPhotos: Record<string, Id<"_storage">>; // photoId -> Convex storage ID
  vin: string;
  coldStartVideo: Id<"_storage"> | null;
}

const initialFormData: ListingFormData = {
  year: '',
  make: '',
  customMake: '',
  model: '',
  trim: '',
  titleType: 'clean',
  importedFromUS: false,
  district: '',
  price: '',
  mileage: '',
  transmission: 'automatic',
  fuelType: 'gasoline',
  hasNoKnownIssues: false,
  selectedIssues: [],
  customIssues: [],
  uploadedPhotos: {},
  vin: '',
  coldStartVideo: null,
};

interface ListingFormContextType {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  resetForm: () => void;
  getCompletenessScore: () => number;
}

const ListingFormContext = createContext<ListingFormContextType | undefined>(undefined);

export function ListingFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ListingFormData>(initialFormData);

  const updateFormData = (data: Partial<ListingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const getCompletenessScore = () => {
    let score = 0;
    
    // Required photos (40%)
    const requiredPhotoIds = ['front', 'rear', 'left_side', 'right_side', 'interior', 'odometer', 'engine_bay', 'tires'];
    const uploadedCount = requiredPhotoIds.filter(id => formData.uploadedPhotos[id]).length;
    const photoScore = Math.min(uploadedCount / requiredPhotoIds.length, 1) * 40;
    score += photoScore;
    
    // Issues answered (20%)
    const issuesScore = (formData.hasNoKnownIssues || formData.selectedIssues.length > 0 || formData.customIssues.length > 0) ? 20 : 0;
    score += issuesScore;
    
    // VIN present (20% - required if imported from US)
    if (formData.importedFromUS) {
      const vinScore = formData.vin.trim().length >= 17 ? 20 : 0;
      score += vinScore;
    } else {
      // Partial credit if not imported
      const vinScore = formData.vin.trim().length >= 17 ? 20 : 10;
      score += vinScore;
    }
    
    // Cold-start video (10%)
    const videoScore = formData.coldStartVideo ? 10 : 0;
    score += videoScore;
    
    // Odometer close-up (10%)
    const odometerScore = formData.uploadedPhotos.odometer ? 10 : 0;
    score += odometerScore;
    
    return Math.round(score);
  };

  return (
    <ListingFormContext.Provider value={{
      formData,
      updateFormData,
      resetForm,
      getCompletenessScore
    }}>
      {children}
    </ListingFormContext.Provider>
  );
}

export function useListingForm() {
  const context = useContext(ListingFormContext);
  if (context === undefined) {
    throw new Error('useListingForm must be used within a ListingFormProvider');
  }
  return context;
}