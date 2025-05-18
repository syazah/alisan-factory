import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Fontisto from "@expo/vector-icons/Fontisto";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { SalesCustomer } from "../../../store/admin/atom";
import { router, useLocalSearchParams } from "expo-router";
import url from "../../../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
const CustomPanelBuilder = () => {
  const { id } = useLocalSearchParams();
  const [currentOpenDropdown, setCurrentOpenDropdown] = useState(0);
  const [customer, setCustomer] = useRecoilState(SalesCustomer);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (showSuccess) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setShowSuccess(false));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, fadeAnim, scaleAnim]);

  // Fetch collection data when component mounts
  useEffect(() => {
    if (id) {
      fetchCollectionData();
    }
  }, [id]);

  // Function to fetch collection data
  const fetchCollectionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${url}/api/v1/sales/get-collection/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log("Collection data:", result.data);
        
        // Log panel information
        if (result.data.panels && result.data.panels.length > 0) {
          console.log("Collection panels:", result.data.panels);
        }
        
        setCollection(result.data);
        
        // Initialize customer state with just empty panelData
        setCustomer(prevCustomer => ({
          ...prevCustomer,
          panelData: []
        }));
      } else {
        const errorMessage = result.message || 'Failed to fetch collection';
        console.error("API Error:", errorMessage);
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error fetching collection:', error);
      setError('Network error. Please try again.');
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  async function HandleAddCustomer() {
    try {
      const token = await AsyncStorage.getItem("token");
      setAddingCustomer(true);
      
      if (customer.panelData.length === 0) {
        setAddingCustomer(false);
        return Alert.alert(
          "No Panels Added", 
          "Please add at least one panel to continue"
        );
      }
      
      // Submit the panels to the collection
      const res = await fetch(`${url}/api/v1/sales/add-panels-to-collection`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ 
          panelData: customer.panelData,
          collectionId: collection._id,
          token
        }),
      });
      
      const data = await res.json();
      
      if (data.success === true) {
        setShowSuccess(true);
        setCustomer({
          ...customer,
          panelData: [],
        });
        setAddingCustomer(false);
        
        setTimeout(() => {
          router.replace("/sales");
        }, 2500);
      } else {
        setAddingCustomer(false);
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setAddingCustomer(false);
      Alert.alert("Connection Error", "Unable to process request. Please check your connection and try again.");
    }
  }
  
  return (
    <SafeAreaView className="flex-1 bg-red-900">
      <StatusBar style="light" />
      
      {/* Success Notification */}
      {showSuccess && (
        <Animated.View 
          style={{
            position: 'absolute',
            top: 80,
            left: 20,
            right: 20,
            zIndex: 100,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="bg-red-600 p-4 rounded-xl shadow-2xl mx-4"
        >
          <View className="flex-row items-center">
            <MaterialIcons name="check-circle" size={24} color="white" />
            <Text className="text-white font-semibold ml-2 text-base">
              Panels added to collection!
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Header with improved design */}
      <View 
        className="w-full pt-4 pb-6 px-6 flex-row justify-between items-center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View>
          <Text className="text-red-100 text-sm font-medium tracking-wide">SALES DASHBOARD</Text>
          <Text className="text-white font-bold text-2xl mt-1">Panel Builder</Text>
          {collection && (
            <Text className="text-white text-sm opacity-80 mt-1">
              Collection: {collection.name}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="bg-white/20 p-3 rounded-full"
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content with improved shadows and rounded corners */}
      <View 
        className="flex-1 bg-white rounded-t-3xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#DC2626" />
            <Text className="text-gray-500 mt-3">Loading collection...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center p-5">
            <Ionicons name="alert-circle-outline" size={50} color="#DC2626" />
            <Text className="text-gray-700 font-medium text-lg mt-3 text-center">
              Failed to load collection
            </Text>
            <Text className="text-gray-500 mt-1 text-center mb-2">{error}</Text>
            {/* Display detailed error if available */}
            <ScrollView className="bg-gray-50 p-3 rounded-xl w-full mb-4">
              <Text className="text-gray-600 text-sm font-mono">
                {typeof error === 'object' ? JSON.stringify(error, null, 2) : error}
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={fetchCollectionData}
              className="mt-3 bg-red-50 px-5 py-3 rounded-xl"
            >
              <Text className="text-red-600 font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !collection ? (
          <View className="flex-1 justify-center items-center p-5">
            <Ionicons name="folder-outline" size={50} color="#9CA3AF" />
            <Text className="text-gray-700 font-medium text-lg mt-3 text-center">
              Collection not found
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="mt-5 bg-red-50 px-5 py-3 rounded-xl"
            >
              <Text className="text-red-600 font-semibold">Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="p-5">
              {/* Collection Information */}
              <View className="mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="folder-open" size={22} color="#DC2626" />
                  <Text className="text-red-700 font-bold text-lg ml-2">
                    Collection Details
                  </Text>
                </View>
                <Text className="text-gray-700">
                  <Text className="font-semibold">Name: </Text>
                  {collection.name}
                </Text>
                {collection.author && (
                  <Text className="text-gray-700 mt-1">
                    <Text className="font-semibold">Customer: </Text>
                    {collection.author.name}
                  </Text>
                )}
              </View>
              
              {/* Panels Section */}
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                      <Ionicons name="layers" size={20} color="#E53E3E" />
                    </View>
                    <Text className="text-gray-800 font-bold text-lg ml-3">
                      Panel List
                    </Text>
                  </View>
                  <Text className="text-red-600 text-xs font-medium px-2 py-1 bg-red-50 rounded-full">
                    {collection.panels?.length || 0} panels
                  </Text>
                </View>
                
                {collection.panels && collection.panels.length > 0 ? (
                  <View className="space-y-3 mb-6">
                    {collection.panels.map((panel, index) => (
                      <View key={index} className="bg-white rounded-xl p-4 border border-gray-100 flex-row justify-between items-center"
                        style={{
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 2,
                        }}
                      >
                        <View className="flex-row items-center">
                          <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
                            <Text className="text-red-600 font-bold">{index + 1}</Text>
                          </View>
                          <View>
                            <Text className="text-gray-800 font-semibold text-base">
                              {panel.panelName || `Panel ${index+1}`}
                            </Text>
                            {panel.panelData && panel.panelData.type && (
                              <Text className="text-gray-500 text-xs">
                                Type: {panel.panelData.type}
                              </Text>
                            )}
                          </View>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#6B7280" />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="bg-gray-50 rounded-xl p-6 items-center justify-center mb-6">
                    <Ionicons name="layers-outline" size={40} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2 text-center">
                      No panels in this collection
                    </Text>
                  </View>
                )}
                
                <View className="mb-3 mt-6">
                  <Text className="text-gray-800 font-bold text-lg">
                    New Panels
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Add new panels to this collection
                  </Text>
                </View>
                
                {customer.panelData.length > 0 ? (
                  <View className="space-y-3">
                    {customer.panelData.map((panel, index) => (
                      <View key={index} className="bg-white rounded-xl p-4 border border-gray-100 flex-row justify-between items-center"
                        style={{
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 2,
                        }}
                      >
                        <View className="flex-row items-center">
                          <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
                            <Text className="text-red-600 font-bold">{index + 1}</Text>
                          </View>
                          <View>
                            <Text className="text-gray-800 font-semibold text-base">
                              {panel.panelName}
                            </Text>
                            {panel.type && (
                              <Text className="text-gray-500 text-xs">
                                Type: {panel.type}
                              </Text>
                            )}
                          </View>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#6B7280" />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="bg-gray-50 rounded-xl p-6 items-center justify-center">
                    <Ionicons name="layers-outline" size={40} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2 text-center">
                      No panels added yet
                    </Text>
                  </View>
                )}
                
                {/* Add Panel Button - Enabled only if collection exists */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    router.navigate("/sales/panel-builder/" + id);
                  }}
                  className="mt-5 bg-red-50 border border-red-100 rounded-xl py-4 flex-row justify-center items-center"
                  style={{
                    shadowColor: "#EF4444",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 1,
                  }}
                >
                  <Ionicons name="add-circle" size={22} color="#DC2626" />
                  <Text className="text-red-700 font-semibold text-base ml-2">
                    Add New Panel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const CustomerDetails = () => {
  const [customer, setCustomer] = useRecoilState(SalesCustomer);
  
  const inputStyle = "bg-gray-50 rounded-lg p-3 border border-gray-200 text-gray-800 text-base";
  const labelStyle = "text-gray-500 text-xs font-medium mb-1 ml-1";
  
  const updateCustomer = (field, value) => {
    setCustomer({
      ...customer,
      [field]: value
    });
  };
  
  return (
    <View className="space-y-4">
      <View>
        <Text className={labelStyle}>Full Name</Text>
        <View className="flex-row items-center">
          <View className="w-10 items-center justify-center">
            <Ionicons name="person-outline" size={18} color="#6B7280" />
          </View>
          <TextInput
            value={customer.name}
            onChangeText={(value) => updateCustomer('name', value)}
            placeholder="Enter customer's full name"
            placeholderTextColor="#9CA3AF"
            className={`${inputStyle} flex-1 ml-1`}
          />
        </View>
      </View>
      
      <View>
        <Text className={labelStyle}>Email Address</Text>
        <View className="flex-row items-center">
          <View className="w-10 items-center justify-center">
            <Ionicons name="mail-outline" size={18} color="#6B7280" />
          </View>
          <TextInput
            value={customer.email}
            onChangeText={(value) => updateCustomer('email', value.toLowerCase().trim())}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
            className={`${inputStyle} flex-1 ml-1`}
          />
        </View>
      </View>
      
      <View>
        <Text className={labelStyle}>Phone Number</Text>
        <View className="flex-row items-center">
          <View className="w-10 items-center justify-center">
            <Ionicons name="call-outline" size={18} color="#6B7280" />
          </View>
          <TextInput
            value={customer.phone}
            keyboardType="phone-pad"
            onChangeText={(value) => updateCustomer('phone', value.toString().trim())}
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
            className={`${inputStyle} flex-1 ml-1`}
          />
        </View>
      </View>
      
      <View>
        <Text className={labelStyle}>Address</Text>
        <View className="flex-row items-center">
          <View className="w-10 items-center justify-center">
            <Ionicons name="location-outline" size={18} color="#6B7280" />
          </View>
          <TextInput
            value={customer.address}
            onChangeText={(value) => updateCustomer('address', value)}
            placeholder="Enter street address"
            placeholderTextColor="#9CA3AF"
            className={`${inputStyle} flex-1 ml-1`}
          />
        </View>
      </View>
      
      <View className="flex-row">
        <View className="flex-1 mr-2">
          <Text className={labelStyle}>City</Text>
          <View className="flex-row items-center">
            <View className="w-8 items-center justify-center">
              <Ionicons name="business-outline" size={16} color="#6B7280" />
            </View>
            <TextInput
              value={customer.city}
              onChangeText={(value) => updateCustomer('city', value)}
              placeholder="City"
              placeholderTextColor="#9CA3AF"
              className={`${inputStyle} flex-1 ml-1`}
            />
          </View>
        </View>
        
        <View className="flex-1">
          <Text className={labelStyle}>State</Text>
          <View className="flex-row items-center">
            <View className="w-8 items-center justify-center">
              <Ionicons name="flag-outline" size={16} color="#6B7280" />
            </View>
            <TextInput
              value={customer.state}
              onChangeText={(value) => updateCustomer('state', value)}
              placeholder="State"
              placeholderTextColor="#9CA3AF"
              className={`${inputStyle} flex-1 ml-1`}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CustomPanelBuilder;
