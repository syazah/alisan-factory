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
import AntDesign from "@expo/vector-icons/AntDesign";
import url from "../../../url";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
const AdminOrders = () => {
  const [adminOrder, setAdminOrder] = React.useState(null);
  const [salesOrder, setSalesOrder] = React.useState(null);
  const [completedOrders, setCompletedOrders] = React.useState(null);
  const [currentOrderType, setCurrentOrderType] = React.useState("new");
  async function ViewOrders() {
    try {
      const res = await fetch(`${url}/api/v1/admin/admin-orders`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        setSalesOrder(data.SalesOrders);
        setCompletedOrders(data.CompletedOrders);
        return setAdminOrder(data.AdminOrders);
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
  if (adminOrder === null) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-zinc-800 justify-center items-center"
      >
        <ActivityIndicator color={"red"} />
        <Text className="mt-6 text-white">Fetching Admin Orders</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-100">
      <View className="w-full h-[10%] bg-zinc-100 justify-center items-start p-2">
        <Text className="text-3xl text-red-600 font-semibold">
          Stage-<Text className="text-black">Admin</Text>
        </Text>
      </View>
      <View className="w-full h-[90%] bg-zinc-800 rounded-t-xl pt-2">
        <Picker
          selectedValue={currentOrderType}
          onValueChange={(value) => setCurrentOrderType(value)}
          dropdownIconColor="white"
          style={{ width: "100%", color: "white" }}
        >
          <Picker.Item value="new" label="New Orders" />
          <Picker.Item value="sales" label="From Sales Man" />
          <Picker.Item value="completed" label="Completed Orders" />
        </Picker>

        <View className="w-full h-full bg-zinc-800 rounded-t-xl pt-2">
          <FlatList
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center">
                <Text className="text-white font-semibold">
                  **No Orders To Show Here
                </Text>
              </View>
            }
            data={
              currentOrderType === "new"
                ? adminOrder
                : currentOrderType === "completed"
                ? completedOrders
                : salesOrder
            }
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => {
              const now = new Date();
              const createdAt = item.createdAt;
              const createdTime = new Date(createdAt);
              const diffInSeconds = Math.floor((now - createdTime) / 1000); // Time difference in seconds

              let timeAgoMessage = ""; // Variable to store the result

              if (diffInSeconds < 60) {
                timeAgoMessage = `${diffInSeconds} seconds ago`;
              } else if (diffInSeconds < 3600) {
                // Less than an hour
                const minutes = Math.floor(diffInSeconds / 60);
                timeAgoMessage = `${minutes} minutes ago`;
              } else if (diffInSeconds < 86400) {
                // Less than a day
                const hours = Math.floor(diffInSeconds / 3600);
                timeAgoMessage = `${hours} hours ago`;
              } else {
                const days = Math.floor(diffInSeconds / 86400);
                timeAgoMessage = `${days} days ago`;
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdminOrders;
