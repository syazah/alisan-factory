import { View, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";

const AdminLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="salesteam" options={{ headerShown: false }} />
      <Stack.Screen name="manufacturingteam" options={{ headerShown: false }} />
      <Stack.Screen name="orders" options={{ headerShown: false }} />
      <Stack.Screen name="inventory" options={{ headerShown: false }} />
      <Stack.Screen name="quotation" options={{ headerShown: false }} />
      <Stack.Screen name="view-order/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="view-sales/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="variable-cost-calculator/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="order-bom" options={{ headerShown: false }} />
      <Stack.Screen name="cost-sheet" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AdminLayout;
