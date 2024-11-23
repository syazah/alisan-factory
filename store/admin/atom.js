import { atom } from "recoil";

export const orderDetailForBomGeneration = atom({
  key: "orderDetailForBomGenerations",
  default: {},
});
export const SalesCustomer = atom({
  key: "salesCustomerBuild",
  default: {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    panelData: [],
  },
});
export const CustomPanelBuilder = atom({
  key: "customPanelBuilderForSales",
  default: {
    panelName: "",
    panelSize: 2,
    accessories: {},
    panelVariant: [],
    bigPanelVariant: [[], []],
    panelGlass: "#000",
    panelFrame: "#000",
    accessoryColor: "#000",
    automationRequired: false,
  },
});
