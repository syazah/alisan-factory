import { BomBoardCalculator } from "./boardCalculator";
import { bomCalculator } from "./bomCalculator";
import url from "../url";
import { CalculatePanelData } from "./panelDataCalculator";
async function getPrices() {
  try {
    const res = await fetch(`${url}/api/v1/admin/get-cost-sheet`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.success === true) {
      return data.costSheet;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
async function getQuotation(panelData) {
  try {
    //getting data
    const newPanelData = CalculatePanelData(panelData);
    const { frontPanelsCount, backPanel } = bomCalculator(newPanelData);
    const { touchSenseBoard, relayBoard, cSection, screws } =
      BomBoardCalculator(panelData);
    const quotationData = await getPrices();
    if (quotationData === null) {
      throw new Error("Could Not fetch Quotation Data");
    }
    //!CALCULATIONS
    const finalCost = [];
    //COLOR CALCULATION
    const frontPanels = Object.entries(frontPanelsCount).filter(
      ([key, value]) => value > 0
    );
    const Color = {};
    frontPanels.forEach(([key, value]) => {
      const suffix = key.slice(-3);
      if (["GRY", "BLK", "GLD"].includes(suffix)) {
        const currCost =
          suffix === "GRY"
            ? Number(quotationData.pc1.gray)
            : suffix === "BLK"
            ? Number(quotationData.pc1.black)
            : Number(quotationData.pc1.gold);
        Color[suffix] = (Number(Color[suffix]) || 0) + Number(value) * currCost;
      }
    });
    finalCost.push({ Color });
    //SIZE CALCULATION
    const moduleSize = Object.entries(backPanel).filter(
      ([key, value]) => value > 0
    );
    const Size = {};
    moduleSize.forEach(([key, value]) => {
      const suffix = key.slice(-3);
      if (["2B", "4B", "6B", "8B", "12B"].includes(suffix)) {
        const currCost =
          suffix === "2B"
            ? Number(quotationData.ms1.two)
            : suffix === "4B"
            ? Number(quotationData.ms1.four)
            : suffix === "6B"
            ? Number(quotationData.ms1.six)
            : suffix === "8B"
            ? Number(quotationData.ms1.eight)
            : Number(quotationData.ms1.twelve);
        Size[suffix] = (Number(Size[suffix]) || 0) + Number(value) * currCost;
      }
    });
    finalCost.push({ Size });

    // TOUCH SENSE BOARD
    const touchSense = Object.entries(touchSenseBoard).filter(
      ([key, value]) => value > 0
    );
    const TouchSense = {};
    touchSense.forEach(([key, value]) => {
      if (value > 0) {
        TouchSense[key] =
          (Number(TouchSense[key]) || 0) +
          Number(value) * Number(quotationData.tsb[key]);
      }
    });
    finalCost.push({ TouchSense });
    // Relay SENSE BOARD

    const relaySense = Object.entries(relayBoard).filter(
      ([key, value]) => value > 0
    );
    const RelaySense = {};
    relaySense.forEach(([key, value]) => {
      if (value > 0) {
        RelaySense[key] =
          (Number(RelaySense[key]) || 0) +
          Number(value) * Number(quotationData.pcb[key]);
      }
    });
    finalCost.push({ RelaySense });
    //CSECTION
    const cSec = Object.entries(cSection).filter(([key, value]) => value > 0);
    const CSection = {};
    cSec.forEach(([key, value]) => {
      if (value > 0) {
        CSection[key] =
          (Number(CSection[key]) || 0) +
          Number(value) * Number(quotationData.cse[key.toLowerCase()]);
      }
    });
    finalCost.push({ CSection });
    const ESP = { ESP: Number(quotationData.esp) };
    const PowerSource = { PowerSource: Number(quotationData.ps) };
    const Screws = { Screws: Number(quotationData.scr) * screws };
    finalCost.push({ ESP }, { PowerSource }, { Screws });
    return finalCost;
  } catch (error) {
    throw error;
  }
}

export default getQuotation;
