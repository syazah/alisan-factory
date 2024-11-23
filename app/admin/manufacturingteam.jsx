import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import url from "../../url";
const ManufacturingTeam = () => {
  const [addManufacturingTeam, setAddManufacturingTeam] = React.useState(false);
  const [manufacturingTeam, setManufacturingTeam] = React.useState(null);

  async function getManTeam() {
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
  React.useEffect(() => {
    getManTeam();
  }, []);
  async function DeleteManufacturer(_id) {
    try {
      const res = await fetch(`${url}/api/v1/admin/delete-manufacturer`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ _id }),
      });
      const data = await res.json();
      if (data.success === true) {
        return Alert.alert("Success", "Manufacturer is deleted");
      } else {
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while deleting the sales man");
    }
  }
  if (manufacturingTeam === null) {
    return (
      <SafeAreaView className="w-full h-full justify-center items-center bg-zinc-800">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-zinc-50 relative">
      <View className="w-full h-[10%] bg-zinc-50 justify-between items-center p-2 flex-row ">
        <Text className="font-semibold text-4xl text-red-700">
          Manufacturer
        </Text>
        <TouchableOpacity
          onPress={() => setAddManufacturingTeam(true)}
          activeOpacity={0.7}
          className="w-12 h-12 rounded-full bg-red-600 justify-center items-center"
        >
          <AntDesign name="pluscircleo" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <View className="w-full h-[90%] bg-zinc-800 rounded-t-xl py-4">
        {manufacturingTeam.length === 0 ? (
          <View className="w-full h-full justify-center items-center">
            <MaterialIcons
              name="precision-manufacturing"
              size={34}
              color="red"
            />
            <Text className="text-base font-semibold text-zinc-50">
              No Manufacturer Added
            </Text>
          </View>
        ) : (
          <FlatList
            data={manufacturingTeam}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => {
              return (
                <View className="w-full border-b-[1px] border-white p-2 relative">
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Delete Manufacturer",
                        "Do you really want to delete the Manufacturer, this will result in removing the manufacturer from his/her assigned orders",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            onPress: () => DeleteManufacturer(item._id),
                          },
                        ]
                      );
                    }}
                    className="w-8 h-8 bg-red-600 rounded-full right-4 top-2 absolute justify-center items-center z-10"
                  >
                    <AntDesign name="delete" size={24} color="black" />
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
      {addManufacturingTeam && (
        <AddManufacturingPerson
          setAddManufacturingPerson={setAddManufacturingTeam}
        />
      )}
    </SafeAreaView>
  );
};
function AddManufacturingPerson({ setAddManufacturingPerson }) {
  const { width, height } = Dimensions.get("window");
  const [manufacturerDetail, setManufacturerDetail] = React.useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: 0,
  });
  const [loading, setLoading] = React.useState(false);
  async function AddManufacturer() {
    try {
      setLoading(true);
      if (
        !manufacturerDetail.email ||
        !manufacturerDetail.password ||
        !manufacturerDetail.phoneNumber ||
        !manufacturerDetail.password
      ) {
        setLoading(false);
        return Alert.alert("Error", "All the fields are required");
      }
      const res = await fetch(`${url}/api/v1/admin/add-manufacturer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...manufacturerDetail,
          phoneNumber: manufacturerDetail.phoneNumber.toString(),
        }),
      });
      const data = await res.json();
      if (data.success === true) {
        setAddManufacturingPerson(false);
        return Alert.alert("Success", " Man is added to your database");
      } else {
        Alert.alert("Error", data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error",
        "Something went wrong while adding the manufacturer"
      );
    }
  }
  return (
    <View
      style={{ width, height }}
      className="flex-1 mt-10 bg-zinc-800 absolute top-0 left-0 p-2"
    >
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-2xl text-red-700">Add Person</Text>
        <TouchableOpacity
          onPress={() => setAddManufacturingPerson(false)}
          className="w-10 h-10 bg-red-600 rounded-full justify-center items-center"
        >
          <AntDesign name="minuscircleo" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View className="w-full h-full mt-4">
        <View>
          <Text className="text-white font-medium text-lg">Name</Text>
          <TextInput
            onChangeText={(value) =>
              setManufacturerDetail({ ...manufacturerDetail, name: value })
            }
            value={manufacturerDetail.name}
            placeholder="Enter Name Of  Person"
            placeholderTextColor={"gray"}
            className="w-full p-2 bg-zinc-900 rounded-lg font-normal text-white mt-1"
          />
        </View>
        <View className="mt-2">
          <Text className="text-white font-medium text-lg">Email</Text>
          <TextInput
            onChangeText={(value) =>
              setManufacturerDetail({
                ...manufacturerDetail,
                email: value.toLocaleLowerCase().trim(""),
              })
            }
            value={manufacturerDetail.email}
            placeholder="Enter Name Of Person"
            placeholderTextColor={"gray"}
            className="w-full p-2 bg-zinc-900 rounded-lg font-normal text-white mt-1s"
          />
        </View>
        <View className="mt-2">
          <Text className="text-white font-medium text-lg">Password</Text>
          <TextInput
            onChangeText={(value) =>
              setManufacturerDetail({ ...manufacturerDetail, password: value })
            }
            value={manufacturerDetail.password}
            secureTextEntry={true}
            placeholder="Enter Password For  Person"
            placeholderTextColor={"gray"}
            className="w-full p-2 bg-zinc-900 rounded-lg font-normal text-white mt-1s"
          />
        </View>
        <View className="mt-2">
          <Text className="text-white font-medium text-lg">Phone Number</Text>
          <TextInput
            onChangeText={(value) =>
              setManufacturerDetail({
                ...manufacturerDetail,
                phoneNumber: value.trim(),
              })
            }
            keyboardType="number-pad"
            value={manufacturerDetail.phoneNumber}
            placeholder="Enter Phone Number Of  Person"
            placeholderTextColor={"gray"}
            className="w-full p-2 bg-zinc-900 rounded-lg font-normal text-white mt-1s"
          />
        </View>
        <View className="flex-row justify-end items-center mt-8">
          <TouchableOpacity
            onPress={AddManufacturer}
            className="p-2 px-8 bg-red-600 rounded-full"
          >
            <Text className="text-xl font-semibold">
              {loading ? "Loading..." : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export default ManufacturingTeam;
