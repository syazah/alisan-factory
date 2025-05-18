import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import url from "../../../url";
import { useSetRecoilState } from "recoil";
import { orderDetailForBomGeneration } from "../../../store/admin/atom";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CustomOrder = () => {
  const { id } = useLocalSearchParams();
  const [panelDetail, setPanelDetail] = useState(null);
  const [panelData, setPanelData] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collection, setCollection] = useState(null);
  const [deletingCollectionId, setDeletingCollectionId] = useState(null);
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
      const res = await fetch(`${url}/api/v1/sales/get-collection`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCustomerDetail(data.data);
        setCollection(data.data.collections);
        let panelArray = [];
        data.data.collections.forEach((item) => {
          if (item.panels) {
            panelArray.push(...item.panels);
          }
        });
        setPanelData(panelArray);
      } else {
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error(error);
      return Alert.alert("Connection Error", "Unable to fetch order details. Please check your connection and try again.");
    }
  }
  // async function GetCutomOrderDetails() {
  //   try {
  //     const res = await fetch(`${url}/api/v1/sales/get-panels`, {
  //       headers: { "Content-Type": "application/json" },
  //       method: "POST",
  //       body: JSON.stringify({ id }),
  //     });
  //     const data = await res.json();
  //     if (data.success === true) {
  //       CalculatePanelData(data.data.panelData);
  //       const newData = data.data.panelData.map((panel) => {
  //         return { panelData: panel };
  //       });
  //       const panelObject = data.data;
  //       const newPanelObject = { ...panelObject, panelData: newData };

  //       setOrderDetailForBom(newPanelObject);
  //       return setCustomerDetail(data.data);
  //     } else {
  //       return Alert.alert("Error", data.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return Alert.alert("Connection Error", "Unable to fetch order details. Please check your connection and try again.");
  //   }
  // }

  // When refreshing, need to get collections again
  async function handleCreateCollection() {
    if (!collectionName.trim()) {
      Alert.alert("Error", "Please enter a collection name");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${url}/api/v1/sales/create-collection`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ 
          _id: customerDetail._id,
          name: collectionName.trim() 
        }),
      });
      
      const data = await res.json();
      setIsSubmitting(false);
      
      if (data.success) {
        setModalVisible(false);
        setCollectionName("");
        Alert.alert("Success", "Collection added successfully");
        // Refresh collections after adding a new one
        GetCutomOrderDetails();
      } else {
        Alert.alert("Error", data.message || "Failed to create collection");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      Alert.alert("Connection Error", "Unable to create collection. Please check your connection and try again.");
    }
  }

  // Function to delete a collection
  async function handleDeleteCollection(collectionId) {
    Alert.alert(
      "Delete Collection",
      "Are you sure you want to delete this collection? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingCollectionId(collectionId);
              setIsSubmitting(true);
              
              // Using the correct API endpoint format with the ID in the URL
              const res = await fetch(`${url}/api/v1/sales/delete-collection/${collectionId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              });
              
              const data = await res.json();
              setIsSubmitting(false);
              setDeletingCollectionId(null);
              
              if (data.success) {
                Alert.alert("Success", "Collection deleted successfully");
                // Refresh collections after deleting
                return router.replace("/sales")
              } else {
                Alert.alert("Error", data.message || "Failed to delete collection");
              }
            } catch (error) {
              setIsSubmitting(false);
              setDeletingCollectionId(null);
              console.error(error);
              Alert.alert("Connection Error", "Unable to delete collection. Please check your connection and try again.");
            }
          }
        }
      ],
      { cancelable: true }
    );
  }

  // Function to create an order
  async function handleRaiseOrder() {
    try {
      // Check if collection exists
      if (!collection || collection.length === 0) {
        return Alert.alert("Error", "No collections found for this customer. Please create at least one collection first.");
      }

      // Get token
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return Alert.alert("Error", "Authentication failed. Please login again.");
      }

      // Show loading
      setIsSubmitting(true);

      // Call API to create order
      const res = await fetch(`${url}/api/v1/sales/create-order`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ 
          panelData: collection,
          token 
        }),
      });
      
      const data = await res.json();
      setIsSubmitting(false);
      
      if (data.success) {
        Alert.alert(
          "Success", 
          "Order has been raised successfully! Reference: " + data.newOrder?.referenceNumber,
          [
            {
              text: "OK",
              onPress: () => router.replace("/sales")
            }
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to create order");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      Alert.alert("Connection Error", "Unable to create order. Please check your connection and try again.");
    }
  }

  React.useEffect(() => {
    GetCutomOrderDetails();
    console.log(id);
  }, []);

  if (customerDetail === null) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <View className="items-center">
          <ActivityIndicator size="large" color="#B91C1C" />
          <Text className="text-gray-600 mt-4 font-medium">Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* Collection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="w-5/6 rounded-xl p-5 shadow-lg" style={{ backgroundColor: 'white' }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-800 font-bold text-xl">New Collection</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-gray-500 mb-4">
              Create a new collection for {customerDetail?.name}
            </Text>
            
            <Text className="text-gray-700 font-medium mb-2">Collection Name</Text>
            <TextInput
              className="bg-gray-100 p-3 rounded-lg border border-gray-200 mb-4"
              placeholder="Enter collection name"
              value={collectionName}
              onChangeText={setCollectionName}
            />
            
            <View className="flex-row justify-end">
              <TouchableOpacity
                className={`p-3 rounded-full ${isSubmitting ? 'bg-red-300' : 'bg-red-600'}`}
                onPress={handleCreateCollection}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="check" size={24} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header with shadow */}
      <View 
        className="w-full bg-red-800 py-4 px-4 flex-row justify-between items-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="mr-3 bg-white/20 p-2 rounded-full"
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xs font-medium">Customer #{id.substring(0, 8)}</Text>
            <Text className="text-white text-xl font-bold">Customer Collections</Text>
          </View>
        </View>
        <TouchableOpacity 
          className="bg-white/20 p-3 rounded-full"
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Customer Card */}
        <View className="m-4 bg-white rounded-xl overflow-hidden shadow-md" 
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View className="bg-red-50 px-4 py-3 border-b border-red-100">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <MaterialIcons name="person" size={20} color="#B91C1C" />
                <Text className="font-bold text-red-900 ml-2 text-base">
                  Customer Details
                </Text>
              </View>
              <View className="bg-red-100 px-2 py-1 rounded-full">
                <Text className="text-red-800 text-xs font-medium">
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
          
          <View className="p-4">
            <View className="flex-row mb-3">
              <View className="w-24">
                <Text className="text-gray-500 text-sm">Name</Text>
              </View>
              <Text className="text-gray-800 font-medium text-sm flex-1">
                {customerDetail.name}
              </Text>
            </View>
            
            <View className="flex-row mb-3">
              <View className="w-24">
                <Text className="text-gray-500 text-sm">Email</Text>
              </View>
              <Text className="text-gray-800 font-medium text-sm flex-1">
                {customerDetail.email}
              </Text>
            </View>
            
            <View className="flex-row mb-3">
              <View className="w-24">
                <Text className="text-gray-500 text-sm">Phone</Text>
              </View>
              <Text className="text-gray-800 font-medium text-sm flex-1">
                {customerDetail.phone}
              </Text>
            </View>
            
            <View className="flex-row">
              <View className="w-24">
                <Text className="text-gray-500 text-sm">Address</Text>
              </View>
              <Text className="text-gray-800 font-medium text-sm flex-1">
                {customerDetail.address}, {customerDetail.city}, {customerDetail.state}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Collection Cards */}
        <View className="px-4 mb-24">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-bold text-gray-800 text-lg">
              Collections
            </Text>
            <View className="bg-red-50 px-3 py-1 rounded-full">
              <Text className="text-red-800 text-xs font-medium">
                {collection?.length || 0} Collections
              </Text>
            </View>
          </View>
          
          {collection && collection.length > 0 ? (
            collection.map((item, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => {
                  // Navigate to collection details or implement view action here
                  router.push({
                    pathname: `/sales/build-panels/${item._id}`,
                  });
                }}
              >
                <View 
                  className="bg-white rounded-xl overflow-hidden mb-4 border border-gray-100"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <View className="bg-gray-50 px-4 py-4 border-b border-gray-100 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-3">
                        <MaterialIcons name="collections" size={20} color="#B91C1C" />
                      </View>
                      <View>
                        <Text className="font-bold text-gray-800 text-base">
                          {item.name}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          Created on {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <TouchableOpacity 
                        className="mr-3 p-2 rounded-full bg-red-50"
                        onPress={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteCollection(item._id);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        {deletingCollectionId === item._id && isSubmitting ? (
                          <ActivityIndicator size="small" color="#B91C1C" />
                        ) : (
                          <MaterialIcons name="delete-outline" size={20} color="#B91C1C" />
                        )}
                      </TouchableOpacity>
                      <MaterialIcons name="arrow-forward" size={20} color="#B91C1C" />
                    </View>
                  </View>
                  
                  <View className="p-4">
                    <View className="flex-row items-center mb-2">
                      <MaterialIcons name="category" size={16} color="#6B7280" />
                      <Text className="text-gray-600 ml-2 text-sm">
                        Collection ID: <Text className="font-medium">{item._id.substring(0, 8)}...</Text>
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center">
                      <MaterialIcons name="dashboard" size={16} color="#6B7280" />
                      <Text className="text-gray-600 ml-2 text-sm">
                        Panels: <Text className="font-medium">{item.panels?.length || 0} panels</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-gray-50 rounded-xl p-8 items-center justify-center">
              <MaterialIcons name="collections" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-center font-medium">
                No collections found
              </Text>
              <Text className="text-gray-400 mt-2 text-center text-sm">
                Create a new collection by clicking the plus button
              </Text>
              <TouchableOpacity
                className="mt-4 bg-red-600 p-3 rounded-full flex-row items-center justify-center"
                onPress={() => setModalVisible(true)}
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      <BottomBar panelData={panelData} handleRaiseOrder={handleRaiseOrder} customerId={id} isSubmitting={isSubmitting} />
    </SafeAreaView>
  );
};

function BottomBar({ bottomBarSize = 80, isSubmitting, customerId, panelData }) {
  async function handleRaiseOrder() {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return Alert.alert("Error", "Authentication failed. Please login again.");
      }
      const res = await fetch(`${url}/api/v1/sales/create-order`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ 
          panelData: panelData,
          token
        }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert(
          "Success", 
          "Order has been raised successfully! Reference: " + data.newOrder?.referenceNumber,
          [
            {
              text: "OK",
              onPress: () => router.replace("/sales")
            }
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to create order");
      }
    } catch (error) {
      
    }
  }
  return (
    <View
      style={{ 
        height: bottomBarSize,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
      }}
      className="absolute bottom-0 left-0 bg-white w-full px-4 py-4 flex-row justify-center items-center border-t border-gray-100"
    >
      <TouchableOpacity
        onPress={()=>{
          Alert.alert(
            "Raise Order",
            "Are you sure you want to raise an order for this collection?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "OK",
                onPress: handleRaiseOrder
              }
            ],
            { cancelable: true }
          );
        }}
        disabled={isSubmitting}
        className={`${isSubmitting ? 'bg-red-400' : 'bg-red-600'} px-8 py-3 rounded-xl flex-row items-center justify-center`}
        style={{
          shadowColor: "#DC2626",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {isSubmitting ? (
          <>
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Processing...
            </Text>
          </>
        ) : (
          <>
            <MaterialIcons name="receipt" size={24} color="white" />
            <Text className="text-white font-bold text-base ml-2">
              Raise Order
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default CustomOrder;
