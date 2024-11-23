import React from "react";
import { Stack } from "expo-router";

const SalesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="quotation" options={{ headerShown: false }} />
      <Stack.Screen name="panel-builder" options={{ headerShown: false }} />
      <Stack.Screen name="custom-panels" options={{ headerShown: false }} />
      <Stack.Screen name="view-order/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="view-custom-order/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default SalesLayout;
