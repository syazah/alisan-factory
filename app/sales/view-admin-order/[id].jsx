import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { WebView } from "react-native-webview";
import url from "../../../url";
import { useSetRecoilState } from "recoil";
import { orderDetailForBomGeneration } from "../../../store/admin/atom";

const ViewOrder = () => {
  const { id } = useLocalSearchParams();
  const [orderDetail, setOrderDetail] = React.useState(null);
  const [bottomBarSize, setBottomBarSize] = React.useState(70);
  const [timeMessage, setTimeMessage] = React.useState("");
  const [panelArray, setPanelArray] = React.useState([]);
  const [showPDF, setShowPDF] = React.useState(false);
  const setOrderDetailForBOM = useSetRecoilState(orderDetailForBomGeneration);
  //   CALCULATE PANEL DATA
  function CalculatePanelData(panelData) {
    const newPanelArray = [];
    panelData.forEach((panel) => {
      const panelObj = {
        panelName: panel.panelName,
        panelSize: panel.panelData.panelSize,
        panelType: panel.panelType,
        panelGlass: panel.panelData.panelGlass,
        panelFrame: panel.panelData.panelFrame,
        quantity: panel.quantity || 1,
        switches: 0,
        curtains: 0,
        fans: 0,
        dimmers: 0,
      };

      panel.panelData.panelVariant.forEach((variant) => {
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
    setPanelArray(newPanelArray);
  }
  //   FETCH ORDER DETAILS
  async function GetOrderDetail() {
    try {
      const res = await fetch(`${url}/api/v1/admin/get-specific-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const data = await res.json();
      if (data.success === true) {
        setOrderDetail(data.order);
        setOrderDetailForBOM(data.order);
        const now = new Date();
        const createdAt = data.order.updatedAt;
        const createdTime = new Date(createdAt);
        const diffInSeconds = Math.floor((now - createdTime) / 1000); // Time difference in seconds

        let timeAgoMessage = ""; // Variable to store the result

        if (diffInSeconds < 60) {
          timeAgoMessage = `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
          // Less than an hour
          const minutes = Math.floor(diffInSeconds / 60);
          timeAgoMessage = `${minutes} minutes ago`;
        } else if (diffInSeconds < 86400) {
          // Less than a day
          const hours = Math.floor(diffInSeconds / 3600);
          timeAgoMessage = `${hours} hours ago`;
        } else {
          const days = Math.floor(diffInSeconds / 86400);
          timeAgoMessage = `${days} days ago`;
        }
        setTimeMessage(timeAgoMessage);
        CalculatePanelData(data.order.panelData);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching the order");
    }
  }

  //HANDLE DOWNLOAD
  async function handlePDFDownload() {
    try {
      const fileURL = orderDetail.pdfLink;
      await Linking.openURL(fileURL);
    } catch (error) {
      console.log(error);
      return Alert.alert("Error", "Something went wrong while downloading pdf");
    }
  }
  React.useEffect(() => {
    GetOrderDetail();
  }, []);
  if (orderDetail === null) {
    return (
      <SafeAreaView
        className={"flex-1 bg-zinc-800 justify-center items-center"}
      >
        <ActivityIndicator color={"red"} />
      </SafeAreaView>
    );
  }
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ width }} className={"flex-1 bg-zinc-200 relative"}>
      <View className="p-2 border-b-[1px] border-red-800 flex-row justify-between items-center">
        <View className="flex flex-row  justify-start items-center">
          <MaterialIcons name="bookmark-border" size={30} color="maroon" />
          <Text className="text-zinc-900 text-3xl font-semibold">
            Order Details
          </Text>
        </View>
        <TouchableOpacity
          onPress={handlePDFDownload}
          className="bg-red-600 p-2 rounded-full"
        >
          <AntDesign name="download" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* MAIN BODY  */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
        <View style={{ flex: 1 }} className="p-2">
          <View className="flex flex-col">
            <Text className="text-base w-full font-semibold text-red-800">
              Order Data
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300">
              Reference Number : #{orderDetail.referenceNumber}
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300">
              Current Stage : {orderDetail.currentStage}
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300 mt-1">
              Number Of Panels : {orderDetail.panelData.length}
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300 mt-1">
              Order Assigned : {timeMessage}
            </Text>
          </View>
          <View className="flex flex-col mt-2">
            <Text className="text-base w-full font-semibold text-red-800">
              Panel Data
            </Text>
            <View>
              {panelArray.map((panel, index) => (
                <View
                  key={index}
                  className="border-b-[1px] border-zinc-300 py-2"
                >
                  <Text className="font-semibold text-base">
                    {index + 1} {panel.panelName}
                  </Text>
                  <Text className="text-sm w-full ml-4 capitalize">
                    Panel Type : {panel.panelType}
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
                  <Text className="text-sm w-full ml-4 capitalize">
                    Quantity : {panel.quantity}
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
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      {/* {PDF OPENER}  */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (bottomBarSize < 100) {
            setShowPDF(true);
            setBottomBarSize(700);
          } else {
            setShowPDF(false);
            setBottomBarSize(70);
          }
        }}
        className={`absolute z-10 right-2 ${bottomBarSize === 70 ? "bottom-20" : "bottom-4"
          }  rounded-full w-12 h-12 bg-red-600 justify-center items-center`}
      >
        {bottomBarSize === 70 ? (
          <AntDesign name="pdffile1" size={30} color="white" />
        ) : (
          <AntDesign name="closecircle" size={30} color="black" />
        )}
      </TouchableOpacity>
      <BottomBar
        orderDetail={orderDetail}
        bottomBarSize={bottomBarSize}
        setBottomBarSize={setBottomBarSize}
        showPDF={showPDF}
      />
    </SafeAreaView>
  );
};

// function BottomBar({ bottomBarSize, orderDetail, setBottomBarSize }) {
//   const encodedUrl = encodeURIComponent(orderDetail.pdfLink);
//   const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`;
//   return (
//     <View
//       style={{ height: bottomBarSize }}
//       className="absolute bottom-0 left-0 bg-zinc-950 w-full rounded-t-xl  px-4 py-4"
//     >
//       <View className="flex flex-row justify-between items-start">
//         <TouchableOpacity
//           onPress={() => {
//             if (bottomBarSize < 100) {
//               setBottomBarSize(700);
//             } else {
//               setBottomBarSize(70);
//             }
//           }}
//           className="px-4 p-2 border-[1px] border-red-800 rounded-md flex-row items-center"
//         >
//           <AntDesign name="pdffile1" size={20} color="red" />
//           <Text className="text-white font-semibold text-sm ml-1">
//             {bottomBarSize < 100 ? "Open PDF" : "Close PDF"}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="px-4 p-2 bg-red-800 rounded-md">
//           <Text className="text-white font-semibold text-sm">View BOM</Text>
//         </TouchableOpacity>
//       </View>

//       {/* PDF  */}
//       <WebView style={{ flex: 1, marginTop: 10 }} source={{ uri: viewerUrl }} />
//     </View>
//   );
// }

function BottomBar({ bottomBarSize, orderDetail, showPDF, setBottomBarSize }) {
  const setOrderDetailForBom = useSetRecoilState(orderDetailForBomGeneration);
  const encodedUrl = encodeURIComponent(orderDetail.pdfLink);
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`;
  const [loading, setLoading] = useState(false);
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

      {/* PDF  */}
      {showPDF && (
        <View style={{ flex: 1 }} className="relative">
          {loading && (
            <ActivityIndicator
              size="large"
              color="red"
              className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-20"
            />
          )}
          <WebView
            style={{ flex: 1, marginTop: 10 }}
            source={{ uri: viewerUrl }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false); // Stop loader if an error occurs
              Alert.alert(
                "Error",
                "Failed to load the document. Please check your internet connection. Restart The App"
              );
            }}
          />
        </View>
      )}
    </View>
  );
}
export default ViewOrder;
