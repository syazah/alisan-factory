import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { orderDetailForBomGeneration } from "../../store/admin/atom";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalculatePanelData } from "../../utils/panelDataCalculator";
import { bomCalculator } from "../../utils/bomCalculator";
import { BomBoardCalculator } from "../../utils/boardCalculator";

const OrderDetailBom = () => {
  const orderDetailForBOM = useRecoilValue(orderDetailForBomGeneration);

  const [panelData, setPanelData] = React.useState(null);
  const [boardData, setBoardData] = React.useState(null);
  useEffect(() => {
    const newPanelData = CalculatePanelData(orderDetailForBOM.panelData);
    const bomBoardData = BomBoardCalculator(orderDetailForBOM.panelData);
    const finalPanelData = bomCalculator(newPanelData);
    setPanelData(finalPanelData);
    setBoardData(bomBoardData);
  }, []);
  if (panelData === null || boardData === null) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="justify-center items-center">
        <ActivityIndicator color="red" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }} className={"bg-zinc-200"}>
      <View className="w-full h-[12%]">
        <View className="w-full bg-red-800 justify-center items-center">
          <Image
            className="w-10 h-10"
            source={{
              uri: "https://www.alisan.io/images/alisan-smart-homes.png",
            }}
            resizeMode="contain"
          />
        </View>
        <View className="w-full border-b-[1px] border-red-800 p-2 flex-row justify-between items-center">
          <Text className="text-base text-red-800">Bill Of Material</Text>
          <Text className="font-semibold text-xl">
            #{orderDetailForBOM.referenceNumber}
          </Text>
        </View>
      </View>
      <View className="w-full h-[88%] px-2">
        {/* FRONT PANEL  */}
        <View className="flex justify-start items-start border-b-[1px] border-zinc-300">
          <Text className="font-semibold text-sm">Front Panels</Text>
          <View className="">
            {Object.entries(panelData.frontPanelsCount)
              .filter(([key, value]) => value !== 0)
              .map(([key, value], index) => (
                <View
                  key={index}
                  className="w-full justify-between items-center flex-row"
                >
                  <Text className="">{key}</Text>
                  <Text key={index} className="">
                    {value}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        {/* BACK PANEL  */}
        <View className="flex justify-start items-start border-b-[1px] border-zinc-300">
          <Text className="font-semibold text-sm">Back Panels</Text>
          <View className="">
            {Object.entries(panelData.backPanel)
              .filter(([key, value]) => value !== 0)
              .map(([key, value], index) => (
                <View
                  key={index}
                  className="w-full justify-between items-center flex-row"
                >
                  <Text className="">{key}</Text>
                  <Text key={index} className="">
                    {value}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        {/* GLASS PANEL  */}
        <View className="flex-col justify-between items-start border-b-[1px] border-zinc-300">
          <Text className="font-semibold text-sm">Glass Part</Text>
          <View className="">
            {Object.entries(boardData.glassPart)
              .filter(([key, value]) => value !== 0)
              .map(([key, value], index) => (
                <View
                  key={index}
                  className="w-full justify-between items-center flex-row"
                >
                  <Text className="">{key}</Text>
                  <Text key={index} className="">
                    {value}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        {/* Screws */}
        <View className="flex-row justify-between items-center border-b-[1px] border-zinc-300">
          <Text className="font-semibold text-sm">Screws</Text>
          <Text className="font-normal text-sm">{boardData.screws}</Text>
        </View>
        {/* ESP */}
        <View className="flex-row justify-between items-center border-b-[1px] border-zinc-300">
          <Text className="font-semibold text-sm">ESP</Text>
          <Text className="font-normal text-sm">
            FTT_ESP x {orderDetailForBOM.panelData.length}
          </Text>
        </View>
        {/* Power Supply */}
        <View className="flex-row justify-between items-center border-b-[1px] border-zinc-300">
          <Text className="font-semibold text-sm">Power Supply</Text>
          <Text className="font-normal text-sm">
            F_DUAL_PS x {orderDetailForBOM.panelData.length}
          </Text>
        </View>
        {/* Touch Sense Board */}
        <View className="flex-col justify-between items-start border-b-[1px] border-zinc-300">
          <Text className="font-semibold text-sm">Touch Sense Board</Text>
          <View className="">
            {Object.entries(boardData.touchSenseBoard)
              .filter(([key, value]) => value !== 0)
              .map(([key, value], index) => (
                <View
                  key={index}
                  className="w-full justify-between items-center flex-row"
                >
                  <Text className="">{key}</Text>
                  <Text key={index} className="">
                    {value}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        {/* Relay  Board */}
        <View className="flex-col justify-between items-start border-b-[1px] border-zinc-300">
          <Text className="font-semibold text-sm">Relay Board PCB</Text>
          <View className="">
            {Object.entries(boardData.relayBoard)
              .filter(([key, value]) => value !== 0)
              .map(([key, value], index) => (
                <View
                  key={index}
                  className="w-full justify-between items-center flex-row"
                >
                  <Text className="">{key}</Text>
                  <Text key={index} className="">
                    {value}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        {/* C  SECTIONS */}
        <View className="flex-col justify-between items-start border-b-[1px] border-zinc-300">
          <Text className="font-semibold text-sm">C Sections</Text>
          <View className="">
            {Object.entries(boardData.cSection)
              .filter(([key, value]) => value !== 0)
              .map(([key, value], index) => (
                <View
                  key={index}
                  className="w-full justify-between items-center flex-row"
                >
                  <Text className="">{key}</Text>
                  <Text key={index} className="">
                    {value}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderDetailBom;
