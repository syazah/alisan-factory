export function CalculatePanelData(panelData) {
  const newPanelArray = [];

  panelData.forEach((panel) => {
    const panelObj = {
      panelName: panel.panelName || "Sales Panel",
      panelSize: panel.panelData.panelSize,
      panelType: panel.panelType || "Sales Panel",
      panelGlass: panel.panelData.panelGlass,
      panelFrame: panel.panelData.panelFrame,
      switches: 0,
      curtains: 0,
      fans: 0,
      dimmers: 0,
    };
    panel.panelData.panelVariant.forEach((variant) => {
      if (variant.switches > 0) {
        panelObj.switches += variant.switches;
      } else if (variant.curtains > 0) {
        panelObj.curtains += variant.curtains;
      } else if (variant.fans > 0) {
        panelObj.fans += variant.fans;
      } else if (variant.dimmers > 0) {
        panelObj.dimmers += variant.dimmers;
      }
    });
    if (panel.panelData.bigPanelVariant[0].length > 0) {
      panel.panelData.bigPanelVariant[0].forEach((variant) => {
        if (variant.switches > 0) {
          panelObj.switches += variant.switches;
        } else if (variant.curtains > 0) {
          panelObj.curtains += variant.curtains;
        } else if (variant.fans > 0) {
          panelObj.fans += variant.fans;
        } else if (variant.dimmers > 0) {
          panelObj.dimmers += variant.dimmers;
        }
      });
    }
    if (panel.panelData.bigPanelVariant[1].length > 0) {
      panel.panelData.bigPanelVariant[1].forEach((variant) => {
        if (variant.switches > 0) {
          panelObj.switches += variant.switches;
        } else if (variant.curtains > 0) {
          panelObj.curtains += variant.curtains;
        } else if (variant.fans > 0) {
          panelObj.fans += variant.fans;
        } else if (variant.dimmers > 0) {
          panelObj.dimmers += variant.dimmers;
        }
      });
    }
    newPanelArray.push(panelObj);
  });

  return newPanelArray;
}
