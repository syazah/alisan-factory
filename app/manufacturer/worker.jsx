import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import url from "../../url";
const Worker = () => {
  const [workers, setWorkers] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  async function GetWorkers() {
    try {
      const res = await fetch(`${url}/api/v1/manufacturer/get-worker`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        setWorkers(data.workers);
      } else {
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert("Error", "Something went wrong while fetching worker");
    }
  }
  function handleRefreshing() {
    setRefreshing(true);
    GetWorkers();
    setRefreshing(false);
  }
  useEffect(() => {
    handleRefreshing();
  }, []);

  if (workers === null) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-zinc-800">
        <ActivityIndicator color="red" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-zinc-200">
      <View className="w-full flex-row h-[8%] justify-between items-center p-2">
        <Text className="text-red-800 font-semibold text-4xl">Workers</Text>
        <TouchableOpacity
          onPress={() => router.navigate("/manufacturer/add-worker")}
        >
          <Ionicons name="add-circle" size={48} color="maroon" />
        </TouchableOpacity>
      </View>
      <View className="w-full h-[92%] bg-zinc-800 rounded-t-xl p-2">
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefreshing}
          data={workers}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-4">
              <Text className="text-white font-semibold text-lg">
                No worker found
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.navigate(`/manufacturer/worker-detail/${item._id}`)
              }
              className="w-full border-b-[1px] border-zinc-700 flex-row"
            >
              <View className="w-[10%] justify-center items-center">
                <AntDesign name="user" size={24} color="red" />
              </View>
              <View className="w-[90%]">
                <Text className="text-white font-light text-base">
                  {item.name}
                </Text>
                <Text className="text-white font-light text-base">
                  +91-{item.phone}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Worker;
