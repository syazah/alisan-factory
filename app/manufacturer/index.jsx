import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import url from "../../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
const ManufacturerMainScreen = () => {
  const [Manufacturer, setManufacturerMan] = useState(null);
  const [orders, setOrders] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  async function GetManufacturerDetails() {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        `${url}/api/v1/manufacturer/manufacturer-details`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );
      const data = await res.json();
      if (data.success === true) {
        setManufacturerMan(data.manufacturer);
        setOrders(data.orders);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert(
        "Error",
        "Something went wrong while getting Manufacturer details"
      );
    }
  }
  async function LogOut() {
    try {
      await AsyncStorage.multiRemove(["token", "userType"]);
      return router.replace("/");
    } catch (error) {
      return Alert.alert("Error", "Something Went Wrong");
    }
  }
  function HandleRefresh() {
    setRefreshing(true);
    GetManufacturerDetails();
    setRefreshing(false);
  }
  React.useEffect(() => {
    HandleRefresh();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-100 relative">
      {Manufacturer === null || orders === null ? (
        <View style={{ flex: 1 }} className="bg-zinc-800">
          <ActivityIndicator color={"red"} style={{ flex: 1 }} />
        </View>
      ) : (
        <View className="flex-1">
          {/* NAVBAR  */}
          <View className="w-full h-[12%] p-4 flex-row justify-between items-start bg-zinc-100">
            <View className="justify-start items-start">
              <Text className="font-semibold text-2xl text-zinc-800">
                👋Hello,{" "}
                <Text className="text-red-600">{Manufacturer.name}</Text>
              </Text>
              <Text className="font-semibold text-base text-zinc-700">
                Manufacturer Account
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Log Out",
                  "Do you want to logout from the current user type ?",
                  [
                    { text: "cancel", style: "cancel" },
                    { text: "Logout", onPress: () => LogOut() },
                  ],
                  { cancelable: true }
                );
              }}
              className="w-14 h-14 rounded-full bg-red-700 justify-center items-center border-[2px] border-zinc-800"
            >
              <Text className="font-semibold text-2xl uppercase text-white ">{`${
                Manufacturer.name.slice()[0]
              }${Manufacturer.name.slice()[1]}`}</Text>
            </TouchableOpacity>
          </View>
          <View className="w-full h-[88%] bg-zinc-800 rounded-t-xl p-2">
            <View className="justify-between items-center flex-row">
              <Text className="text-white font-semibold text-lg border-b-[1px] border-red-600">
                Assigned Orders
              </Text>
              <View className="w-6 h-6 bg-red-600 rounded-full justify-center items-center">
                <Text className="font-semibold">{orders.length}</Text>
              </View>
            </View>
            {orders.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-white font-semibold">
                  **No order assigned currently
                </Text>
              </View>
            ) : (
              <FlatList
                data={orders}
                refreshing={refreshing}
                onRefresh={HandleRefresh}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      router.navigate(`/manufacturer/view-order/${item._id}`)
                    }
                    activeOpacity={0.7}
                    className="border-b-[1px] border-zinc-700 p-2 flex-row justify-between items-start"
                  >
                    <View className="w-[5%] justify-center items-center">
                      <AntDesign name="paperclip" size={18} color="red" />
                    </View>
                    <View className="w-[92%]">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-red-600">Reference Number</Text>
                        <Text className="text-white font-semibold">
                          #{item.referenceNumber}
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-red-600">Number Of Panels</Text>
                        <Text className="text-white font-semibold">
                          {item.panelData.length}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      )}
      <TouchableOpacity
        onPress={() => router.navigate("/manufacturer/worker")}
        className="w-14 h-14 rounded-full bg-red-600 absolute bottom-2 right-2 justify-center items-center"
      >
        <Ionicons name="people-circle" size={50} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ManufacturerMainScreen;
