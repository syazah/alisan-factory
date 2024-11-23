import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import url from "../../../url";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCameraPermissions } from "expo-camera";
const WorkerDetail = () => {
  const { id } = useLocalSearchParams();
  const [worker, setWorker] = useState(null);
  
  async function handleDeleteWorker() {
    try {
      const res = await fetch(`${url}/api/v1/manufacturer/delete-worker`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success === true) {
        Alert.alert("Success", "The Worker is deleted");
        return router.replace("/manufacturer");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert("Something Went Wrong While Deleting Worker");
    }
  }
  async function getWorkerDetail() {
    try {
      const res = await fetch(
        `${url}/api/v1/manufacturer/get-worker-detail/${id}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        }
      );
      const data = await res.json();
      if (data.success === true) {
        return setWorker(data.worker);
      } else {
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert(
        "Error",
        "Something went wrong while getting worker details"
      );
    }
  }
  React.useEffect(() => {
    getWorkerDetail();
  }, []);
  if (worker === null) {
    return (
      <SafeAreaView
        className={"w-full flex-1 bg-zinc-800 justify-center items-center"}
      >
        <ActivityIndicator color="red" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-zinc-800">
      <View className="w-full h-[15%]">
        <View className="w-full p-2 border-b-[1px] border-red-600 flex-row justify-between items-center">
          <View className="">
            <Text className="text-white text-2xl font-semibold">
              {worker.name}
            </Text>
            <Text className="text-red-600 text-sm font-semibold capitalize">
              worker
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Delete Worker",
                "Do you really want to delete this worker, all orders assigned to this worker will be assigned to the manufacturer",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  { text: "Delete", onPress: () => handleDeleteWorker() },
                ],
                { cancellable: true }
              )
            }
            className="w-10 h-10 bg-red-600 rounded-full justify-center items-center"
          >
            <AntDesign name="delete" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View className="w-full border-b-[1px] border-zinc-700 flex-row justify-between items-center p-2">
          <Text className="text-white">Contact</Text>
          <Text className="text-white">+91-{worker.phone}</Text>
        </View>
      </View>
      <View className="">
        <Text className="text-xl text-red-600 p-2">Orders</Text>
      </View>
      <FlatList
        data={worker.orders}
        ListEmptyComponent={
          <View>
            <Text className="text-white font-semibold px-2">
              No Orders Assigned
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="border-b-[1px] border-zinc-700">
            <Text className="text-white">{item.referenceNumber}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default WorkerDetail;
