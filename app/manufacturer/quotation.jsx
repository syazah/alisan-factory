import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import getQuotation from "../../utils/quotationCalculator";
import { useRecoilValue } from "recoil";
import { orderDetailForBomGeneration } from "../../store/admin/atom";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import url from "../../url";
import { router } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { CalculatePanelData } from "../../utils/panelDataCalculator";
const Quotation = () => {
  const [editQuotation, setEditQuotation] = React.useState(false);
  const orderDetailForBOM = useRecoilValue(orderDetailForBomGeneration);
  const [finalCosts, setFinalCosts] = React.useState(null);
  const [salesCost, setSalesCost] = React.useState(0);
  const [finalSalesCost, setFinalSalesCost] = React.useState(null);
  const [updatingCost, setUpdatingCost] = React.useState(false);
  const quoteRef = useRef(null);

  async function getBriefQuotation(panelDataArray) {
    try {
      const quotations = await Promise.all(
        panelDataArray.map(async (item) => {
          const panel = item;
          const newPanelArray = [panel];
          const currQuote = await getQuotation(newPanelArray);
          const panelSimplified = CalculatePanelData(newPanelArray);
          return { ...panelSimplified[0], quote: currQuote };
        })
      );

      quotations.forEach((entry) => {
        let totalSum = 0;
        entry.quote.forEach((item) => {
          for (const values of Object.values(item)) {
            for (const num of Object.values(values)) {
              totalSum += num;
            }
          }
        });
        entry.cost = totalSum;
      });
      setFinalCosts(quotations);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong while calculating cost");
    }
  }
  React.useEffect(() => {
    getBriefQuotation(orderDetailForBOM.panelData);
  }, []);
  const downloadPDF = async () => {
    const htmlContent = generateHTML(); // Generate the HTML string
    const { uri } = await Print.printToFileAsync({ html: htmlContent }); // Convert to PDF

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing is not available on this device");
    }
  };
  const generateHTML = () => {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Quote</title>
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
                .info-row td {
                  border: none;
                  text-align: center;
                  font-size: 16px;
                  font-weight: bold;
                }
                .website-link {
                  text-align: center;
                  margin-top: 10px;
                  font-size: 14px;
                }
                .website-link a {
                  color: #007bff;
                  text-decoration: none;
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
              <table>
                <tr class="info-row">
                  <td colspan="5"><h1>Alisan Smart Homes</h1></td>
                </tr>
                <tr class="info-row">
                  <td colspan="5"><h2>Quotation</h2></td>
                </tr>
                <tr class="info-row">
                  <td colspan="5"><h3>Reference Number: ${
                    orderDetailForBOM.referenceNumber
                  }</h3></td>
                </tr>
                <tr class="info-row">
                  <td colspan="5" class="website-link">
                    <a href="https://www.alisan.io/">Visit our website</a>
                  </td>
                </tr>
              </table>
              <table>
                <thead>
                  <tr>
                    <th>SR No</th>
                    <th>Description</th>
                    <th>Module</th>
                    <th>Color</th>

                  </tr>
                </thead>
                <tbody>
                  ${finalCosts
                    .map(
                      (item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>Touch ${item.switches} Switches ${
                        item.curtains
                      } Curtains ${item.dimmers} Dimmers ${item.fans} Fans</td>
                      <td>${item.panelSize}M</td>
                      <td>${item.panelGlass}</td>

                    </tr>
                  `
                    )
                    .join("")}


                </tbody>
              </table>
            </body>
            </html>
          `;
  };

  if (finalCosts === null) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="justify-center items-center bg-zinc-800"
      >
        <ActivityIndicator color="red" />
      </SafeAreaView>
    );
  }
  let TotalCost = 0;
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="w-full h-full bg-zinc-200 relative justify-center items-center"
    >
      <View className="h-[8%] w-full p-2 justify-between items-center flex-row">
        <View>
          <View className="w-full justify-start flex-row items-center">
            <FontAwesome5 name="hashtag" size={20} color="maroon" />
            <Text className="text-xl font-semibold">
              {orderDetailForBOM.referenceNumber || orderDetailForBOM.name}
            </Text>
          </View>
          <Text className="text-red-800 text-sm">Quotation</Text>
        </View>
      </View>
      {/* MAIN QUOTATION  */}
      <View className="w-[100%] h-[90%] mt-2 border-t-[1px] border-black relative">
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <View ref={quoteRef}>
            {/* Table Header */}
            <View className="w-full flex-row justify-start items-center bg-red-800">
              <View className="w-[80px] h-[40px] justify-center items-center border-b-[1px] border-r-[1px] border-zinc-900 p-1">
                <Text className="text-white font-normal text-base">SR No</Text>
              </View>
              <View className="w-[250px] h-[40px] justify-center items-center border-b-[1px] border-r-[1px] border-zinc-900 p-1">
                <Text className="text-white font-normal text-base">
                  Description
                </Text>
              </View>
              <View className="w-[100px] h-[40px] justify-center items-center border-b-[1px] border-r-[1px] border-zinc-900 p-1">
                <Text className="text-white font-normal text-base">Module</Text>
              </View>
              <View className="w-[100px] h-[40px] justify-center items-center border-b-[1px] border-r-[1px] border-zinc-900 p-1">
                <Text className="text-white font-normal text-base">Color</Text>
              </View>
            </View>

            {/* Table Rows */}
            {finalCosts.map((item, index) => {
              TotalCost += item.cost;
              return (
                <View
                  key={index}
                  className={`w-full ${
                    index % 2 == 0 ? "bg-zinc-300" : ""
                  } flex-row justify-start items-center`}
                >
                  <View className="w-[80px] h-[40px] border-b-[1px] border-r-[1px] border-zinc-900 p-1">
                    <Text className="text-sm ">{index + 1}</Text>
                  </View>
                  <View className="w-[250px] h-[40px] border-b-[1px] border-r-[1px] border-zinc-900 p-1">
                    <Text className="text-[11px]">
                      Touch {item.switches} Switches {item.curtains} Curtains{" "}
                      {item.dimmers} Dimmers {item.fans} Fans
                    </Text>
                  </View>
                  <View className="w-[100px] h-[40px] border-b-[1px] border-r-[1px] border-zinc-900 p-1">
                    <Text className="text-sm ">{item.panelSize}M</Text>
                  </View>
                  <View className="w-[100px] h-[40px] border-b-[1px] border-r-[1px] border-zinc-900 p-1">
                    <Text className="text-sm ">{item.panelGlass}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* DOWNLOAD PDF  */}
      <TouchableOpacity
        onPress={downloadPDF}
        className="z-30 w-12 h-12 bg-red-800 rounded-full bottom-2 right-2 absolute justify-center items-center"
      >
        <Feather name="download" size={26} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Quotation;
