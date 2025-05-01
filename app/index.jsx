import { View, Text, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Dimensions, TextInput, Image } from "react-native";
import url from "../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
const LandingScreen = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [userDetails, setUserDetails] = useState({
    token: "",
    userType: "",
  });
  React.useEffect(() => {
    async function getToken() {
      try {
        const token = await AsyncStorage.getItem("token");
        const userType = await AsyncStorage.getItem("userType");

        if (token && userType) {
          setUserDetails({
            token,
            userType,
          });
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong while fetching user token");
      }
    }
    getToken();
  }, []);

  React.useEffect(() => {
    if (userDetails.token !== "") {
      if (userDetails.userType === "admin") {
        return router.replace("/admin");
      } else if (userDetails.userType === "sales") {
        return router.replace("/sales");
      } else if (userDetails.userType === "worker") {
        return router.replace("/worker");
      } else {
        return router.replace("/manufacturer");
      }
    }
  }, [userDetails]);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-900 relative">
      {showLanding ? <Landing setShowLanding={setShowLanding} /> : <SignUp />}
    </SafeAreaView>
  );
};

const Landing = ({ setShowLanding }) => {
  const { width } = Dimensions.get("window");
  return (
    <View style={{ width, flex: 1 }} className="justify-center items-center">
      <Image
        className="w-[300px] h-[300px]"
        resizeMode="contain"
        source={require("../assets/welcome.png")}
      />
      <View className="justify-center items-center mt-4">
        <Text className="font-semibold text-3xl text-red-700">
          Welcome, User
        </Text>
        <Text className="font-normal text-base text-zinc-200 px-6 text-center">
          Efficiently manage your orders with this app designed for Alisan,
          enabling you to track and oversee your orders.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setShowLanding(false)}
        activeOpacity={0.8}
        className="w-[90%] bg-red-700 mt-10 rounded-full justify-center items-center p-4"
      >
        <Text className="text-white font-semibold text-xl">CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignUp = () => {
  const { width } = Dimensions.get("window");

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    type: 1,
  });
  const [loading, setLoading] = React.useState(false);
  async function sendRequest() {
    try {
      // Validate input
      if (!formData.email || !formData.password) {
        return Alert.alert("Incomplete Data", "Details Should Be Filled");
      }
      const userTypePath =
        {
          1: "admin",
          2: "sales",
          3: "manufacturer",
          4: "worker",
        }[formData.type] || "worker";

      // Make API request
      const res = await fetch(`${url}/api/v1/${userTypePath}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setLoading(false);
        return Alert.alert("Error", data.message);
      }

      // Store data first before navigation
      try {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userType", userTypePath);
      } catch (storageError) {
        console.error("Storage error:", storageError);
        setLoading(false);
        return Alert.alert("Error", "Failed to save login information");
      }

      // Navigation
      const routePath = {
        1: "/admin",
        2: "/sales",
        3: "/manufacturer",
        4: "/worker",
      }[data.type];

      if (!routePath) {
        setLoading(false);
        return Alert.alert("Error", "Invalid user type received");
      }

      router.replace(routePath);
      setLoading(false);
    } catch (error) {
      console.error("Sign in error:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to sign in. Please try again.");
    }
  }
  return (
    <View style={{ width, flex: 1 }} className="justify-center items-center">
      <View className="h-[20%] bg-red-800 w-[100%] rounded-b-full justify-center items-center">
        <Image
          className="w-36 h-36"
          source={{
            uri: "https://www.alisan.io/images/alisan-smart-homes.png",
          }}
          resizeMode="contain"
        />
      </View>
      <View className="w-[100%] h-[80%] justify-start items-center">
        <View className="w-[90%] p-2 rounded-xl mt-4 overflow-hidden">
          <Text className="text-zinc-50 text-lg">Email</Text>
          <View className="bg-zinc-800 w-full p-2 rounded-lg overflow-hidden mt-1">
            <TextInput
              value={formData.email}
              placeholderTextColor="#555"
              placeholder="thesyazah@gmail.com"
              onChangeText={(value) =>
                setFormData({
                  ...formData,
                  email: value.toLowerCase().trim(" "),
                })
              }
              className="font-semibold text-white"
            />
          </View>
          <Text className="text-zinc-50 text-lg mt-2">Password</Text>
          <View className="bg-zinc-800 w-full p-2 rounded-lg overflow-hidden mt-1">
            <TextInput
              placeholderTextColor="#555"
              placeholder="********"
              value={formData.password}
              onChangeText={(value) =>
                setFormData({ ...formData, password: value.trim(" ") })
              }
              className="font-semibold text-white"
              secureTextEntry={true}
            />
          </View>
          <Text className="text-zinc-50 text-lg mt-2">Sign In As</Text>
          <View className=" w-full mt-1 flex-row rounded-xl overflow-hidden border-[1px] border-red-600">
            <Picker
              dropdownIconColor={"white"}
              selectedValue={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: parseInt(value, 10) })
              }
              style={{
                width: "100%",
                color: "white",
                backgroundColor: "maroon",
              }}
            >
              {["Admin", "Sales", "Manufacturer", "Operator"].map(
                (el, index) => (
                  <Picker.Item key={index + 1} value={index + 1} label={el} />
                )
              )}
            </Picker>
          </View>
        </View>
        <TouchableOpacity
          onPress={sendRequest}
          className="w-[90%] bg-red-800 justify-center items-center p-4 mt-4 rounded-full border-[4px] border-red-950"
        >
          <Text className="font-semibold text-xl text-white">
            {loading ? "Fetching..." : "CONTINUE"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingScreen;
