import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { RecoilRoot } from "recoil";
import { useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <RecoilRoot>
      <RootLayoutStack />
    </RecoilRoot>
  );
};

const RootLayoutStack = () => {
  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="sales" options={{ headerShown: false }} />
        <Stack.Screen name="worker" options={{ headerShown: false }} />
        <Stack.Screen name="manufacturer" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default RootLayout;
