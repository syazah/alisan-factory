import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import url from "../../../url";
const VariableCostCalculator = () => {
  const { id } = useLocalSearchParams();
  const [moduleInitialCosts, setModuleInitialCosts] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  async function UpdateCostSheet() {
    try {
      setLoading(true);
      const res = await fetch(`${url}/api/v1/admin/update-cost-sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moduleInitialCosts),
      });
      const data = await res.json();
      if (data.success === true) {
        setLoading(false);

        return Alert.alert(
          "Data Updated",
          "Your new cost data is updated successfully, all current orders will have their costs updated"
        );
      } else {
        Alert.alert("Error", data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      return Alert.alert(
        "Error",
        "Something went wrong while updating cost sheet"
      );
    }
  }

  async function GetCostSheet() {
    try {
      const res = await fetch(`${url}/api/v1/admin/get-cost-sheet`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
      const data = await res.json();
      if (data.success === true) {
        setModuleInitialCosts(data.costSheet);
      } else {
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert(
        "Error",
        "Something went wrong while fetching cost sheet"
      );
    }
  }
  React.useEffect(() => {
    GetCostSheet();
  }, []);
  if (moduleInitialCosts === null) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="justify-center items-center">
        <ActivityIndicator color={"red"} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
        <View className="w-full h-[8%] justify-center items-start p-2">
          <Text className="text-xl text-zinc-600 font-semibold">
            Edit Module Costs
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 bg-zinc-800 rounded-t-xl h-[92%]">
            {id === "ms1" ? (
              <MultipleType
                id={id}
                moduleInitialCosts={moduleInitialCosts}
                setModuleInitialCosts={setModuleInitialCosts}
                costs={moduleInitialCosts.ms1}
              />
            ) : id === "pc1" ? (
              <MultipleType
                id={id}
                moduleInitialCosts={moduleInitialCosts}
                setModuleInitialCosts={setModuleInitialCosts}
                costs={moduleInitialCosts.pc1}
              />
            ) : id === "tsb" ? (
              <MultipleType
                id={id}
                moduleInitialCosts={moduleInitialCosts}
                setModuleInitialCosts={setModuleInitialCosts}
                costs={moduleInitialCosts.tsb}
              />
            ) : id === "pcb" ? (
              <MultipleType
                id={id}
                moduleInitialCosts={moduleInitialCosts}
                setModuleInitialCosts={setModuleInitialCosts}
                costs={moduleInitialCosts.pcb}
              />
            ) : id === "ps" ? (
              <SingleType
                setModuleInitialCosts={setModuleInitialCosts}
                moduleInitialCosts={moduleInitialCosts}
                id={id}
                title={"Power Supply"}
                value={moduleInitialCosts.ps}
              />
            ) : id === "scr" ? (
              <SingleType
                setModuleInitialCosts={setModuleInitialCosts}
                moduleInitialCosts={moduleInitialCosts}
                id={id}
                title={"Screws"}
                value={moduleInitialCosts.scr}
              />
            ) : id === "esp" ? (
              <SingleType
                setModuleInitialCosts={setModuleInitialCosts}
                moduleInitialCosts={moduleInitialCosts}
                id={id}
                title={"ESP"}
                value={moduleInitialCosts.esp}
              />
            ) : id === "cse" ? (
              <MultipleType
                id={id}
                moduleInitialCosts={moduleInitialCosts}
                setModuleInitialCosts={setModuleInitialCosts}
                costs={moduleInitialCosts.cse}
              />
            ) : (
              <></>
            )}
            <View className="w-full p-4 justify-end items-end">
              <TouchableOpacity
                onPress={UpdateCostSheet}
                activeOpacity={0.7}
                className="px-6 py-2 bg-red-800 rounded-full"
              >
                <Text className="text-white font-semibold text-lg">
                  {loading ? "Loading..." : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const MultipleType = ({
  costs,
  setModuleInitialCosts,
  moduleInitialCosts,
  id,
}) => {
  return (
    <View className="w-full py-4">
      {Object.entries(costs).map(([key, value], index) => (
        <View key={index} className="w-full px-4 py-0">
          <Text className="text-sm text-red-800 font-semibold">{key}</Text>
          <View className="w-full mt-1 flex flex-row bg-zinc-900 justify-start items-center p-2 rounded-lg">
            <FontAwesome6 name="indian-rupee-sign" size={18} color="maroon" />
            <TextInput
              onChangeText={(value) => {
                const newCost = { ...costs, [key]: value };
                setModuleInitialCosts({ ...moduleInitialCosts, [id]: newCost });
              }}
              value={value.toString()}
              cursorColor="red"
              inputMode={"numeric"}
              keyboardType="numpad"
              className=" rounded-lg p-1 outline-red-800 border-red-800 text-white font-semibold w-full"
            />
          </View>
        </View>
      ))}
    </View>
  );
};
const SingleType = ({
  title,
  value,
  moduleInitialCosts,
  setModuleInitialCosts,
  id,
}) => {
  return (
    <View className="w-full py-4">
      <View className="w-full px-4 py-0">
        <Text className="text-sm text-red-800 font-semibold">{title}</Text>
        <View className="w-full mt-1 flex flex-row bg-zinc-900 justify-start items-center p-2 rounded-lg">
          <FontAwesome6 name="indian-rupee-sign" size={18} color="maroon" />
          <TextInput
            onChangeText={(value) => {
              setModuleInitialCosts({
                ...moduleInitialCosts,
                [id]: value,
              });
            }}
            value={value.toString()}
            cursorColor="red"
            inputMode={"numeric"}
            keyboardType="numpad"
            className=" rounded-lg p-1 outline-red-800 border-red-800 text-white font-semibold w-full"
          />
        </View>
      </View>
    </View>
  );
};

export default VariableCostCalculator;
