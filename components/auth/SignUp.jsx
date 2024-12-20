import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import url from "../../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { Picker } from "@react-native-picker/picker";

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
              {["Admin", "Sales", "Manufacturer", "Operators"].map(
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

export default SignUp;
