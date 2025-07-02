export function bomCalculator(panelData) {
  const frontPanelsCount = {
    "2_F_BLK": 0,
    "4_F_BLK": 0,
    "6_F_BLK": 0,
    "8_F_BLK": 0,
    "12_F_BLK": 0,
    "2_F_GRY": 0,
    "4_F_GRY": 0,
    "6_F_GRY": 0,
    "8_F_GRY": 0,
    "12_F_GRY": 0,
    "2_F_GLD": 0,
    "4_F_GLD": 0,
    "6_F_GLD": 0,
    "8_F_GLD": 0,
    "12_F_GLD": 0,
  };

  const backPanel = {
    "2B": 0,
    "4B": 0,
    "6B": 0,
    "8B": 0,
    "12B": 0,
  };

  panelData.forEach((panel) => {
    const sizeKey = panel.panelSize;
    const colorKey = panel.panelGlass;
    const quantity = panel.quantity || 1;
    // Increment back panel based on panel size
    if (sizeKey === 2) {
      backPanel["2B"] += quantity;
    } else if (sizeKey === 4) {
      backPanel["4B"] += quantity;
    } else if (sizeKey === 6) {
      backPanel["6B"] += quantity;
    } else if (sizeKey === 8) {
      backPanel["8B"] += quantity;
    } else if (sizeKey === 12) {
      backPanel["12B"] += quantity;
    }
    // Increment front panels based on size and color
    if (colorKey === "#000") {
      frontPanelsCount[`${sizeKey}_F_BLK`] += quantity;
    } else if (colorKey === "#535150") {
      frontPanelsCount[`${sizeKey}_F_GRY`] += quantity;
    } else {
      frontPanelsCount[`${sizeKey}_F_GLD`] += quantity;
    }
  });

  return { frontPanelsCount, backPanel };
}
