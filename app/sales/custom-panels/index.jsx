import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  TextInput,
} from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import url from "../../../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const PanelCustomers = () => {
  const [customers, setCustomers] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const scrollY = useRef(new Animated.Value(0)).current;
  
  async function GetCustomers() {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${url}/api/v1/sales/get-customer`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success === true) {
        setCustomers(data.data);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong while getting customers"
      );
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    GetCustomers();
  }, []);

  const handleAddCustomer = () => {
    router.navigate("/sales/custom-panels/customer");
  };

  const handleRefresh = () => {
    GetCustomers();
  };

  const filteredCustomers = customers?.filter(customer => 
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  ) || [];

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [150, 70],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp'
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp'
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text className="mt-4 text-gray-600 font-medium">Loading customers...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Animated Header */}
      <Animated.View 
        style={{ height: headerHeight }} 
        className="w-full bg-white px-4 pb-2"
      >
        <Animated.View 
          style={{ opacity: headerOpacity }}
          className="mt-2"
        >
          <Text className="text-gray-400 font-medium text-sm">Welcome to</Text>
        </Animated.View>
        
        <Animated.Text 
          style={{ transform: [{ scale: titleScale }] }}
          className="text-3xl font-bold text-gray-800 mb-3"
        >
          Customer Panel
        </Animated.Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2 mb-2">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search customers..."
            className="flex-1 ml-2 text-gray-800"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Customer List */}
      <View className="flex-1 bg-white px-3 pb-3">
        {filteredCustomers.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons name="people-outline" size={70} color="#E5E7EB" />
            <Text className="text-gray-400 mt-4 text-center px-6">
              {searchQuery ? "No customers match your search" : "No customers found. Add your first customer!"}
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              className="mt-4 py-2 px-4 rounded-lg bg-gray-100"
            >
              <Text className="text-gray-700 font-medium">Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.FlatList
            data={filteredCustomers}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => router.navigate(`/sales/view-custom-order/${item._id}`)}
                className="bg-white mb-3 rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                <LinearGradient
                  colors={['#ffffff', '#f9fafb']}
                  className="p-4"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text numberOfLines={1} className="text-lg font-semibold text-gray-800">
                        {item.name || "Unnamed Customer"}
                      </Text>
                      
                      <View className="flex-row items-center mt-2">
                        <MaterialIcons name="email" size={16} color="#9CA3AF" />
                        <Text numberOfLines={1} className="text-gray-600 ml-2 flex-1">
                          {item.email || "No email provided"}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center mt-2">
                        <FontAwesome name="phone" size={16} color="#9CA3AF" />
                        <Text className="text-gray-600 ml-2">
                          {item.phone || "No phone provided"}
                        </Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      className="h-9 w-9 rounded-full bg-gray-100 justify-center items-center"
                      onPress={() => router.navigate(`/sales/view-custom-order/${item._id}`)}
                    >
                      <Ionicons name="chevron-forward" size={18} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        )}
        
        {/* Add Customer Button */}
        <TouchableOpacity
          onPress={handleAddCustomer}
          className="absolute bottom-6 right-6 w-14 h-14 bg-red-600 rounded-full justify-center items-center shadow-lg elevation-5"
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PanelCustomers;