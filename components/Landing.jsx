import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import React from "react";

const Landing = () => {
  const { width } = Dimensions.get("window");
  return (
    <View style={{ width, flex: 1 }} className="justify-center items-center">
      <Image
        className="w-[300px] h-[300px]"
        resizeMode="contain"
        source={require("../assets/welcome.png")}
      />
      <View className="justify-center items-center mt-4">
        <Text className="font-semibold text-3xl text-red-700">
          Welcome, User
        </Text>
        <Text className="font-normal text-base text-zinc-200 px-6 text-center">
          Efficiently manage your orders with this app designed for Alisan,
          enabling you to track and oversee your orders.
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        className="w-[90%] bg-red-700 mt-10 rounded-full justify-center items-center p-4"
      >
        <Text className="text-white font-semibold text-xl">CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Landing;
