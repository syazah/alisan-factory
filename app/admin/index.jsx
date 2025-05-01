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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";

const Home = () => {
  const [admin, setAdmin] = useState(null);
  const [orders, setOrders] = useState(null);
  async function GetAdminDetails() {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return Alert.alert("Error", "Token is not found");
      }
      const res = await fetch(`${url}/api/v1/admin/admin-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success === true) {
        setAdmin(data.admin);
        setOrders(data.orders);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert(
        "Error",
        "Something went wrong while getting admin details"
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
  React.useEffect(() => {
    GetAdminDetails();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-100">
      {admin === null ? (
        <View
          style={{ flex: 1 }}
          className="bg-zinc-800 justify-center items-center"
        >
          <ActivityIndicator color={"red"} style={{ flex: 1 }} />
        </View>
      ) : (
        <View className="flex-1">
          {/* NAVBAR  */}
          <View className="w-full h-[12%] p-4 flex-row justify-between items-start bg-zinc-100">
            <View className="justify-start items-start">
              <Text className="font-semibold text-2xl text-zinc-800">
                👋Hello, <Text className="text-red-600">{admin.username}</Text>
              </Text>
              <Text className="font-semibold text-base text-zinc-700">
                {admin.name}
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
                admin.name.slice()[0]
              }${admin.name.slice()[1]}`}</Text>
            </TouchableOpacity>
          </View>

          {/* {MAIN} */}
          <View className="w-full h-[88%] rounded-t-xl bg-zinc-800 justify-start py-4 items-center">
            <Bento />
            <RecentOrders orders={orders} getAdminDetails={GetAdminDetails} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

function Bento() {
  return (
    <View className="justify-start items-start border-b-[1px] border-zinc-900 py-4 relative">
      <View className="flex-row justify-start items-start">
        <TouchableOpacity
          onPress={() => router.navigate("/admin/orders")}
          activeOpacity={0.8}
          className="bg-zinc-900 w-[48%] h-[150px] rounded-md border-[2px] border-red-700 justify-center items-center"
        >
          <FontAwesome5 name="cart-arrow-down" size={50} color="white" />
          <Text className="text-xl font-semibold text-white">Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/admin/cost-sheet")}
          activeOpacity={0.8}
          className="bg-red-700 w-[48%] h-[150px] rounded-md border-[2px] border-white justify-center items-center  ml-1"
        >
          <Entypo name="price-tag" size={50} color="white" />
          <Text className="text-xl font-semibold text-white">Cost Sheet</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-start items-start mt-2">
        <TouchableOpacity
          onPress={() => router.navigate("/admin/salesteam")}
          activeOpacity={0.8}
          className="bg-zinc-100 w-[48%] h-[150px] rounded-md border-[2px] border-red-700 justify-center items-center "
        >
          <Fontisto name="shopping-sale" size={50} color="black" />
          <Text className="text-xl font-semibold text-zinc-800">
            Sales Team
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/admin/manufacturingteam")}
          activeOpacity={0.8}
          className="bg-zinc-900 w-[48%] h-[150px] rounded-md border-[2px] border-red-700 justify-center items-center ml-1"
        >
          <MaterialIcons
            name="precision-manufacturing"
            size={50}
            color="white"
          />
          <Text className="text-xl font-semibold text-white">
            Manufacturers
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.navigate("/admin/inventory")}
        style={{ elevation: 5 }}
        activeOpacity={0.8}
        className="w-24 h-24 rounded-full absolute z-10 bg-white top-[40%] self-center justify-center items-center"
      >
        <MaterialIcons name="inventory" size={52} color="black" />
      </TouchableOpacity>
    </View>
  );
}

function RecentOrders({ orders, getAdminDetails }) {
  const [refreshing, setRefreshing] = useState(false);
  function HandleRefresh() {
    setRefreshing(true);
    getAdminDetails();
    setRefreshing(false);
  }
  return (
    <View className="w-full h-full mt-2 p-2">
      <View className="flex flex-row justify-between items-center border-b-[1px] border-red-600">
        <Text className="font-semibold text-zinc-100 text-xl">
          Recent Orders
        </Text>
        <AntDesign name="down" size={24} color="white" />
      </View>
      {orders.length == 0 ? (
        <View className="w-full h-full items-center">
          <Text className="mt-4 text-red-600">
            **No orders to show currently
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          refreshing={refreshing}
          onRefresh={HandleRefresh}
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
                onPress={() => router.navigate(`/admin/view-order/${item._id}`)}
                activeOpacity={0.8}
                className="border-b-[1px] border-zinc-100 p-2 flex-row justify-start items-center"
              >
                <View className="w-8 h-8 bg-red-600 rounded-full border-[1px] border-zinc-50 justify-center items-center">
                  <Text className="uppercase text-white text-xl">
                    {item.currentStage.split("")[0]}
                  </Text>
                </View>
                <View className="w-full justify-start items-start">
                  <Text className="text-white text-sm font-normal ml-2 w-full">
                    Ref: {item.referenceNumber}
                  </Text>
                  <Text className="text-white text-sm font-normal ml-2 w-full">
                    Number Of Panels: {item.panelData.length}
                  </Text>
                  <Text className="text-white text-sm font-normal ml-2 w-full">
                    Raised {timeAgoMessage}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

export default Home;
