import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import url from "../../url";
import { router } from "expo-router";
const SalesTeamScreen = () => {
  const [addSalesPerson, setAddSalesPerson] = React.useState(false);
  const [salesTeam, setSalesTeam] = React.useState(null);
  async function getSalesTeam() {
    try {
      const res = await fetch(`${url}/api/v1/admin/sales-team`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        setSalesTeam(data.salesTeam);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  }
  React.useEffect(() => {
    getSalesTeam();
  }, []);

  if (salesTeam === null) {
    return (
      <SafeAreaView className="w-full h-full justify-center items-center bg-zinc-800">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-50 relative">
      <View className="w-full h-[10%] bg-zinc-50 justify-between items-center p-2 flex-row ">
        <Text className="font-semibold text-5xl text-red-700">Sales</Text>
        <TouchableOpacity
          onPress={() => setAddSalesPerson(true)}
          activeOpacity={0.7}
          className="w-12 h-12 rounded-full bg-red-600 justify-center items-center"
        >
          <AntDesign name="pluscircleo" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-full h-[90%] bg-zinc-800 rounded-t-xl py-4">
        {salesTeam.length === 0 ? (
          <View className="w-full h-full justify-center items-center">
            <MaterialCommunityIcons name="sale" size={34} color="red" />
            <Text className="text-base font-semibold text-zinc-50">
              No Salesperson Added
            </Text>
          </View>
        ) : (
          <FlatList
            data={salesTeam}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    router.navigate(`/admin/view-sales/${item._id}`)
                  }
                  className="w-full border-b-[1px] border-white p-2 relative"
                >
                  <Text className="text-red-700 font-semibold text-sm">
                    Name: <Text className="text-white">{item.name}</Text>
                  </Text>
                  <Text className="text-red-700 font-semibold text-sm">
                    Email: <Text className="text-white">{item.email}</Text>
                  </Text>
                  <Text className="text-red-700 font-semibold text-sm">
                    Phone Number:{" "}
                    <Text className="text-white">+91-{item.phoneNumber}</Text>
                  </Text>
                  <Text className="text-red-700 font-semibold text-sm">
                    Orders Assigned:{" "}
                    <Text className="text-white">{item.orders.length}</Text>
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
      {addSalesPerson && (
        <AddSalesPerson setAddSalesPerson={setAddSalesPerson} />
      )}
    </SafeAreaView>
  );
};

function AddSalesPerson({ setAddSalesPerson }) {
  const { width, height } = Dimensions.get("window");
  const [salesManDetail, setSalesManDetail] = React.useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: 0,
  });
  const [loading, setLoading] = React.useState(false);
  async function AddSalesman() {
    try {
      setLoading(true);
      if (
        !salesManDetail.email ||
        !salesManDetail.password ||
        !salesManDetail.phoneNumber ||
        !salesManDetail.password
      ) {
        setLoading(false);
        return Alert.alert("Error", "All the fields are required");
      }
      const res = await fetch(`${url}/api/v1/admin/add-sales-person`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...salesManDetail,
          phoneNumber: salesManDetail.phoneNumber.toString(),
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        setAddSalesPerson(false);
        return Alert.alert("Success", "Sales Man is added to your database");
      } else {
        Alert.alert("Error", data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong while adding the salesman");
    }
  }
  return (
    <View
      style={{ width, height }}
      className="flex-1 mt-10 bg-zinc-800 absolute top-0 left-0 p-2"
    >
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-2xl text-red-700">
          Add Sales Person
        </Text>
        <TouchableOpacity
          onPress={() => setAddSalesPerson(false)}
          className="w-10 h-10 bg-red-600 rounded-full justify-center items-center"
        >
          <AntDesign name="minuscircleo" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View className="w-full h-full mt-4">
        <View>
          <Text className="text-white font-medium text-lg">Name</Text>
          <TextInput
            onChangeText={(value) =>
              setSalesManDetail({ ...salesManDetail, name: value })
            }
            value={salesManDetail.name}
            placeholder="Enter Name Of Sales Person"
            placeholderTextColor={"gray"}
            className="w-full p-2 bg-zinc-900 rounded-lg font-normal text-white mt-1"
          />
        </View>
        <View className="mt-2">
          <Text className="text-white font-medium text-lg">Email</Text>
          <TextInput
            onChangeText={(value) =>
              setSalesManDetail({
                ...salesManDetail,
                email: value.toLocaleLowerCase().trim(""),
              })
            }
            value={salesManDetail.email}
            placeholder="Enter Name Of Sales Person"
            placeholderTextColor={"gray"}
            className="w-full p-2 bg-zinc-900 rounded-lg font-normal text-white mt-1s"
          />
        </View>
        <View className="mt-2">
          <Text className="text-white font-medium text-lg">Password</Text>
          <TextInput
            onChangeText={(value) =>
              setSalesManDetail({ ...salesManDetail, password: value })
            }
            value={salesManDetail.password}
            secureTextEntry={true}
            placeholder="Enter Password For Sales Person"
            placeholderTextColor={"gray"}
            className="w-full p-2 bg-zinc-900 rounded-lg font-normal text-white mt-1s"
          />
        </View>
        <View className="mt-2">
          <Text className="text-white font-medium text-lg">Phone Number</Text>
          <TextInput
            onChangeText={(value) =>
              setSalesManDetail({
                ...salesManDetail,
                phoneNumber: value.trim(),
              })
            }
            keyboardType="number-pad"
            value={salesManDetail.phoneNumber}
            placeholder="Enter Phone Number Of Sales Person"
            placeholderTextColor={"gray"}
            className="w-full p-2 bg-zinc-900 rounded-lg font-normal text-white mt-1s"
          />
        </View>
        <View className="flex-row justify-end items-center mt-8">
          <TouchableOpacity
            onPress={AddSalesman}
            className="p-2 px-8 bg-red-600 rounded-full"
          >
            <Text className="text-xl font-semibold">
              {loading ? "Loading..." : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default SalesTeamScreen;
