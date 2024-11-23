import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRecoilState } from "recoil";
import { SalesCustomer } from "../../../store/admin/atom";
import { router } from "expo-router";
import url from "../../../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CustomPanelBuilder = () => {
  const [currentOpenDropdown, setCurrentOpenDropdown] = React.useState(0);
  const [customer, setCustomer] = useRecoilState(SalesCustomer);
  const [addingCustomer, setAddingCustomer] = React.useState(false);
  async function HandleAddCustomer() {
    try {
      const token = await AsyncStorage.getItem("token");
      setAddingCustomer(true);
      if (Object.values(customer).some((val) => val === "")) {
        return Alert.alert("Error", "Fill Customer Details");
      }
      if (customer.panelData.length === 0) {
        return Alert.alert("Error", "Add at least one panel");
      }
      const res = await fetch(`${url}/api/v1/sales/add-customer`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ ...customer, token }),
      });
      const data = await res.json();
      if (data.success === true) {
        setAddingCustomer({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          panelData: [],
        });
        Alert.alert(
          "Success",
          "Added customer to your collection, View in history"
        );
        setAddingCustomer(false);
        return router.replace("/sales");
      }
      if (data.success === false) {
        setAddingCustomer(false);
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      setAddingCustomer(false);
      return Alert.alert("Error", "Something went wrong, try again later");
    }
  }
  return (
    <SafeAreaView className={"flex-1 bg-zinc-800"}>
      <View className="w-full h-[10%] p-2 flex-row justify-between items-center">
        <Text className="text-white font-semibold text-2xl">Panel Builder</Text>
        <TouchableOpacity
          onPress={HandleAddCustomer}
          className="px-4 justify-center h-10 bg-red-800 rounded-full"
        >
          <Text className="text-white font-semibold">
            {addingCustomer ? "Loading..." : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="w-full h-[90%] bg-zinc-200 rounded-t-xl p-4">
        <ScrollView>
          {/* CUSTOMER DETAILS  */}
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (currentOpenDropdown === 0) {
                  return setCurrentOpenDropdown(-1);
                }
                setCurrentOpenDropdown(0);
              }}
              className="w-full bg-red-800 rounded-t-xl p-2 flex-row justify-between items-center"
            >
              <Text className="text-white font-semibold text-xl">
                Customer Details
              </Text>
              {currentOpenDropdown === 0 ? (
                <Fontisto name="caret-up" size={24} color="white" />
              ) : (
                <Fontisto name="caret-down" size={24} color="white" />
              )}
            </TouchableOpacity>
            {currentOpenDropdown === 0 && <CustomerDetails />}
          </View>
          <View className="mt-2">
            {customer.panelData.map((panel, index) => {
              return (
                <View key={index} className="bg-red-800 rounded-full p-2 mt-1">
                  <Text className="text-white font-semibold">
                    {panel.panelName}
                  </Text>
                </View>
              );
            })}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (Object.values(customer).some((val) => val === "")) {
                  return Alert.alert("Error", "Fill Customer Details");
                }
                router.navigate("/sales/panel-builder");
              }}
              className="w-full bg-zinc-100 border-[1px] border-red-800 rounded-full justify-center items-center p-2 flex-row  mt-4"
            >
              <Text className="text-red-800 font-semibold text-xl">
                {addingCustomer ? "Loading..." : "Add Panel"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const CustomerDetails = () => {
  const [customer, setCustomer] = useRecoilState(SalesCustomer);
  return (
    <View className="w-full p-2 border-[1px] border-t-0 border-zinc-300 rounded-b-xl">
      <TextInput
        value={customer.name}
        onChangeText={(value) => setCustomer({ ...customer, name: value })}
        placeholder="Full Name"
        className="bg-zinc-300 rounded-lg"
      />
      <TextInput
        value={customer.email}
        onChangeText={(value) =>
          setCustomer({ ...customer, email: value.toLowerCase().trim() })
        }
        placeholder="Email Address"
        className="bg-zinc-300 rounded-lg mt-1"
      />
      <TextInput
        value={customer.phone}
        keyboardType="numeric"
        onChangeText={(value) =>
          setCustomer({ ...customer, phone: value.toString().trim() })
        }
        placeholder="Phone Number"
        className="bg-zinc-300 rounded-lg mt-1"
      />
      <TextInput
        value={customer.address}
        onChangeText={(value) => setCustomer({ ...customer, address: value })}
        placeholder="Address Line"
        className="bg-zinc-300 rounded-lg mt-1"
      />
      <TextInput
        value={customer.city}
        onChangeText={(value) => setCustomer({ ...customer, city: value })}
        placeholder="City"
        className="bg-zinc-300 rounded-lg mt-1"
      />
      <TextInput
        value={customer.state}
        onChangeText={(value) => setCustomer({ ...customer, state: value })}
        placeholder="State"
        className="bg-zinc-300 rounded-lg mt-1"
      />
    </View>
  );
};

export default CustomPanelBuilder;
