import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import url from "../../../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
const History = () => {
  const [customers, setCustomers] = React.useState(null);
  async function GetCustomers() {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${url}/api/v1/sales/get-customer`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCustomers(data.data);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert(
        "Error",
        "Something went wrong while getting customers"
      );
    }
  }

  React.useEffect(() => {
    GetCustomers();
  }, []);

  if (customers === null) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-200 justify-center items-center">
        <ActivityIndicator color={"red"} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-zinc-800">
      <View className="w-full h-[10%] bg-zinc-800 p-2 justify-center items-start">
        <Text className="text-4xl font-semibold text-white">
          Your Customers
        </Text>
      </View>
      <View className="w-full h-[90%] rounded-t-xl bg-zinc-200">
        <FlatList
          data={customers}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                router.navigate(`/sales/view-custom-order/${item._id}`)
              }
              className="w-full border-b-[1px] border-zinc-800 flex-row p-2"
            >
              <View className="w-[90%] justify-start items-start">
                <Text className="text-sm text-red-800">
                  Name: <Text className="text-zinc-900">{item.name}</Text>
                </Text>
                <Text className="text-sm text-red-800">
                  Email: <Text className="text-zinc-900">{item.email}</Text>
                </Text>
                <Text className="text-sm text-red-800">
                  Phone: <Text className="text-zinc-900">{item.phone}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default History;
