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
      <SafeAreaView className="flex-1 justify-center items-center bg-zinc-800">
        <ActivityIndicator color="red" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="bg-zinc-200 flex-1 relative">
      <View className="w-full h-[10%] flex-row justify-between items-center p-2">
        <Text className="text-4xl font-semibold">Inventory</Text>
        <TouchableOpacity
          onPress={() => setAddField(true)}
          className="w-12 h-12 rounded-full bg-red-600 justify-center items-center"
        >
          <Ionicons name="add" size={42} color="black" />
        </TouchableOpacity>
      </View>
      <View className="w-full h-[90%] bg-zinc-800 rounded-t-xl">
        <FlatList
          data={inventoryDetail}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item, index }) => (
            <View className="w-full p-2 flex-row justify-between items-start border-b-[1px] border-zinc-400">
              <View className="flex-row justify-between items-start">
                <MaterialIcons name="view-module" size={32} color="red" />
                <View>
                  <Text className={"text-sm text-white ml-1"}>{item.name}</Text>
                  <Text className={"text-sm ml-1 text-red-600"}>
                    Current {item.current}
                  </Text>
                  <Text className={"text-sm ml-1 text-zinc-400"}>
                    #{item.objectID}
                  </Text>
                  <Text className={"text-sm ml-1 text-zinc-400"}>
                    Minimum {item.minimum}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setEditField({
                    id: item._id,
                    name: item.name,
                    objectID: item.objectID,
                    minimum: item.minimum,
                    current: item.current,
                  });
                }}
                className="w-10 h-10 bg-red-600 rounded-full justify-center items-center"
              >
                <AntDesign name="edit" size={22} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {addField && <AddField setAddField={setAddField} />}
      {editField != null && (
        <EditField setEditField={setEditField} editField={editField} />
      )}
    </SafeAreaView>
  );
};

function AddField({ setAddField }) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    minimum: 0,
    objectID: "",
  });

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
    <SafeAreaView className="absolute rounded-xl w-full h-full flex-1 top-[10%] justify-center items-center">
      <View className="w-[90%] p-2 bg-zinc-200 rounded-xl flex flex-col justify-start items-start">
        <View className="w-full flex-row justify-between items-center">
          <Text className="font-normal text-sm">{editField.name}</Text>
          <TouchableOpacity
            onPress={() => setEditField(null)}
            className="w-10 h-10 rounded-full justify-center items-center bg-red-600"
          >
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className="w-full flex flex-col p-1">
          <Text>Edit Object Name</Text>
          <TextInput
            value={formData.name}
            onChangeText={(value) => setFormData({ ...formData, name: value })}
            placeholder="eg. Modules"
            placeholderTextColor={"#aaa"}
            className="w-fulls bg-zinc-300 rounded-full mt-1 px-2"
          />
        </View>
        <View className="w-full flex flex-col p-1">
          <Text>Edit Object ID</Text>
          <TextInput
            value={formData.objectID}
            onChangeText={(value) =>
              setFormData({ ...formData, objectID: value })
            }
            placeholder="eg. 8_G1_GRY"
            placeholderTextColor={"#aaa"}
            className="w-fulls bg-zinc-300 rounded-full mt-1 px-2"
          />
        </View>
        <View className="w-full flex flex-col p-1">
          <Text>Edit Minimum Amount</Text>
          <TextInput
            value={formData.minimum}
            onChangeText={(value) =>
              setFormData({ ...formData, minimum: Number(value) })
            }
            placeholder="eg. 100"
            keyboardType="numeric"
            placeholderTextColor={"#aaa"}
            className="w-fulls bg-zinc-300 rounded-full mt-1"
          />
        </View>
        <View className="w-full flex flex-col p-1">
          <Text>Edit Current Amount</Text>
          <TextInput
            value={formData.current}
            onChangeText={(value) =>
              setFormData({ ...formData, current: Number(value) })
            }
            keyboardType="numeric"
            placeholder="eg. 100"
            placeholderTextColor={"#aaa"}
            className="w-fulls bg-zinc-300 rounded-full mt-1"
          />
        </View>
        <View className="w-full flex-row justify-end items-center p-2">
          <TouchableOpacity
            onPress={HandleDelete}
            className="border-red-600 border-[1px] p-2 rounded-full"
          >
            <AntDesign name="delete" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={HandleUpdate}
            className="bg-red-600 px-4 py-2 rounded-full ml-1"
          >
            <Text className="text-xl font-semibold text-white">
              {loading ? "Loading..." : "Update"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Inventory;
