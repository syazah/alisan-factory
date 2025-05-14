import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { orderDetailForBomGeneration } from "../../store/admin/atom";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalculatePanelData } from "../../utils/panelDataCalculator";
import { bomCalculator } from "../../utils/bomCalculator";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BomBoardCalculator } from "../../utils/boardCalculator";
import url from "../../url";
import BottomSheet from "../../components/BottomSheet";
import { extractAvailableItems } from "../../utils/availableItemExtractor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const OrderDetailBom = () => {
  const orderDetailForBOM = useRecoilValue(orderDetailForBomGeneration);

  const [panelData, setPanelData] = React.useState(null);
  const [boardData, setBoardData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [inventory, setInventory] = React.useState(null);
  const [inventoryOpen, setInventoryOpen] = React.useState(false);
  const [companyNameModalVisible, setCompanyNameModalVisible] = React.useState(false);
  const [companyName, setCompanyName] = React.useState("Alisan Smart Homes");

  async function getInventory() {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/v1/admin/get-inventory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setInventory(data.inventory);
      } else {
        Alert.alert("Error", "Something went wrong while getting inventory");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong while getting inventory");
    }
  }
  useEffect(() => {
    const newPanelData = CalculatePanelData(orderDetailForBOM.panelData);
    const bomBoardData = BomBoardCalculator(orderDetailForBOM.panelData);
    const finalPanelData = bomCalculator(newPanelData);
    setPanelData(finalPanelData);
    setBoardData(bomBoardData);
    getInventory();
  }, []);
  if (panelData === null || boardData === null || loading) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-white justify-center items-center"
      >
        <ActivityIndicator size="large" color="#991b1b" />
        <Text className="mt-4 text-gray-600">Loading BOM details...</Text>
      </SafeAreaView>
    );
  }

  const renderSection = (title, data, keyPrefix) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm pb-32">
      <Text className="text-lg font-semibold text-gray-800 mb-3">{title}</Text>
      {Object.entries(data)
        .filter(([_, value]) => value !== 0)
        .map(([key, value], index) => (
          <View
            key={`${keyPrefix}-${index}`}
            className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-0"
          >
            <Text className="text-gray-700">{key}</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 font-medium">{value}</Text>
              <Text className="text-gray-500 ml-1">units</Text>
            </View>
          </View>
        ))}
    </View>
  );

  const downloadScreenAsPDF = async () => {
    // Open the modal to get the company name
    setCompanyNameModalVisible(true);
  }

  const generateAndDownloadPDF = async () => {
    const htmlContent = generateHTML(); // Generate the HTML string for the screen
    const { uri } = await Print.printToFileAsync({ html: htmlContent }); // Convert to PDF

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing is not available on this device");
    }
  }

  const generateHTML = () => {
    const renderTableRows = (data, keyPrefix) => {
      return Object.entries(data)
        .filter(([_, value]) => value !== 0)
        .map(
          ([key, value], index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${key}</td>
              <td>${value} units</td>
            </tr>
          `
        )
        .join("");
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Bill of Material</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .header img {
            max-width: 150px;
          }
          .header .address {
            text-align: right;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .total-row {
            font-weight: bold;
            background-color: #e0e0e0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://www.alisan.io/images/alisan-smart-homes.png" alt="Alisan Smart Homes">
          <div class="address">
            <p>7-8, Sehrawat Complex,<br>
            Near Hanuman Mandir, Iffco Chowk,<br>
            Sukhrali, Gurugram, Haryana – 122001</p>
          </div>
        </div>
        <h1>Bill of Material</h1>
        <h2>For: ${companyName}</h2>
        <h2>Reference #${orderDetailForBOM.referenceNumber}</h2>

        <h3>Front Panels</h3>
        <table>
          <thead>
            <tr>
              <th>SR No</th>
              <th>Component</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(panelData.frontPanelsCount, "front")}
          </tbody>
        </table>

        <h3>Back Panels</h3>
        <table>
          <thead>
            <tr>
              <th>SR No</th>
              <th>Component</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(panelData.backPanel, "back")}
          </tbody>
        </table>

        <h3>Glass Parts</h3>
        <table>
          <thead>
            <tr>
              <th>SR No</th>
              <th>Component</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(boardData.glassPart, "glass")}
          </tbody>
        </table>

        <h3>Hardware Components</h3>
        <table>
          <thead>
            <tr>
              <th>SR No</th>
              <th>Component</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Screws</td>
              <td>${boardData.screws} units</td>
            </tr>
            <tr>
              <td>2</td>
              <td>ESP Modules</td>
              <td>${orderDetailForBOM.panelData.length} units</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Power Supply</td>
              <td>${orderDetailForBOM.panelData.length} units</td>
            </tr>
          </tbody>
        </table>

        <h3>Touch Sense Boards</h3>
        <table>
          <thead>
            <tr>
              <th>SR No</th>
              <th>Component</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(boardData.touchSenseBoard, "touch")}
          </tbody>
        </table>

        <h3>Relay Boards</h3>
        <table>
          <thead>
            <tr>
              <th>SR No</th>
              <th>Component</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(boardData.relayBoard, "relay")}
          </tbody>
        </table>

        <h3>C Sections</h3>
        <table>
          <thead>
            <tr>
              <th>SR No</th>
              <th>Component</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableRows(boardData.cSection, "csection")}
          </tbody>
        </table>
      </body>
      </html>
    `;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-gray-50">
      <View className="bg-red-800 p-4 shadow-lg">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold">
              Bill of Material
            </Text>
            <Text className="text-red-200 mt-1">
              Reference #{orderDetailForBOM.referenceNumber}
            </Text>
          </View>
          <Image
            className="w-12 h-12"
            source={{
              uri: "https://www.alisan.io/images/alisan-smart-homes.png",
            }}
            resizeMode="contain"
          />
          <TouchableOpacity activeOpacity={0.8} className="w-10 h-10 rounded-full bg-white justify-center items-center" onPress={downloadScreenAsPDF}><AntDesign name="download" size={24} color="black" /></TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {renderSection("Front Panels", panelData.frontPanelsCount, "front")}
        {renderSection("Back Panels", panelData.backPanel, "back")}
        {renderSection("Glass Parts", boardData.glassPart, "glass")}

        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Hardware Components
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-700">Screws</Text>
              <Text className="text-gray-900 font-medium">
                {boardData.screws} units
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-700">ESP Modules</Text>
              <Text className="text-gray-900 font-medium">
                {orderDetailForBOM.panelData.length} units
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-700">Power Supply</Text>
              <Text className="text-gray-900 font-medium">
                {orderDetailForBOM.panelData.length} units
              </Text>
            </View>
          </View>
        </View>

        {renderSection(
          "Touch Sense Boards",
          boardData.touchSenseBoard,
          "touch"
        )}
        {renderSection("Relay Boards", boardData.relayBoard, "relay")}
        {renderSection("C Sections", boardData.cSection, "csection")}
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setInventoryOpen(true)}
        className="w-16 h-16 bg-red-800 rounded-full absolute bottom-6 right-6 flex justify-center items-center shadow-lg"
      >
        <MaterialIcons name="inventory" size={32} color="white" />
      </TouchableOpacity>

      <BottomSheet
        isOpen={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
      >
        <InventoryMatcher
          id={orderDetailForBOM._id}
          boardData={boardData}
          panelData={panelData}
          inventory={inventory}
          inventoryAssigned={orderDetailForBOM?.inventoryAssigned || false}
        />
      </BottomSheet>

      {/* Company Name Modal */}
      {companyNameModalVisible && (
        <View className="w-full h-full inset-0 flex-1 bg-black/40 absolute top-0 left-0 bottom-0 right-0 justify-center items-center">
          <View className="w-[90%] p-4 bg-white rounded-xl">
            <View className="flex-row justify-between items-center border-b-[1px] border-zinc-800 pb-2">
              <Text className="text-red-800 font-semibold text-lg">Enter Company Name</Text>
              <TouchableOpacity onPress={() => setCompanyNameModalVisible(false)}>
                <AntDesign name="close" size={24} color="maroon" />
              </TouchableOpacity>
            </View>
            <Text className="text-zinc-600 text-sm py-3">
              Enter the company name that will be displayed on the PDF document.
            </Text>
            <TextInput
              value={companyName}
              onChangeText={(value) => setCompanyName(value)}
              placeholder="Company Name"
              className="w-full p-3 bg-zinc-100 rounded-xl mb-4"
            />
            <View className="w-full flex-row justify-end items-center">
              <TouchableOpacity
                onPress={() => {
                  setCompanyNameModalVisible(false);
                  generateAndDownloadPDF();
                }}
                className="px-5 py-2 bg-red-800 rounded-lg"
              >
                <Text className="text-white font-medium">Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

function InventoryMatcher({
  inventory,
  boardData,
  panelData,
  id,
  inventoryAssigned,
}) {
  const [userType, setUserType] = React.useState(null);
  const [usedComponents, setUsedComponents] = React.useState([]);
  const [filterStatus, setFilterStatus] = React.useState("all"); // 'all', 'low', 'ok'

  async function matchInventory() {
    const components = [];
    //step 1 match the boardData
    const boardDataItems = extractAvailableItems(boardData);
    const panelDataItems = extractAvailableItems(panelData);
    const allItems = [...boardDataItems, ...panelDataItems];

    allItems.forEach((item) => {
      const foundItem = inventory.find(
        (invItem) => invItem.objectID === item.id
      );
      if (foundItem) {
        components.push({
          id: foundItem._id,
          objectID: foundItem.objectID,
          name: foundItem.name,
          amountUsed: item.amount,
          amountLeft: foundItem.current - item.amount,
          minimum: foundItem.minimum,
        });
      }
    });
    setUsedComponents(components);
  }

  useEffect(() => {
    async function getUserType() {
      const userType = await AsyncStorage.getItem("userType");
      setUserType(userType);
    }
    getUserType();
    matchInventory();
  }, []);

  const filteredComponents = usedComponents.filter((comp) => {
    if (filterStatus === "all") return true;
    const isLowStock = comp.amountLeft < comp.minimum;
    return filterStatus === "low" ? isLowStock : !isLowStock;
  });

  return (
    <View className="w-full h-full bg-gray-50 relative">
      <View className="bg-white pb-2 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          Inventory Check
        </Text>

        <Text className="text-sm text-gray-500 mt-1">
          {filteredComponents.length} items found
        </Text>

        <View className="flex-row gap-2 mt-4">
          {["all", "low", "ok"].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded-lg ${
                filterStatus === status ? "bg-red-800 shadow-sm" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filterStatus === status ? "text-white" : "text-gray-600"
                }`}
              >
                {status === "ok"
                  ? "In Stock"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {filteredComponents.map((component) => (
          <View
            key={component.id}
            className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
          >
            <View className="p-4">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {component.name || component.objectID}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    component.amountLeft < component.minimum
                      ? "bg-red-100"
                      : "bg-green-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      component.amountLeft < component.minimum
                        ? "text-red-800"
                        : "text-green-800"
                    }`}
                  >
                    {component.amountLeft < component.minimum
                      ? "Low Stock"
                      : "In Stock"}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between bg-gray-50 rounded-lg p-3">
                <View className="items-center">
                  <Text className="text-xs text-gray-500 mb-1">USING</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {component.amountUsed}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-xs text-gray-500 mb-1">REMAINING</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {component.amountLeft}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-xs text-gray-500 mb-1">MINIMUM</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {component.minimum}
                  </Text>
                </View>
              </View>

              <View className="mt-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs text-gray-500">Stock Level</Text>
                  <Text className="text-xs text-gray-500">
                    {Math.round(
                      (component.amountLeft / (component.minimum * 2)) * 100
                    )}
                    %
                  </Text>
                </View>
                <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className={`h-full ${
                      component.amountLeft < component.minimum
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (component.amountLeft / (component.minimum * 2)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {userType === "admin" && !inventoryAssigned && (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Update All",
              "Are you sure you want to update all the inventory items?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Update",
                  onPress: async () => {
                    try {
                      const updatedComponents = usedComponents.map((comp) => ({
                        id: comp.id,
                        current: comp.amountLeft,
                      }));
                      const response = await fetch(
                        `${url}/api/v1/admin/update-inventory?multipleUpdates=true`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(updatedComponents),
                        }
                      );
                      const data = await response.json();
                      if (data.success) {
                        const updateOrder = await fetch(
                          `${url}/api/v1/admin/update-order-inventory`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              orderId: id,
                            }),
                          }
                        );
                        const updatedOrder = await updateOrder.json();
                        if (updatedOrder.success) {
                          Alert.alert(
                            "Success",
                            "Inventory updated successfully"
                          );
                          matchInventory();
                        }
                      } else {
                        Alert.alert(
                          "Error",
                          "Something went wrong while updating inventory"
                        );
                      }
                    } catch (error) {
                      Alert.alert(
                        "Error",
                        "Something went wrong while updating inventory"
                      );
                    }
                  },
                },
              ]
            );
          }}
          className="absolute top-0 right-0 bg-red-700 rounded-full w-10 h-10 flex justify-center items-center"
        >
          <MaterialIcons name="update" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default OrderDetailBom;
