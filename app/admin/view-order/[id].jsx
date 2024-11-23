import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Linking,
  Dimensions,
  Image,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { WebView } from "react-native-webview";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import url from "../../../url";
import { useSetRecoilState } from "recoil";
import { orderDetailForBomGeneration } from "../../../store/admin/atom";
import { useCameraPermissions } from "expo-camera";
const SpecificOrder = () => {
  const { id } = useLocalSearchParams();
  const [orderDetail, setOrderDetail] = React.useState(null);
  const [bottomBarSize, setBottomBarSize] = React.useState(70);
  const [salesTeam, setSalesTeam] = React.useState(null);
  const [adding, setAdding] = React.useState(false);
  const [showPDF, setShowPDF] = React.useState(false);
  const [manufacturingTeam, setManufacturingTeam] = React.useState(null);
  const setOrderDetailForBOM = useSetRecoilState(orderDetailForBomGeneration);

  //   FETCH SALES TEAM
  async function getSalesTeam() {
    try {
      const res = await fetch(`${url}/api/v1/admin/sales-team`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        setSalesTeam(data.salesTeam);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  }
  //   FETCH Manufacturing TEAM
  async function getManufacturingTeam() {
    try {
      const res = await fetch(`${url}/api/v1/admin/manufacturing-team`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success === true) {
        setManufacturingTeam(data.manTeam);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  }
  //ADD TO SALESMAN
  async function AddToSalesMan({ orderID, salesManID }) {
    try {
      setAdding(true);
      const res = await fetch(`${url}/api/v1/admin/assign-order-salesman`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID, salesManID }),
        method: "POST",
      });
      const data = await res.json();
      if (data.success === true) {
        setAdding(false);
        Alert.alert("Success", "Added Order to salesman");
        return router.replace("/admin/orders");
      } else {
        setAdding(false);
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      setAdding(false);
      return Alert.alert(
        "Error",
        "Something Went Wrong While Adding This Order To Salesman"
      );
    }
  }
  //ADD TO MANUFACTURER
  async function AddToManufacturer({ orderID, manufacturerID }) {
    try {
      setAdding(true);
      const res = await fetch(`${url}/api/v1/admin/assign-order-manufacturer`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID, manufacturerID }),
        method: "POST",
      });
      const data = await res.json();
      if (data.success === true) {
        setAdding(false);
        Alert.alert("Success", "Added Order to Manufacturer");
        return router.replace("/admin/orders");
      } else {
        setAdding(false);
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      setAdding(false);
      return Alert.alert(
        "Error",
        "Something Went Wrong While Adding This Order To Salesman"
      );
    }
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
  if (adding) {
    return (
      <SafeAreaView
        className={"flex-1 bg-zinc-800 justify-center items-center"}
      >
        <ActivityIndicator color={"red"} />
        <Text className="text-base text-white font-semibold">
          Assigning Order
        </Text>
      </SafeAreaView>
    );
  }
  const now = new Date();
  const createdAt = orderDetail.createdAt;
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
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView
      style={{ flex: 1, width }}
      className={"flex-1 bg-zinc-200 relative"}
    >
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* MAIN BODY  */}
        <View className="w-full p-2 pb-44">
          {orderDetail.detailedStage === "completed" && (
            <View className={"w-full justify-start items-end"}>
              <Image
                className="w-[200px] h-[200px] rounded-xl"
                source={{ uri: orderDetail.orderCompletedImage }}
              />
            </View>
          )}
          <View className="flex flex-col">
            <Text className="text-base w-full font-semibold text-red-800">
              Order Data
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300">
              Reference Number : #{orderDetail.referenceNumber}
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300">
              Current Stage :{" "}
              {orderDetail.detailedStage === "completed"
                ? "COMPLETED"
                : orderDetail.currentStage}
            </Text>
            {orderDetail.currentStage != "Admin" && (
              <Text className="text-base w-full border-b-[1px] border-zinc-300">
                Assigned To : {orderDetail.assignedTo.name}
              </Text>
            )}
            {orderDetail.currentStage != "Admin" && (
              <Text className="text-base w-full border-b-[1px] border-zinc-300">
                Email : {orderDetail.assignedTo.email}
              </Text>
            )}
            <Text className="text-base w-full border-b-[1px] border-zinc-300 mt-1">
              Number Of Panels : {orderDetail.panelData.length}
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300 mt-1">
              Order Generated : {timeAgoMessage}
            </Text>
          </View>
          <View className="flex flex-col mt-2">
            <Text className="text-base w-full font-semibold text-red-800">
              Client Data
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300">
              Name : {orderDetail.raisedBy.name}
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300">
              Email : {orderDetail.raisedBy.email}
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300">
              Username : @{orderDetail.raisedBy.username}
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300">
              Phone Number : {orderDetail.raisedBy.number}
            </Text>
            <Text className="text-base w-full border-b-[1px] border-zinc-300">
              Created By : {orderDetail.raisedBy.createdBy.name} [
              {orderDetail.raisedBy.createdByModel}]
            </Text>
          </View>
          <View className="flex flex-col mt-2">
            <Text className="text-base w-full font-semibold text-red-800">
              Panel Data
            </Text>
            <View>
              {orderDetail.panelData.map((panel, index) => (
                <View
                  key={index}
                  className="border-b-[1px] border-zinc-300 mt-2"
                >
                  <Text className="font-semibold text-base">
                    {index + 1} {panel.panelName}
                  </Text>
                  <Text className="text-sm w-full ml-4 capitalize">
                    Panel Type : {panel.panelType}
                  </Text>
                  <Text className="text-sm w-full ml-4 capitalize">
                    Panel Size : {panel.panelData.panelSize}
                  </Text>
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
        className={`absolute z-30 right-2 ${
          bottomBarSize === 70 ? "bottom-20" : "bottom-4"
        }  rounded-full w-12 h-12 bg-red-600 justify-center items-center`}
      >
        {bottomBarSize === 70 ? (
          <AntDesign name="pdffile1" size={30} color="white" />
        ) : (
          <AntDesign name="closecircle" size={30} color="black" />
        )}
      </TouchableOpacity>
      {/* VIEW QUOTATION  */}
      {orderDetail.detailedStage === "sales-to-admin" ||
        (orderDetail.detailedStage === "completed" && bottomBarSize === 70 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.navigate("/admin/quotation");
            }}
            className={`absolute z-30 right-2 bottom-36 rounded-full w-12 h-12 bg-red-600 justify-center items-center`}
          >
            <FontAwesome6 name="dollar-sign" size={30} color="white" />
          </TouchableOpacity>
        ))}

      {/* BOTTOM BAR  */}
      <BottomBar
        showPDF={showPDF}
        orderDetail={orderDetail}
        bottomBarSize={bottomBarSize}
        salesTeam={salesTeam}
        setBottomBarSize={setBottomBarSize}
        manufacturingTeam={manufacturingTeam}
        AddToManufacturer={AddToManufacturer}
        getManufacturingTeam={getManufacturingTeam}
        getSalesTeam={getSalesTeam}
        AddToSalesMan={AddToSalesMan}
      />
    </SafeAreaView>
  );
};

function BottomBar({
  bottomBarSize,
  salesTeam,
  orderDetail,
  showPDF,
  setBottomBarSize,
  getSalesTeam,
  AddToSalesMan,
  manufacturingTeam,
  AddToManufacturer,
  getManufacturingTeam,
}) {
  const setOrderDetailForBom = useSetRecoilState(orderDetailForBomGeneration);
  const encodedUrl = encodeURIComponent(orderDetail.pdfLink);
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`;
  const [loading, setLoading] = React.useState(false);
  return (
    <View
      style={{ height: bottomBarSize }}
      className="absolute bottom-0 left-0 bg-zinc-950 w-full rounded-t-xl  px-4 py-4"
    >
      <View className="flex flex-row justify-between items-start">
        <TouchableOpacity
          onPress={() => {
            setOrderDetailForBom(orderDetail);
            router.navigate(`/admin/order-bom/`);
          }}
          className="px-4 p-2 border-[1px] border-red-800 rounded-md flex-row items-center"
        >
          <AntDesign name="profile" size={20} color="white" />
          <Text className="text-white font-semibold text-sm ml-1">BOM</Text>
        </TouchableOpacity>
        {orderDetail.detailedStage === null &&
          orderDetail.currentStage === "Admin" && (
            <TouchableOpacity
              onPress={async () => {
                if (
                  orderDetail.currentStage === "Admin" &&
                  bottomBarSize < 600
                ) {
                  getSalesTeam();
                  if (bottomBarSize < 600) {
                    setBottomBarSize(600);
                  }
                } else {
                  setBottomBarSize(70);
                }
              }}
              className="px-4 p-2 bg-red-800 rounded-md"
            >
              <Text className="text-white font-semibold text-sm">
                {orderDetail.currentStage === "Admin"
                  ? bottomBarSize === 70
                    ? "Assign Sales Person"
                    : salesTeam === null
                    ? "Loading..."
                    : "Close"
                  : "Assign Manufacturer"}
              </Text>
            </TouchableOpacity>
          )}
        {orderDetail.currentStage === "Admin" &&
          orderDetail.detailedStage === "sales-to-admin" && (
            <TouchableOpacity
              onPress={async () => {
                if (
                  orderDetail.detailedStage === "sales-to-admin" &&
                  bottomBarSize < 600
                ) {
                  getManufacturingTeam();
                  if (bottomBarSize < 600) {
                    setBottomBarSize(600);
                  }
                } else {
                  setBottomBarSize(70);
                }
              }}
              className="px-4 py-2 bg-red-800 rounded-md"
            >
              <Text className="text-white">
                {bottomBarSize === 70
                  ? "Assign Manufact. Head"
                  : manufacturingTeam === null
                  ? "Loading..."
                  : "Close"}
              </Text>
            </TouchableOpacity>
          )}
      </View>

      {!showPDF && orderDetail.detailedStage === null && salesTeam !== null && (
        <View className="w-full h-full pb-10 mt-4">
          {salesTeam.length === 0 ? (
            <View className="w-full justify-center items-center h-full">
              <Text className="text-white">
                **No salesman to show, add a salesman
              </Text>
            </View>
          ) : (
            <FlatList
              data={salesTeam}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => {
                return (
                  <View className="w-full border-b-[1px] border-white relative">
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          `Add To ${item.name}`,
                          `Do you really want to add the order #${orderDetail.referenceNumber}, to ${item.name}`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Add",
                              onPress: () =>
                                AddToSalesMan({
                                  orderID: orderDetail._id,
                                  salesManID: item._id,
                                }),
                            },
                          ]
                        );
                      }}
                      className="w-8 h-8 bg-red-600 rounded-full right-4 top-2 absolute justify-center items-center z-10"
                    >
                      <Ionicons name="add-circle" size={28} color="black" />
                    </TouchableOpacity>
                    <Text className="text-red-700 font-semibold text-sm">
                      Name: <Text className="text-white">{item.name}</Text>
                    </Text>
                    <Text className="text-red-700 font-semibold text-sm">
                      Email: <Text className="text-white">{item.email}</Text>
                    </Text>
                    <Text className="text-red-700 font-semibold text-sm">
                      Phone Number:{" "}
                      <Text className="text-white">+91-{item.phoneNumber}</Text>
                    </Text>
                    <Text className="text-red-700 font-semibold text-sm">
                      Orders Assigned:{" "}
                      <Text className="text-white">{item.orders.length}</Text>
                    </Text>
                  </View>
                );
              }}
            />
          )}
        </View>
      )}
      {!showPDF &&
        orderDetail.detailedStage === "sales-to-admin" &&
        manufacturingTeam !== null && (
          <View className="w-full h-full pb-10 mt-4">
            {manufacturingTeam.length === 0 ? (
              <View className="w-full h-full flex justify-center items-center">
                <Text className="text-whites">
                  **No Manufacturer Added, Kindly add a manufacturer
                </Text>
              </View>
            ) : (
              <FlatList
                data={manufacturingTeam}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => {
                  return (
                    <View className="w-full border-b-[1px] border-white relative">
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            `Add To ${item.name}`,
                            `Do you really want to add the order #${orderDetail.referenceNumber}, to ${item.name}`,
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Add",
                                onPress: () =>
                                  AddToManufacturer({
                                    orderID: orderDetail._id,
                                    manufacturerID: item._id,
                                  }),
                              },
                            ]
                          );
                        }}
                        className="w-8 h-8 bg-red-600 rounded-full right-4 top-2 absolute justify-center items-center z-10"
                      >
                        <Ionicons name="add-circle" size={28} color="black" />
                      </TouchableOpacity>
                      <Text className="text-red-700 font-semibold text-sm">
                        Name: <Text className="text-white">{item.name}</Text>
                      </Text>
                      <Text className="text-red-700 font-semibold text-sm">
                        Email: <Text className="text-white">{item.email}</Text>
                      </Text>
                      <Text className="text-red-700 font-semibold text-sm">
                        Phone Number:{" "}
                        <Text className="text-white">
                          +91-{item.phoneNumber}
                        </Text>
                      </Text>
                      <Text className="text-red-700 font-semibold text-sm">
                        Orders Assigned:{" "}
                        <Text className="text-white">{item.orders.length}</Text>
                      </Text>
                    </View>
                  );
                }}
              />
            )}
          </View>
        )}

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
export default SpecificOrder;
