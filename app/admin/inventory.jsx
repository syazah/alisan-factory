import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import url from "../../url";

const Inventory = () => {
  const [addField, setAddField] = React.useState(false);
  const [editField, setEditField] = React.useState(null);
  const [inventoryDetail, setInventoryDetail] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: "",
    minimum: 0,
    objectID: "",
  });

  async function AdminGetInventory() {
    try {
      const res = await fetch(`${url}/api/v1/admin/get-inventory`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });

      const data = await res.json();
      if (data.success === true) {
        return setInventoryDetail(data.inventory);
      } else {
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      return Alert.alert("Error", "Something went wrong while getting error");
    }
  }

  useEffect(() => {
    AdminGetInventory();
  }, []);

  if (inventoryDetail === null) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-zinc-900">
        <ActivityIndicator color="#ef4444" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-zinc-900 flex-1">
      <View className="w-full px-4 py-6 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-white">Inventory</Text>
          <Text className="text-zinc-400 text-sm">Manage your items</Text>
        </View>
        <TouchableOpacity
          onPress={() => setAddField(true)}
          className="w-12 h-12 rounded-full bg-red-500 justify-center items-center shadow-lg shadow-red-500/50"
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-2">
        <FlatList
          data={inventoryDetail}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={({ item }) => (
            <View className="bg-zinc-800 rounded-xl p-4 flex-row justify-between items-center shadow-md">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-red-500/20 rounded-full justify-center items-center mr-3">
                  <MaterialIcons name="view-module" size={24} color="#ef4444" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium text-lg">
                    {item.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-zinc-400 text-sm">
                      ID: {item.objectID}
                    </Text>
                    <View className="w-1.5 h-1.5 rounded-full bg-zinc-500 mx-2" />
                    <Text className="text-red-500 font-medium">
                      Current: {item.current}
                    </Text>
                  </View>
                  <Text className="text-zinc-500 text-sm mt-1">
                    Minimum: {item.minimum}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setEditField({
                      id: item._id,
                      name: item.name,
                      objectID: item.objectID,
                      minimum: item.minimum,
                      current: item.current,
                    })
                  }
                  className="w-10 h-10 bg-zinc-700 rounded-full justify-center items-center ml-2"
                >
                  <AntDesign name="edit" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {addField && (
        <AddField
          setAddField={setAddField}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {editField != null && (
        <EditField setEditField={setEditField} editField={editField} />
      )}
    </SafeAreaView>
  );
};

function AddField({ setAddField, formData, setFormData }) {
  const [loading, setLoading] = React.useState(false);

  async function HandleSubmit() {
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/v1/admin/add-inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === true) {
        setLoading(false);
        setAddField(false);
        return Alert.alert("Success", "Added object to inventory");
      } else {
        setLoading(false);
        setAddField(false);
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      setLoading(false);
      return Alert.alert(
        "Error",
        "Something went wrong while adding Inventory"
      );
    }
  }

  return (
    <SafeAreaView className="absolute rounded-xl w-full h-full flex-1 top-[10%] justify-center items-center">
      <View className="w-[90%] p-2 bg-zinc-200 rounded-xl flex flex-col justify-start items-start">
        <View className="w-full flex-row justify-between items-center">
          <Text className="font-semibold text-xl">Add Field</Text>
          <TouchableOpacity
            onPress={() => setAddField(false)}
            className="w-10 h-10 rounded-full justify-center items-center bg-red-600"
          >
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="w-full flex flex-col p-1">
          <Text>Enter Object Name</Text>
          <TextInput
            value={formData.name}
            onChangeText={(value) => setFormData({ ...formData, name: value })}
            placeholder="eg. Modules"
            placeholderTextColor={"#aaa"}
            className="w-fulls bg-zinc-300 rounded-full mt-1 px-2"
          />
        </View>
        <View className="w-full flex flex-col p-1">
          <Text>Enter Object ID</Text>
          <TextInput
            value={formData.objectIDs}
            onChangeText={(value) =>
              setFormData({ ...formData, objectID: value })
            }
            placeholder="eg. 8_G1_GRY"
            placeholderTextColor={"#aaa"}
            className="w-fulls bg-zinc-300 rounded-full mt-1 px-2"
          />
        </View>
        <View className="w-full flex flex-col p-1">
          <Text>Enter Minimum Amount</Text>
          <TextInput
            value={formData.minimum}
            keyboardType="numeric"
            onChangeText={(value) =>
              setFormData({ ...formData, minimum: Number(value) })
            }
            placeholder="eg. 100"
            placeholderTextColor={"#aaa"}
            className="w-fulls bg-zinc-300 rounded-full mt-1"
          />
        </View>
        <View className="w-full flex-row justify-end items-center p-2">
          <TouchableOpacity
            onPress={HandleSubmit}
            className="bg-red-600 px-4 py-2 rounded-full"
          >
            <Text className="text-xl font-semibold text-white">
              {loading ? "Loading..." : "Add"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function EditField({ setEditField, editField }) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    id: editField.id,
    name: editField.name,
    current: Number(editField.current),
    minimum: Number(editField.minimum),
    objectID: editField.objectID,
  });

  async function HandleUpdate() {
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/v1/admin/update-inventory`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === true) {
        setLoading(false);
        setEditField(false);
        return Alert.alert("Success", "Updated object");
      } else {
        setLoading(false);
        setEditField(false);
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      setLoading(false);
      return Alert.alert(
        "Error",
        "Something went wrong while updating Inventory"
      );
    }
  }
  async function HandleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/v1/admin/delete-inventory`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editField.id }),
      });
      const data = await res.json();
      if (data.success === true) {
        setLoading(false);
        setEditField(false);
        return Alert.alert("Success", "Deleted object");
      } else {
        setLoading(false);
        setEditField(false);
        return Alert.alert("Error", data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      return Alert.alert(
        "Error",
        "Something went wrong while Deleting Inventory"
      );
    }
  }

  return (
    <SafeAreaView className="absolute w-full h-full flex-1 top-0 justify-center items-center bg-black/50">
      <View className="w-[95%] max-w-md p-4 bg-white rounded-2xl flex flex-col justify-start items-start shadow-2xl">
        <View className="w-full flex-row justify-between items-center mb-4">
          <View>
            <Text className="font-bold text-xl text-zinc-800">Edit Item</Text>
            <Text className="font-normal text-sm text-zinc-500">
              {editField.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setEditField(null)}
            className="w-8 h-8 rounded-full justify-center items-center bg-zinc-100"
          >
            <Feather name="x" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="w-full space-y-3">
          <View className="space-y-1">
            <Text className="text-sm font-medium text-zinc-700">
              Object Name
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) =>
                setFormData({ ...formData, name: value })
              }
              placeholder="eg. Modules"
              placeholderTextColor={"#9ca3af"}
              className="w-full bg-zinc-100 rounded-lg py-2 px-3 text-base"
            />
          </View>

          <View className="space-y-1">
            <Text className="text-sm font-medium text-zinc-700">Object ID</Text>
            <TextInput
              value={formData.objectID}
              onChangeText={(value) =>
                setFormData({ ...formData, objectID: value })
              }
              placeholder="eg. 8_G1_GRY"
              placeholderTextColor={"#9ca3af"}
              className="w-full bg-zinc-100 rounded-lg py-2 px-3 text-base"
            />
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1 space-y-1">
              <Text className="text-sm font-medium text-zinc-700">Minimum</Text>
              <TextInput
                value={String(formData.minimum)}
                onChangeText={(value) =>
                  setFormData({ ...formData, minimum: Number(value) })
                }
                keyboardType="numeric"
                placeholder="eg. 100"
                placeholderTextColor={"#9ca3af"}
                className="w-full bg-zinc-100 rounded-lg py-2 px-3 text-base"
              />
            </View>
            <View className="flex-1 space-y-1">
              <Text className="text-sm font-medium text-zinc-700">Current</Text>
              <TextInput
                value={String(formData.current)}
                onChangeText={(value) =>
                  setFormData({ ...formData, current: Number(value) })
                }
                keyboardType="numeric"
                placeholder="eg. 100"
                placeholderTextColor={"#9ca3af"}
                className="w-full bg-zinc-100 rounded-lg py-2 px-3 text-base"
              />
            </View>
          </View>
        </View>

        <View className="w-full flex-row justify-end items-center space-x-2 mt-6">
          <TouchableOpacity
            onPress={HandleDelete}
            className="px-4 py-2 rounded-lg border border-red-200 bg-red-50"
          >
            <AntDesign name="delete" size={20} color="#dc2626" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={HandleUpdate}
            className="bg-red-600 px-6 py-2 rounded-lg flex-row items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-base font-semibold text-white">Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Inventory;
