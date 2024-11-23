import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Landing from "../components/Landing";
import SignUp from "../components/auth/SignUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const LandingData = [<Landing />, <SignUp />];
const LandingScreen = () => {
  const [userDetails, setUserDetails] = useState({
    token: "",
    userType: "",
  });
  React.useEffect(() => {
    async function getToken() {
      try {
        const token = await AsyncStorage.getItem("token");
        const userType = await AsyncStorage.getItem("userType");

        if (token && userType) {
          setUserDetails({
            token,
            userType,
          });
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong while fetching user token");
      }
    }
    getToken();
  }, []);

  React.useEffect(() => {
    if (userDetails.token) {
      if (userDetails.userType === "admin") {
        router.replace("/admin");
      } else if (userDetails.userType === "sales") {
        router.replace("/sales");
      } else if (userDetails.userType === "worker") {
        router.replace("/worker");
      } else {
        router.replace("/manufacturer");
      }
    }
  }, [userDetails]);
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-900 relative">
      <FlatList
        data={LandingData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => item}
        horizontal
        pagingEnabled={true}
      />
    </SafeAreaView>
  );
};

export default LandingScreen;
