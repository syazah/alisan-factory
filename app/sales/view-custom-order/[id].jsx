import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import url from "../../../url";
import { useSetRecoilState } from "recoil";
import { orderDetailForBomGeneration } from "../../../store/admin/atom";
const CustomOrder = () => {
  const { id } = useLocalSearchParams();
  const [panelDetail, setPanelDetail] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);
  const setOrderDetailForBom = useSetRecoilState(orderDetailForBomGeneration);
  function CalculatePanelData(panelData) {
    const newPanelArray = [];
    panelData.forEach((panel) => {
      const panelObj = {
        panelName: panel.panelName,
        panelSize: panel.panelSize,
        panelGlass: panel.panelGlass,
        panelFrame: panel.panelFrame,
        switches: 0,
        curtains: 0,
        fans: 0,
        dimmers: 0,
      };

      panel.panelVariant.forEach((variant) => {
        if (variant.switches > 0) {
          panelObj.switches += variant.switches;
        } else if (variant.curtains > 0) {
          panelObj.curtains += variant.curtains;
        } else if (variant.fans > 0) {
          panelObj.fans += variant.fans;
        } else if (variant.dimmers > 0) {
          panelObj.dimmers += variant.dimmers;
        }
      });
      newPanelArray.push(panelObj);
    });

    setPanelDetail(newPanelArray);
  }
  async function GetCutomOrderDetails() {
    try {
      const res = await fetch(`${url}/api/v1/sales/get-panels`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success === true) {
        CalculatePanelData(data.data.panelData);
        const newData = data.data.panelData.map((panel) => {
          return { panelData: panel };
        });
        const panelObject = data.data;
        const newPanelObject = { ...panelObject, panelData: newData };

        setOrderDetailForBom(newPanelObject);
        return setCustomerDetail(data.data);
      } else {
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      return nextTick(error);
    }
  }
  React.useEffect(() => {
    GetCutomOrderDetails();
  }, []);

  if (panelDetail === null) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="justify-center items-center">
        <ActivityIndicator color="red" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-zinc-200 relative">
      <View className="w-full h-[8%] flex-row justify-start items-center border-b-[1px] border-red-800">
        <MaterialIcons name="dashboard-customize" size={28} color="maroon" />
        <Text className="text-2xl font-semibold">Custom Order Detail</Text>
      </View>

      <View className={"w-full h-[92%] p-2"}>
        <ScrollView>
          <Text className="font-semibold text-red-800 text-base">
            Customer Details
          </Text>
          <Text className="font-normal text-red-800 text-sm border-b-[1px] border-zinc-300 w-full">
            Name <Text className="text-zinc-900">{customerDetail.name}</Text>
          </Text>
          <Text className="font-normal text-red-800 text-sm border-b-[1px] border-zinc-300 w-full">
            Email <Text className="text-zinc-900">{customerDetail.email}</Text>
          </Text>
          <Text className="font-normal text-red-800 text-sm border-b-[1px] border-zinc-300 w-full">
            Phone <Text className="text-zinc-900">{customerDetail.phone}</Text>
          </Text>
          <Text className="font-normal text-red-800 text-sm border-b-[1px] border-zinc-300 w-full">
            Address{" "}
            <Text className="text-zinc-900">
              {customerDetail.address}, {customerDetail.city},{" "}
              {customerDetail.state}
            </Text>
          </Text>

          {/* PANEL DETAILS  */}
          <Text className="font-semibold text-red-800 text-base mt-4">
            Panel Details
          </Text>
          {panelDetail.map((panel, index) => {
            return (
              <View key={index} className="border-b-[1px] border-zinc-300 py-2">
                <Text className="font-semibold text-base">
                  {index + 1} {panel.panelName}
                </Text>
                <Text className="text-sm w-full ml-4 capitalize">
                  Panel Size : {panel.panelSize} Module
                </Text>
                <Text className="text-sm w-full ml-4 capitalize">
                  Switches : {panel.switches}
                </Text>
                <Text className="text-sm w-full ml-4 capitalize">
                  Curtains : {panel.curtains}
                </Text>
                <Text className="text-sm w-full ml-4 capitalize">
                  Fans : {panel.fans}
                </Text>
                <Text className="text-sm w-full ml-4 capitalize">
                  Dimmers : {panel.dimmers}
                </Text>
                <View className="flex-row mt-1">
                  <Text
                    style={{ backgroundColor: panel.panelFrame }}
                    className="text-sm p-1 px-4 ml-4 capitalize rounded-full text-white"
                  >
                    Frame
                  </Text>
                  <Text
                    style={{ backgroundColor: panel.panelGlass }}
                    className="text-sm p-1 px-4 ml-2 capitalize rounded-full text-white"
                  >
                    Glass
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <BottomBar />
    </SafeAreaView>
  );
};

function BottomBar({ bottomBarSize = 70 }) {
  return (
    <View
      style={{ height: bottomBarSize }}
      className="absolute bottom-0 left-0 bg-zinc-950 w-full rounded-t-xl  px-4 py-4"
    >
      <View className="flex flex-row justify-end items-start">
        <TouchableOpacity
          onPress={() => router.navigate("/sales/quotation")}
          className="px-4 p-2 bg-red-800 rounded-md"
        >
          <Text className="text-white font-semibold text-sm">
            View Quotation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomOrder;
