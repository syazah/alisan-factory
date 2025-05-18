import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
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
  function CalculatePanelData(customerData) {
    const newPanelArray = [];
    
    // Process all panels from all collections
    if (customerData && customerData.collections) {
      customerData.collections.forEach(collection => {
        if (collection.panels && collection.panels.length > 0) {
          collection.panels.forEach(panel => {
            const panelObj = {
              panelName: panel.panelName || 'Unnamed Panel',
              panelSize: panel.panelData?.panelSize || 'N/A',
              panelType: panel.panelData?.panelType || 'Standard',
              panelGlass: panel.panelData?.panelGlass || '#CCCCCC',
              panelFrame: panel.panelData?.panelFrame || '#333333',
              switches: 0,
              curtains: 0,
              fans: 0,
              dimmers: 0,
              collectionName: collection.name,
            };

            // If panel variants exist, calculate totals
            if (panel.panelData && panel.panelData.panelVariant) {
              panel.panelData.panelVariant.forEach(variant => {
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
            }
            
            newPanelArray.push(panelObj);
          });
        }
      });
    }
    
    setPanelArray(newPanelArray);
  }
  //   FETCH ORDER DETAILS
  async function GetOrderDetail() {
    try {
      // Use the new API endpoint that returns detailed customer and collection data
      const res = await fetch(`${url}/api/v1/sales/completeDetail/${id}`);
      const data = await res.json();
      
      if (data.success === true) {
        setOrderDetail(data.data);
        console.log(data.data.collections);

        let panelData = [];
        //accummulate all panels from data.data.collections into panelData
        data.data.collections.forEach((collection) => {
          if (collection.panels && collection.panels.length > 0) {
            panelData.push(...collection.panels);
          }
        });
        console.log(panelData);
        setOrderDetailForBOM({panelData});

        // Calculate time ago for display
        const now = new Date();
        const createdAt = data.data.updatedAt;
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
        // Process the complete customer data including collections and panels
        CalculatePanelData(data.data);
      } else {
        Alert.alert("Error", data.message || "Failed to retrieve order details");
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
        className={"flex-1 bg-zinc-900 justify-center items-center"}
      >
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#B91C1C" />
        <Text className="text-white mt-4 text-lg font-medium">Loading details...</Text>
      </SafeAreaView>
    );
  }
  const { width } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ width }} className={"flex-1 bg-zinc-50 relative"}>
      <StatusBar barStyle="dark-content" />
      {/* HEADER */}
      <LinearGradient
        colors={['#7f1d1d', '#b91c1c', '#ef4444']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-4 py-3 shadow-md"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MaterialIcons name="person" size={32} color="white" />
            <View className="ml-3">
              <Text className="text-white opacity-80 text-xs font-medium">
                Order #{id.substring(0, 8)}
              </Text>
              <Text className="text-white text-xl font-bold">
                {orderDetail.name}
              </Text>
            </View>
          </View>
          <View className="flex-row">
            {orderDetail.pdfLink && (
              <TouchableOpacity
                onPress={handlePDFDownload}
                className="bg-white/20 p-2 rounded-full mr-2"
                activeOpacity={0.7}
              >
                <AntDesign name="download" size={22} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-white/20 p-2 rounded-full"
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* ORDER STATUS */}
      <View className="bg-white border-b border-gray-200 px-4 py-2 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="clock-time-four-outline" size={18} color="#4b5563" />
          <Text className="text-gray-500 ml-1 text-sm">Last Updated: {timeMessage}</Text>
        </View>
        <View className="flex-row items-center">
          <View className="h-2 w-2 rounded-full bg-green-500 mr-1" />
          <Text className="text-green-700 font-medium text-sm">Active</Text>
        </View>
      </View>
      
      {/* MAIN BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        className="bg-gray-50"
      >
        <View className="p-4">
          {/* Customer Information Card */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="info-outline" size={20} color="#b91c1c" />
              <Text className="text-base font-bold text-gray-800 ml-2">
                Customer Information
              </Text>
            </View>
            <View className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <LinearGradient
                colors={['rgba(254,226,226,0.5)', 'rgba(254,226,226,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="px-4 pt-3 pb-2"
              >
                <Text className="text-lg font-bold text-gray-800">{orderDetail.name}</Text>
              </LinearGradient>
              
              <View className="px-4 py-3">
                <View className="flex-row border-b border-gray-100 py-2">
                  <View className="w-10 items-center justify-center">
                    <MaterialCommunityIcons name="email-outline" size={18} color="#6b7280" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-xs">Email</Text>
                    <Text className="text-gray-800 text-sm font-medium">{orderDetail.email}</Text>
                  </View>
                </View>
                
                <View className="flex-row border-b border-gray-100 py-2">
                  <View className="w-10 items-center justify-center">
                    <MaterialCommunityIcons name="phone-outline" size={18} color="#6b7280" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-xs">Phone</Text>
                    <Text className="text-gray-800 text-sm font-medium">{orderDetail.phone}</Text>
                  </View>
                </View>
                
                <View className="flex-row py-2">
                  <View className="w-10 items-center justify-center">
                    <MaterialCommunityIcons name="map-marker-outline" size={18} color="#6b7280" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-xs">Address</Text>
                    <Text className="text-gray-800 text-sm font-medium">
                      {orderDetail.address}, {orderDetail.city}, {orderDetail.state}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* Collections Summary Card */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="collections" size={20} color="#b91c1c" />
              <Text className="text-base font-bold text-gray-800 ml-2">
                Collections Summary
              </Text>
            </View>
            <View className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <View className="flex-row">
                <View className="bg-red-100 w-3" />
                <View className="flex-1 px-4 py-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Text className="text-4xl font-bold text-gray-800 mr-2">
                        {orderDetail.collections?.length || 0}
                      </Text>
                      <View>
                        <Text className="text-gray-500 text-xs">Total</Text>
                        <Text className="text-gray-800 text-sm font-medium">Collections</Text>
                      </View>
                    </View>
                    <View className="h-16 w-16 bg-red-50 rounded-full items-center justify-center">
                      <MaterialCommunityIcons name="view-grid-outline" size={28} color="#b91c1c" />
                    </View>
                  </View>
                  
                  <View className="mt-3 flex-row justify-between">
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="square-rounded-outline" size={16} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {panelArray.length} Total Panels
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => router.navigate("/sales/quotation")}
                      className="flex-row items-center"
                    >
                      <Text className="text-red-700 text-sm font-medium mr-1">View Quotation</Text>
                      <MaterialIcons name="arrow-forward-ios" size={12} color="#b91c1c" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Panel Data */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="chip" size={20} color="#b91c1c" />
                <Text className="text-base font-bold text-gray-800 ml-2">
                  Panel Details
                </Text>
              </View>
              <Text className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {panelArray.length} panels
              </Text>
            </View>
            
            {panelArray.map((panel, index) => (
              <View
                key={index}
                className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden border border-gray-100"
              >
                <View className="flex-row items-center justify-between bg-gray-50 px-4 py-2 border-b border-gray-100">
                  <View className="flex-row items-center">
                    <View className="h-8 w-8 rounded-full bg-red-100 items-center justify-center mr-2">
                      <Text className="font-bold text-red-800">{index + 1}</Text>
                    </View>
                    <Text className="font-bold text-gray-800">{panel.panelName}</Text>
                  </View>
                  <View className="bg-red-100 px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-red-800">
                      {panel.collectionName}
                    </Text>
                  </View>
                </View>
                
                <View className="px-4 py-3">
                  <View className="flex-row flex-wrap mb-3">
                    <View className="bg-gray-100 rounded-lg px-3 py-2 mr-2 mb-2">
                      <Text className="text-xs text-gray-500">Type</Text>
                      <Text className="text-sm font-medium text-gray-800 capitalize">{panel.panelType}</Text>
                    </View>
                    
                    <View className="bg-gray-100 rounded-lg px-3 py-2 mr-2 mb-2">
                      <Text className="text-xs text-gray-500">Size</Text>
                      <Text className="text-sm font-medium text-gray-800">{panel.panelSize} Module</Text>
                    </View>
                    
                    <View className="flex-row mb-2">
                      <View style={{ backgroundColor: panel.panelFrame }} className="h-10 w-10 rounded-lg mr-2 items-center justify-center">
                        <Text className="text-white text-xs font-medium">Frame</Text>
                      </View>
                      
                      <View style={{ backgroundColor: panel.panelGlass }} className="h-10 w-10 rounded-lg items-center justify-center">
                        <Text className="text-white text-xs font-medium">Glass</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="flex-row flex-wrap">
                    {panel.switches > 0 && (
                      <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2">
                        <FontAwesome5 name="toggle-on" size={12} color="#1e40af" />
                        <Text className="text-xs ml-1 font-medium text-blue-800">
                          {panel.switches} Switches
                        </Text>
                      </View>
                    )}
                    
                    {panel.curtains > 0 && (
                      <View className="flex-row items-center bg-green-50 px-3 py-1 rounded-full mr-2 mb-2">
                        <MaterialIcons name="curtains" size={12} color="#166534" />
                        <Text className="text-xs ml-1 font-medium text-green-800">
                          {panel.curtains} Curtains
                        </Text>
                      </View>
                    )}
                    
                    {panel.fans > 0 && (
                      <View className="flex-row items-center bg-amber-50 px-3 py-1 rounded-full mr-2 mb-2">
                        <FontAwesome5 name="fan" size={12} color="#92400e" />
                        <Text className="text-xs ml-1 font-medium text-amber-800">
                          {panel.fans} Fans
                        </Text>
                      </View>
                    )}
                    
                    {panel.dimmers > 0 && (
                      <View className="flex-row items-center bg-purple-50 px-3 py-1 rounded-full mr-2 mb-2">
                        <MaterialCommunityIcons name="brightness-6" size={12} color="#6b21a8" />
                        <Text className="text-xs ml-1 font-medium text-purple-800">
                          {panel.dimmers} Dimmers
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* FLOATING ACTION BUTTON FOR PDF */}
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
        className={`absolute z-10 right-4 ${
          bottomBarSize === 70 ? "bottom-20" : "bottom-20"
        } shadow-lg`}
      >
        <LinearGradient
          colors={bottomBarSize === 70 ? ['#b91c1c', '#7f1d1d'] : ['#1f2937', '#111827']}
          className="w-14 h-14 rounded-full justify-center items-center"
        >
          {bottomBarSize === 70 ? (
            <AntDesign name="pdffile1" size={24} color="white" />
          ) : (
            <AntDesign name="close" size={24} color="white" />
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      {/* BOTTOM SHEET */}
      <BottomBar
        orderDetail={orderDetail}
        bottomBarSize={bottomBarSize}
        setBottomBarSize={setBottomBarSize}
        showPDF={showPDF}
      />
    </SafeAreaView>
  );
};

function BottomBar({ bottomBarSize, orderDetail, showPDF, setBottomBarSize }) {
  const setOrderDetailForBom = useSetRecoilState(orderDetailForBomGeneration);
  const encodedUrl = encodeURIComponent(orderDetail.pdfLink);
  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`;
  const [loading, setLoading] = useState(false);
  
  return (
    <View
      style={{ height: bottomBarSize }}
      className="absolute bottom-0 left-0 bg-zinc-900 w-full rounded-t-3xl shadow-lg px-4 py-4"
    >
      <View className="flex-row justify-between items-center mb-1">
        <View className="flex-1">
          <Text className="text-white text-lg font-bold">
            {bottomBarSize === 70 ? "Order Details" : "Document Preview"}
          </Text>
          {bottomBarSize === 70 && (
            <Text className="text-gray-400 text-xs">
              Order #{orderDetail._id?.substring(0, 8)}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => router.navigate("/sales/quotation")}
          className="bg-red-700 px-4 py-2 rounded-lg flex-row items-center"
          activeOpacity={0.8}
        >
          <FontAwesome name="file-text-o" size={16} color="white" />
          <Text className="text-white font-medium text-sm ml-2">
            View Quotation
          </Text>
        </TouchableOpacity>
      </View>

      {/* PDF VIEWER */}
      {showPDF && (
        <View style={{ flex: 1 }} className="relative mt-2 rounded-xl overflow-hidden">
          {loading && (
            <View className="absolute inset-0 bg-black/50 z-20 items-center justify-center">
              <ActivityIndicator size="large" color="#ef4444" />
              <Text className="text-white mt-2">Loading document...</Text>
            </View>
          )}
          <View className="rounded-lg overflow-hidden">
            <WebView
              style={{ flex: 1 }}
              source={{ uri: viewerUrl }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                Alert.alert(
                  "Error",
                  "Failed to load the document. Please check your internet connection and try again."
                );
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default ViewOrder;
