import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import url from "../../url";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddWorker = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  async function AddWorkerFunc() {
    try {
      const token = await AsyncStorage.getItem("token");
      const newFormData = { ...formData, token };
      setLoading(true);
      const res = await fetch(`${url}/api/v1/manufacturer/add-worker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFormData),
      });
      const data = await res.json();
      if (data.success === true) {
        setLoading(false);
        Alert.alert("Success", "Worker added successfully");
        return router.replace("/manufacturer");
      } else {
        setLoading(false);
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      setLoading(false);
      return Alert.alert("Error", "Something went wrong while adding worker");
    }
  }
  return (
    <SafeAreaView className="bg-zinc-800 flex-1">
      <View className="w-full p-2">
        <Text className="text-white font-semibold text-2xl border-b-[1px] border-red-600">
          Add Operator
        </Text>
      </View>
      <InputData
        text={"Name"}
        id={"name"}
        type={"text"}
        formData={formData}
        setFormData={setFormData}
      />
      <InputData
        text={"Email"}
        id={"email"}
        type={"email"}
        formData={formData}
        setFormData={setFormData}
      />
      <InputData
        text={"Phone"}
        id={"phone"}
        type={"numeric"}
        formData={formData}
        setFormData={setFormData}
      />
      <InputData
        text={"Password"}
        id={"password"}
        type={"password"}
        formData={formData}
        setFormData={setFormData}
        secureTextEntry={true}
      />
      <View className="w-full p-2 flex-row justify-end items-center">
        <TouchableOpacity
          onPress={AddWorkerFunc}
          className="px-4 py-2  bg-red-800 rounded-full"
        >
          <Text className="text-white text-xl">
            {loading ? "Loading..." : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

function InputData({
  text,
  id,
  type,
  formData,
  setFormData,
  secureTextEntry = false,
}) {
  return (
    <View className="w-full p-2">
      <Text className="text-white font-semibold text-sm">{text}</Text>
      <TextInput
        value={formData[id]}
        keyboardType={type}
        secureTextEntry={secureTextEntry}
        onChangeText={(value) => {
          if (id === "email") {
            setFormData({ ...formData, [id]: value.toLowerCase().trim() });
          } else {
            setFormData({ ...formData, [id]: value });
          }
        }}
        className="w-full bg-zinc-900 mt-1 rounded-lg p-2 text-white font-semibold"
      />
    </View>
  );
}

export default AddWorker;
