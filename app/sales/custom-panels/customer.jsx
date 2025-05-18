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
import { router } from "expo-router";
import url from "../../../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
const CustomerForm = () => {
  const [customer, setCustomer] = useRecoilState(SalesCustomer);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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

  async function HandleAddCustomer() {
    try {
      const token = await AsyncStorage.getItem("token");
      setAddingCustomer(true);
      
      // Validate customer details
      const emptyFields = Object.entries(customer)
        .filter(([key, value]) => value === '')
        .map(([key]) => key);
        
      if (emptyFields.length > 0) {
        setAddingCustomer(false);
        return Alert.alert(
          "Missing Information", 
          `Please fill in the following fields: ${emptyFields.join(', ')}`
        );
      }
      
      const res = await fetch(`${url}/api/v1/sales/add-customer`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ ...customer, token }),
      });
      
      const data = await res.json();
      
      if (data.success === true) {
        setShowSuccess(true);
        // Reset customer data
        setCustomer({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: ""
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
              Customer added successfully!
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
          <Text className="text-white font-bold text-2xl mt-1">Add Customer</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="px-5 py-3 rounded-xl flex-row items-center shadow-lg bg-red-800 bg-opacity-50"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="arrow-back" size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Back</Text>
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
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-5">
            {/* Customer Details Section */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                  <Ionicons name="person" size={20} color="#E53E3E" />
                </View>
                <Text className="text-gray-800 font-bold text-lg ml-3">
                  Customer Details
                </Text>
              </View>
              
              <View className="bg-white rounded-xl p-4 mt-1 border border-gray-100"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <CustomerDetails />
              </View>
            </View>
            
            {/* Form Actions */}
            <View className="mt-4 mb-8 flex-row">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                className="flex-1 mr-2 py-3 rounded-xl bg-gray-100 flex-row justify-center items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Ionicons name="close-circle" size={18} color="#4B5563" />
                <Text className="text-gray-700 font-semibold ml-2">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={HandleAddCustomer}
                disabled={addingCustomer}
                className={`flex-1 py-3 rounded-xl flex-row justify-center items-center ${addingCustomer ? 'bg-red-300' : 'bg-red-600'}`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                {addingCustomer ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <FontAwesome5 name="paper-plane" size={18} color="white" />
                    <Text className="text-white font-semibold ml-2">Save Customer</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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

export default CustomerForm;
