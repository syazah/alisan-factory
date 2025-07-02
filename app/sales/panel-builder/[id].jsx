import {
  View,
  Text,
  FlatList,
  Dimensions,
  Touchable,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecoilState, useRecoilValue } from "recoil";
import { Picker } from "@react-native-picker/picker";
import Circuits from "../../../components/Circuits";
import { router, useLocalSearchParams } from "expo-router";
import url from "../../../url";
import { CustomPanelBuilder } from "../../../store/admin/atom";
import AntDesign from '@expo/vector-icons/AntDesign';

const PanelBuilder = () => {
  const { id } = useLocalSearchParams();
  const [currentData, setCurrentData] = useRecoilState(CustomPanelBuilder);
  const [currentStep, setCurrentStep] = useState(0);
  const [spaceLeft, setSpaceLeft] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [remarks, setRemarks] = useState("");
  const flatListRef = useRef(null);

  const moveStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      flatListRef.current.scrollToIndex({ index: currentStep + 1 });
    } else {
      if (currentData.panelName === "") {
        return Alert.alert("Error", "Enter Panel Name");
      } else {
        return Alert.alert(
          "Submit",
          "Do You Want To Add this panel to the current panel build ?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Submit",
              onPress: async () => {
                const res = await fetch(`${url}/api/v1/sales/create-panel`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    panelData: currentData,
                    collectionId: id,
                    quantity,
                    remarks
                  }),
                });
                const data = await res.json();
                if (data.success) {
                  Alert.alert("Success", "Panel created successfully");
                  router.replace(`/sales`)
                } else {
                  Alert.alert("Error", data.message);
                }
              },
            },
          ],
          { cancelable: true }
        );
      }
    }
  };
  const renderStep = (stepType) => {
    if (stepType === 0) {
      return (
        <ModuleSizeSelector
          setSpaceLeft={setSpaceLeft}
          currentData={currentData}
          setCurrentData={setCurrentData}
          moveStep={moveStep}
        />
      );
    } else if (stepType === 1) {
      return (
        <AccessoriesSelector
          currentData={currentData}
          setCurrentData={setCurrentData}
          moveStep={moveStep}
        />
      );
    } else if (stepType === 2) {
      return (
        <CircuitSelector
          setSpaceLeft={setSpaceLeft}
          spaceLeft={spaceLeft}
          currentData={currentData}
          setCurrentData={setCurrentData}
          moveStep={moveStep}
        />
      );
    } else if (stepType === 3) {
      return (
        <GlassSelector
          currentData={currentData}
          setCurrentData={setCurrentData}
          moveStep={moveStep}
        />
      );
    } else if (stepType === 4) {
      return (
        <FrameSelector
          currentData={currentData}
          setCurrentData={setCurrentData}
          moveStep={moveStep}

        />
      );
    } else if (stepType === 5) {
      return (
        <FinalSlide
          currentData={currentData}
          setCurrentData={setCurrentData}
          moveStep={moveStep}
          quantity={quantity}
          setQuantity={setQuantity}
          remarks={remarks}
          setRemarks={setRemarks}
        />
      );
    }
    return null;
  };

  useEffect(() => {
    setCurrentData({
      panelSize: 2,
      accessories: {},
      panelVariant: [],
      bigPanelVariant: [[], []],
      panelGlass: "#000",
      panelFrame: "#000",
      accessoryColor: "#000",
      automationRequired: false,
    });
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-200">
      <View className="bg-zinc-200 w-full h-[40%]">
        <View
          className={
            "h-[12%] w-full p-1 border-b-[1px] border-red-800 flex-row justify-between"
          }
        >
          <Text className="font-semibold text-xl">Panel Details</Text>
          <View className="w-24 px-2 h-6 rounded-full bg-red-600 items-center flex-row justify-between">
            <Text className="text-xs">Space Left</Text>
            <Text className="text-black font-semibold">{spaceLeft}</Text>
          </View>
        </View>
        <View className="h-[88%] p-2 gap-2">
          <View className="flex-row justify-between items-start border-b-[1px] border-zinc-400">
            <Text className="font-normal">Module Size</Text>
            <Text className="font-semibold">{currentData.panelSize}</Text>
          </View>
          <View className="justify-start items-start border-b-[1px] border-zinc-400">
            <Text className="font-normal">Circuits</Text>
            <View className="font-semibold">
              {currentData.panelVariant.map((item, index) => (
                <Text key={index}>{JSON.stringify(item)}</Text>
              ))}
            </View>
          </View>
          <View className="flex-row justify-between items-center border-b-[1px] border-zinc-400">
            <Text className="font-normal">Glass Color</Text>
            <View
              style={{ backgroundColor: currentData.panelGlass }}
              className="font-semibold w-4 h-4 rounded-full"
            ></View>
          </View>
          <View className="flex-row justify-between items-center border-b-[1px] border-zinc-400">
            <Text className="font-normal">Frame Color</Text>
            <View
              style={{ backgroundColor: currentData.panelFrame }}
              className="font-semibold w-4 h-4 rounded-full"
            ></View>
          </View>
          <View className="flex-row justify-between items-center border-b-[1px] border-zinc-400">
            <Text className="font-normal">Automation Required</Text>
            <Text className="font-normal">
              {currentData.automationRequired ? "YES" : "NO"}
            </Text>
          </View>
        </View>
      </View>

      {/* SELECT VALUES  */}
      <View className="flex-1 h-[60%] bg-zinc-800  rounded-t-xl overflow-hidden">
        <FlatList
          ref={flatListRef}
          data={[0, 1, 2, 3, 4, 5]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderStep(item)}
          horizontal
          scrollEnabled={false}
          pagingEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
};

function ModuleSizeSelector({
  currentData,
  setCurrentData,
  moveStep,
  setSpaceLeft,
}) {
  const { width } = Dimensions.get("window");
  return (
    <View style={{ width }} className="flex-1 h-full p-2 justify-between">
      <View className="flex flex-col">
        <Text className="text-xl font-semibold text-zinc-200 border-b-[1px] border-red-600">
          Module Size
        </Text>
        <Text className="text-sm text-zinc-300 mt-1">
          Select module size for the panel, that you are creating. A panel can
          be a physical unit used in construction or manufacturing
        </Text>
        <Picker
          mode="dialog"
          selectedValue={currentData.panelSize}
          onValueChange={(value) => {
            setCurrentData({ ...currentData, panelSize: value });
            setSpaceLeft(value);
          }}
          dropdownIconColor="white"
          style={{
            width: "100%",
            color: "white",
            backgroundColor: "#000",
            marginTop: 10,
          }}
        >
          <Picker.Item value={2} label="2 Module" />
          <Picker.Item value={4} label="4 Module" />
          <Picker.Item value={6} label="6 Module" />
          <Picker.Item value={8} label="8 Module" />
          <Picker.Item value={12} label="12 Module" />
        </Picker>
      </View>
      <View className="w-full p-4 items-end">
        <TouchableOpacity
          onPress={moveStep}
          className="px-4 py-2 bg-red-800 rounded-full"
        >
          <Text className="text-xl text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
function AccessoriesSelector({ currentData, setCurrentData, moveStep }) {
  const { width } = Dimensions.get("window");
  const [wantAccessory, setWantAccessory] = useState(false);
  return (
    <View
      style={{ width }}
      className="w-full flex-1 h-full p-2 justify-between"
    >
      <View className="flex flex-col">
        <Text className="text-xl font-semibold text-zinc-200 border-b-[1px] border-red-600">
          Select Accessory
        </Text>
        <View className="p-2 w-ful flex justify-between">
          <Text className="text-white font-semibold">Want Accessory ?</Text>
          <View className="w-full flex flex-row justify-start items-center">
            <TouchableOpacity
              onPress={() => setWantAccessory(true)}
              className={`px-4 py-2 ${wantAccessory ? "bg-red-600" : "bg-zinc-900"
                } rounded-full mt-2`}
            >
              <Text className="text-white">YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setWantAccessory(false)}
              className={`px-4 py-2 ${!wantAccessory ? "bg-red-600" : "bg-zinc-900"
                } ml-2 rounded-full mt-2`}
            >
              <Text className="text-white">NO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="w-full p-4 items-end">
        <TouchableOpacity
          onPress={moveStep}
          className="px-4 py-2 bg-red-800 rounded-full"
        >
          <Text className="text-xl text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CircuitSelector({
  currentData,
  setCurrentData,
  moveStep,
  spaceLeft,
  setSpaceLeft,
}) {
  const { width } = Dimensions.get("window");
  const [circuitType, setCircuitType] = useState(2);
  const [currentValue, setCurrentValue] = useState(null);

  return (
    <View style={{ width }} className="flex-1 h-full p-2 justify-between">
      <View className="flex flex-col">
        <Text className="text-xl font-semibold text-zinc-200 border-b-[1px] border-red-600">
          Select Circuit
        </Text>

        <View className="p-2 bg-red-800 rounded-xl mt-2">
          <Text className="text-white">Circuit Type</Text>
          <Picker
            mode="dialog"
            selectedValue={circuitType}
            onValueChange={(value) => setCircuitType(value)}
            dropdownIconColor="white"
            style={{
              width: "100%",
              color: "white",
            }}
          >
            <Picker.Item value={2} label="2 Module" />
            {currentData.panelSize >= 4 && (
              <Picker.Item value={4} label="4 Module" />
            )}
            {currentData.panelSize >= 6 && (
              <Picker.Item value={6} label="6 Module" />
            )}
          </Picker>
        </View>

        {/* CIRCUITS  */}
        <Circuits
          setCurrentValue={setCurrentValue}
          currentValue={currentValue}
          circuitType={circuitType}
        />

        {/* ADD BUTTON  */}
        <TouchableOpacity
          onPress={() => {
            if (currentValue === null) {
              return Alert.alert("Error", "Select A Circuit To Add");
            }
            if (spaceLeft - Number(currentValue.cost) < 0) {
              return Alert.alert("Error", "No More Space Left");
            }
            setSpaceLeft(spaceLeft - Number(currentValue.cost));
            const newPanelVariant = [
              ...currentData.panelVariant,
              currentValue.variant,
            ];
            setCurrentData({ ...currentData, panelVariant: newPanelVariant });
          }}
          className="flex flex-row px-4 py-2 justify-center items-center mt-2 bg-zinc-200 rounded-full"
        >
          <Text className="text-lg">Add</Text>
        </TouchableOpacity>
      </View>
      <View className="w-full p-4 items-end">
        <TouchableOpacity
          onPress={moveStep}
          className="px-4 py-2 bg-red-800 rounded-full"
        >
          <Text className="text-xl text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function GlassSelector({ currentData, setCurrentData, moveStep }) {
  const { width } = Dimensions.get("window");
  return (
    <View style={{ width }} className="flex-1 h-full p-2 justify-between">
      <View className="flex flex-col">
        <Text className="text-xl font-semibold text-zinc-200 border-b-[1px] border-red-600">
          Glass Color
        </Text>

        <Picker
          mode="dialog"
          selectedValue={currentData.panelGlass}
          onValueChange={(value) => {
            setCurrentData({ ...currentData, panelGlass: value });
          }}
          dropdownIconColor="white"
          style={{
            width: "100%",
            color: "white",
            backgroundColor: "#000",
            marginTop: 10,
          }}
        >
          <Picker.Item value={"#000"} label="Royal Black" />
          <Picker.Item value={"#535150"} label="Charcoal Gray" />
          <Picker.Item value={"#ab936b"} label="Champaign Gold" />
        </Picker>
      </View>
      <View className="w-full p-4 items-end">
        <TouchableOpacity
          onPress={moveStep}
          className="px-4 py-2 bg-red-800 rounded-full"
        >
          <Text className="text-xl text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
function FrameSelector({ currentData, setCurrentData, moveStep }) {
  const { width } = Dimensions.get("window");
  return (
    <View style={{ width }} className="flex-1 h-full p-2 justify-between">
      <View className="flex flex-col">
        <Text className="text-xl font-semibold text-zinc-200 border-b-[1px] border-red-600">
          Panel Frame
        </Text>

        <Picker
          mode="dialog"
          selectedValue={currentData.panelFrame}
          onValueChange={(value) => {
            setCurrentData({ ...currentData, panelFrame: value });
          }}
          dropdownIconColor="white"
          style={{
            width: "100%",
            color: "white",
            backgroundColor: "#000",
            marginTop: 10,
          }}
        >
          <Picker.Item value={"#000"} label="Matt Black" />
          <Picker.Item value={"#b5b6b5"} label="Nickel Chrome" />
          <Picker.Item value={"#ab936b"} label="Gold" />
        </Picker>
      </View>
      <View className="w-full p-4 items-end">
        <TouchableOpacity
          onPress={moveStep}
          className="px-4 py-2 bg-red-800 rounded-full"
        >
          <Text className="text-xl text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FinalSlide({ currentData, setCurrentData, moveStep, quantity, setQuantity, remarks, setRemarks }) {
  const { width } = Dimensions.get("window");
  return (
    <View style={{ width }} className="flex-1 h-full p-2 justify-between">
      <View className="flex flex-col">
        <Text className="text-xl font-semibold text-zinc-200 border-b-[1px] border-red-600">
          Final Submit
        </Text>
        <View className="w-full flex flex-row justify-between items-center mt-4">
          <Text className="text-white font-semibold text-sm">Quantity</Text>
          <View className="flex-row gap-2 items-center">
            <TouchableOpacity className="px-2 py-0 bg-red-600 rounded-full w-8 h-8 justify-center items-center" onPress={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              } else {
                setQuantity(1);
              }
            }}>
              <AntDesign name="minuscircleo" size={16} color="white" />
            </TouchableOpacity>
            <Text className="text-white">{quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                setQuantity(quantity + 1);
              }}
              className="px-2 py-1 bg-red-600 rounded-full w-8 h-8 justify-center items-center"
            >
              <AntDesign name="pluscircleo" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-full flex flex-row justify-between items-center mt-4">
          <Text className="text-white font-semibold text-sm">
            Want Automation
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() =>
                setCurrentData({ ...currentData, automationRequired: true })
              }
              className={`px-4 py-2 ${currentData.automationRequired ? "bg-red-600" : "bg-zinc-900"
                } rounded-full mt-2`}
            >
              <Text className="text-white">YES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setCurrentData({ ...currentData, automationRequired: false })
              }
              className={`px-4 py-2 ${!currentData.automationRequired ? "bg-red-600" : "bg-zinc-900"
                } ml-2 rounded-full mt-2`}
            >
              <Text className="text-white">NO</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-full flex flex-row justify-between items-center mt-4">
          <TextInput
            value={currentData.panelName}
            placeholderTextColor={"#aaa"}
            placeholder="Enter Panel Name"
            onChangeText={(value) =>
              setCurrentData({ ...currentData, panelName: value })
            }
            className="w-full rounded-sm bg-zinc-900 px-4 text-white"
          />
        </View>
        <View className="w-full flex flex-row justify-between items-center mt-4">
          <TextInput
            value={remarks}
            placeholderTextColor={"#aaa"}
            placeholder="Enter Remarks"
            onChangeText={(value) =>
              setRemarks(value)
            }
            className="w-full rounded-sm bg-zinc-900 px-4 text-white h-20"
          />
        </View>
      </View>
      <View className="w-full p-4 items-end">
        <TouchableOpacity
          onPress={moveStep}
          className="px-4 py-2 bg-red-800 rounded-full"
        >
          <Text className="text-xl text-white">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PanelBuilder;
