import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
const CostSheet = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} className={"bg-zinc-800"}>
      <View className="w-full h-[10%] p-2 justify-start items-center flex-row">
        <FontAwesome name="dollar" size={34} color="maroon" />
        <Text className="font-semibold text-4xl text-white ml-2">Costs</Text>
      </View>
      <View className="w-full h-[90%] rounded-t-xl bg-zinc-200 p-2">
        {[
          { name: "Module Size", link: "/admin/variable-cost-calculator/ms1" },
          { name: "Panel Colors", link: "/admin/variable-cost-calculator/pc1" },
          { name: "Accessories", link: "/admin/variable-cost-calculator/a1" },
          { name: "C Section", link: "/admin/variable-cost-calculator/cse" },
          {
            name: "Touch Sense Board",
            link: "/admin/variable-cost-calculator/tsb",
          },
          { name: "Relay PCB", link: "/admin/variable-cost-calculator/pcb" },
          { name: "ESP", link: "/admin/variable-cost-calculator/esp" },
          { name: "Power Supply", link: "/admin/variable-cost-calculator/ps" },
          { name: "Screws", link: "/admin/variable-cost-calculator/scr" },
        ].map((item, index) => (
          <TouchableOpacity
            onPress={() => router.navigate(item.link)}
            activeOpacity={0.6}
            key={index}
            className="w-full border-b-[1px] border-zinc-300 py-2 flex-row justify-between items-center"
          >
            <Text className="font-normal text-base">{item.name}</Text>
            <AntDesign name="rightcircle" size={24} color="maroon" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default CostSheet;
