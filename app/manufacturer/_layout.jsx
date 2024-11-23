import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ManufacturerLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="worker" options={{ headerShown: false }} />
      <Stack.Screen name="add-worker" options={{ headerShown: false }} />
      <Stack.Screen name="quotation" options={{ headerShown: false }} />
      <Stack.Screen name="view-order/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="worker-detail/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default ManufacturerLayout;
