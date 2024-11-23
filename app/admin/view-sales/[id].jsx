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
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import url from "../../../url";
const ViewSalesMan = () => {
  const { id } = useLocalSearchParams();
  const [salesman, setSalesman] = useState(null);
  async function getSalesMan() {
    try {
      const res = await fetch(`${url}/api/v1/admin/view-salesman`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success === true) {
        setSalesman(data.salesman);
      } else {
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert(
        "Error",
        "Something went wrong while getting the Salesman"
      );
    }
  }

  async function DeleteSalesman() {
    try {
      const res = await fetch(`${url}/api/v1/admin/delete-salesman`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ _id: id }),
      });
      const data = await res.json();
      if (data.success === true) {
        return Alert.alert("Success", "Salesman is deleted");
      } else {
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while deleting the sales man");
    }
  }

  React.useEffect(() => {
    getSalesMan();
  }, []);

  if (salesman === null) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-800 justify-center items-center">
        <ActivityIndicator color="red" />
        <Text className="text-white mt-2">Fetching The Salesman</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-zinc-100">
      <View className="w-full h-[10%] bg-zinc-100 p-2 flex-row justify-between items-center">
        <View>
          <Text className="font-semibold text-3xl">{salesman.name}</Text>
          <Text className="font-semibold text-xl -mt-2 text-red-600">
            Salesman
          </Text>
        </View>
        <View className="w-10 h-10 bg-red-600 rounded-full justify-center items-center">
          <AntDesign name="delete" size={24} color="white" />
        </View>
      </View>
      <View className="w-full h-[90%] rounded-t-xl bg-zinc-800 p-2">
        {/* USER DATA  */}
        <View className="flex-row border-b-[1px] border-zinc-700 p-2 justify-between items-center">
          <AntDesign name="mail" size={20} color="red" />
          <Text className="text-base text-white">{salesman.email}</Text>
        </View>
        <View className="flex-row border-b-[1px] border-zinc-700 p-2 justify-between items-center">
          <AntDesign name="phone" size={20} color="red" />
          <Text className="text-base text-white">
            +91-{salesman.phoneNumber}
          </Text>
        </View>

        {/* ORDER DATA  */}
        <Text className="text-xl font-semibold text-red-600 mt-2 mb-2">
          Orders Assigned
        </Text>
        {salesman.orders.length === 0 ? (
          <View className="w-full h-full justify-center items-center">
            <Text className="text-white font-semibold text-lg">
              No Orders assigned to this salesman
            </Text>
          </View>
        ) : (
          <FlatList
            data={salesman.orders}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => {
              const now = new Date();
              const createdAt = item.updatedAt;
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
                  activeOpacity={0.7}
                  onPress={() =>
                    router.navigate(`/admin/view-order/${item._id}`)
                  }
                  className="border-b-[1px] border-white p-2"
                >
                  <View className="flex-row justify-between items-center">
                    <AntDesign name="paperclip" size={20} color="red" />
                    <Text className="text-white">#{item.referenceNumber}</Text>
                  </View>
                  <Text className="text-xs self-end text-zinc-200">
                    {timeAgoMessage}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ViewSalesMan;
