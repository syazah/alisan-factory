import { View, Text, Alert } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import url from "../../../url";
const TabBarIcon = ({ icon }) => {
  return (
    <View className="h-full flex justify-center items-center">{icon}</View>
  );
};
const OrderLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon icon={<Ionicons name="home" size={24} color={color} />} />
          ),
        }}
      />
      <Stack.Screen
        name="customer"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon icon={<Ionicons name="home" size={24} color={color} />} />
          ),
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon icon={<Ionicons name="home" size={24} color={color} />} />
          ),
        }}
      />
    </Stack>
  );
};

export default OrderLayout;
