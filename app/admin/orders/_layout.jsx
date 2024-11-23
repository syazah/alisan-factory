import { View, Text, Alert } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import url from "../../../url";
const TabBarIcon = ({ icon }) => {
  return <View className="">{icon}</View>;
};
const OrderLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "red",
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 40,
          borderRadius: 10,
          marginBottom: 10,
          marginLeft: 8,
          marginRight: 8,
          position: "absolute",
          backgroundColor: "#000",
          borderColor: "#000",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              icon={<Ionicons name="home" size={24} color={color} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="salesorders"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              icon={<Fontisto name="shopping-sale" size={28} color={color} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="manufacturingorders"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              icon={
                <MaterialIcons
                  name="precision-manufacturing"
                  size={28}
                  color={color}
                />
              }
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default OrderLayout;