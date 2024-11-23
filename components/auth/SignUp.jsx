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
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const SignUp = () => {
  const { width } = Dimensions.get("window");
  const [formData, setFormData] = React.useState({
    type: 0,
    email: "",
    password: "",
    type: 0,
  });
  const [loading, setLoading] = React.useState(false);
  async function sendRequest() {
    try {
      if (!formData.email || !formData.password) {
        return Alert.alert("Incomplete Data", "Details Should Be Filled");
      }
      setLoading(true);
      const res = await fetch(
        `${url}/api/v1/${
          formData.type === 0
            ? "admin"
            : formData.type === 1
            ? "sales"
            : formData.type === 2
            ? "manufacturer"
            : "worker"
        }/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!data.success) {
        setLoading(false);
        return Alert.alert("Error", data.message);
      } else {
        setLoading(false);
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem(
          "userType",
          formData.type === 0
            ? "admin"
            : formData.type === 1
            ? "sales"
            : formData.type === 2
            ? "manufacturer"
            : "worker"
        );
        if (data.type === 0) {
          setLoading(false);
          return router.replace("/admin");
        } else if (data.type === 1) {
          setLoading(false);
          return router.replace("/sales");
        } else if (data.type === 2) {
          setLoading(false);
          return router.replace("/manufacturer");
        } else {
          setLoading(false);
          return router.replace("/worker");
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong while fetching user");
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
              sele={formData.password}
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
                setFormData({ ...formData, type: Number(value) })
              }
              style={{
                width: "100%",
                color: "white",
                backgroundColor: "maroon",
              }}
            >
              {["Admin", "Sales", "Manufacturer", "Worker"].map((el, index) => (
                <Picker.Item key={index} value={index} label={el} />
              ))}
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
