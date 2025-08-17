import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="welcome" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="profile-setup" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}