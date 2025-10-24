import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { OrderProvider } from '@/contexts/OrderContext';

export const unstable_settings = {
  initialRouteName: 'splash',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <OrderProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="order/category" options={{ headerShown: false }} />
          <Stack.Screen name="order/origin" options={{ headerShown: false }} />
          <Stack.Screen name="order/destination" options={{ headerShown: false }} />
          <Stack.Screen name="order/details" options={{ headerShown: false }} />
          <Stack.Screen name="order/payment" options={{ headerShown: false }} />
          <Stack.Screen name="order/summary" options={{ headerShown: false }} />
          <Stack.Screen name="order/matching" options={{ headerShown: false }} />
          <Stack.Screen name="order/tracking" options={{ headerShown: false }} />
          <Stack.Screen name="order/completed" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </OrderProvider>
  );
}
