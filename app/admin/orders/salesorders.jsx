import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import url from "../../../url";
import { router } from "expo-router";
const SalesOrders = () => {
  const [salesOrder, setSalesOrder] = React.useState(null);
  async function ViewOrders() {
    try {
      const res = await fetch(`${url}/api/v1/admin/sales-orders`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        return setSalesOrder(data.SalesOrders);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert(
        "Error",
        "Something went wrong while fetching order details"
      );
    }
  }
  React.useEffect(() => {
    ViewOrders();
  }, []);
  if (salesOrder === null) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-zinc-800 justify-center items-center"
      >
        <ActivityIndicator color={"red"} />
        <Text className="mt-6 text-white">Fetching Sales Orders</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-100">
      <View className="w-full h-[10%] bg-zinc-100 justify-center items-start p-2">
        <Text className="text-3xl text-red-600 font-semibold">
          Stage-<Text className="text-black">Sales</Text>
        </Text>
      </View>
      <View className="w-full h-[90%] bg-zinc-800 rounded-t-xl pt-4">
        {salesOrder.length === 0 ? (
          <View className="w-full h-[90%] bg-zinc-800 rounded-t-xl pt-4 justify-center items-center">
            <Fontisto name="shopping-sale" size={34} color="red" />
            <Text className="text-white font-normal text-base">
              No Orders Assigned To Any Salesman
            </Text>
          </View>
        ) : (
          <FlatList
            data={salesOrder}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => {
              const now = new Date();
              const createdAt = item.updatedAt;
              const createdTime = new Date(createdAt);
              const diffInSeconds = Math.floor((now - createdTime) / 1000); // Time difference in seconds

              let timeAgoMessage = ""; // Variable to store the result

              if (diffInSeconds < 60) {
                timeAgoMessage = `assigned ${diffInSeconds} seconds ago`;
              } else if (diffInSeconds < 3600) {
                // Less than an hour
                const minutes = Math.floor(diffInSeconds / 60);
                timeAgoMessage = `assigned ${minutes} minutes ago`;
              } else if (diffInSeconds < 86400) {
                // Less than a day
                const hours = Math.floor(diffInSeconds / 3600);
                timeAgoMessage = `assigned ${hours} hours ago`;
              } else {
                const days = Math.floor(diffInSeconds / 86400);
                timeAgoMessage = `assigned ${days} days ago`;
              }
              return (
                <TouchableOpacity
                  onPress={() =>
                    router.navigate(`/admin/view-order/${item._id}`)
                  }
                  activeOpacity={0.8}
                  className="w-full p-2 border-b-[1px] border-white flex-row"
                >
                  <View className="w-[90%]">
                    <Text className="text-red-600 font-semibold">
                      Reference Number-{" "}
                      <Text className="text-white">
                        #{item.referenceNumber}
                      </Text>
                    </Text>
                    <Text className="text-red-600 font-semibold">
                      Panels-{" "}
                      <Text className="text-white">
                        {item.panelData.length}
                      </Text>
                    </Text>
                    <Text className="text-red-600 font-semibold">
                      Assigned To-{" "}
                      <Text className="text-white">{item.assignedTo.name}</Text>
                    </Text>
                    <Text className="text-white text-xs">{timeAgoMessage}</Text>
                  </View>
                  <View className="w-[10%] justify-center items-center">
                    <View className="w-6 h-6 bg-zinc-100 rounded-full justify-center items-center">
                      <AntDesign name="rightcircle" size={20} color="maroon" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SalesOrders;
