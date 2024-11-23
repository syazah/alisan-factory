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
import { Picker } from "@react-native-picker/picker";

import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
const SalesMainScreen = () => {
  const [Sales, setSalesMan] = useState(null);
  const [orders, setOrders] = useState(null);
  const [history, setHistory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSelectedOrders, setCurrentSelectedOrders] = useState("current");
  async function GetSalesDetails() {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${url}/api/v1/sales/salesman-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success === true) {
        setSalesMan(data.salesman);
        setOrders(data.orders);
        setHistory(data.history);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert(
        "Error",
        "Something went wrong while getting Sales details"
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
    GetSalesDetails();
    setRefreshing(false);
  }
  React.useEffect(() => {
    HandleRefresh();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-100">
      {Sales === null || orders === null || history === null ? (
        <View style={{ flex: 1 }} className="bg-zinc-800">
          <ActivityIndicator color={"red"} style={{ flex: 1 }} />
        </View>
      ) : (
        <View className="flex-1">
          {/* NAVBAR  */}
          <View className="w-full h-[12%] p-4 flex-row justify-between items-start bg-zinc-100">
            <View className="justify-start items-start">
              <Text className="font-semibold text-lg text-zinc-800">
                👋Hello,{" "}
                <Text className="text-red-600 text-2xl">
                  {Sales.name.split(" ")[0]}
                </Text>
              </Text>
              <Text className="font-semibold text-base text-zinc-700">
                Sales Account
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => LogOut()}
              className="w-14 h-14 rounded-full bg-red-700 justify-center items-center border-[2px] border-zinc-800"
            >
              <Text className="font-semibold text-2xl uppercase text-white ">{`${
                Sales.name.slice()[0]
              }${Sales.name.slice()[1]}`}</Text>
            </TouchableOpacity>
          </View>
          <View className="w-full h-[88%] bg-zinc-800 rounded-t-xl p-2">
            <View className="justify-between items-center flex-row">
              <View style={{ width: "60%" }}>
                <Picker
                  selectedValue={currentSelectedOrders}
                  onValueChange={(itemValue) =>
                    setCurrentSelectedOrders(itemValue)
                  }
                  mode="dialog"
                  dropdownIconColor="white"
                  style={{ width: "100%", color: "white" }}
                >
                  <Picker.Item label="New Orders" value="current" />
                  <Picker.Item label="Pending Approval" value="history" />
                </Picker>
              </View>
              <View className="w-6 h-6 bg-red-600 rounded-full justify-center items-center">
                <Text className="font-semibold">{orders.length}</Text>
              </View>
            </View>
            <FlatList
              ListEmptyComponent={
                <View className="justify-center items-center p-4">
                  <Text className="text-white">
                    No orders to show currently
                  </Text>
                </View>
              }
              data={currentSelectedOrders === "current" ? orders : history}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.navigate(`/sales/view-order/${item._id}`)
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
                    {currentSelectedOrders === "current" ? (
                      <View className="flex-row justify-between items-center">
                        <Text className="text-red-600">Number Of Panels</Text>
                        <Text className="text-white font-semibold">
                          {item.panelData.length}
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row justify-between items-center">
                        <Text className="text-red-600">Current Stage</Text>
                        <Text className="text-white font-semibold">
                          {item.currentStage}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* PANEL BUILDER  */}
          <TouchableOpacity
            onPress={() => router.navigate("/sales/custom-panels")}
            className="absolute bottom-4 right-2 rounded-full w-14 h-14 z-20 bg-red-800 justify-center items-center"
          >
            <Ionicons name="create" size={42} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SalesMainScreen;
