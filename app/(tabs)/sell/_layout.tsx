import { Stack } from 'expo-router';
import { ListingFormProvider } from '@/contexts/ListingFormContext';

export default function SellLayout() {
  return (
    <ListingFormProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            title: 'Sell Your Car'
          }} 
        />
        <Stack.Screen 
          name="step-1" 
          options={{ 
            headerShown: false,
            title: 'Vehicle Basics'
          }} 
        />
        <Stack.Screen 
          name="step-2" 
          options={{ 
            headerShown: false,
            title: 'Vehicle Specs'
          }} 
        />
        <Stack.Screen 
          name="step-3" 
          options={{ 
            headerShown: false,
            title: 'Known Issues'
          }} 
        />
        <Stack.Screen 
          name="step-4" 
          options={{ 
            headerShown: false,
            title: 'Photos & VIN'
          }} 
        />
      </Stack>
    </ListingFormProvider>
  );
}