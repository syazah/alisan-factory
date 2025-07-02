export function BomBoardCalculator(panelData) {
  const touchSenseBoard = {
    "2_SEN_S2": 0,
    "2_SEN_S4": 0,
    "2_SEN_F1": 0,
    "2_SEN_F1": 0,
    "2_SEN_C1": 0,
    "2_SEN_C2": 0,
    "2_SEN_B": 0,
    "4_SEN_S4F1": 0,
    "4_SEN_S2F1": 0,
    "4_SEN_S6": 0,
    "4_SEN_S8": 0,
    "4_SEN_F2": 0,
    "6_SEN_S4F2": 0,
    "6_SEN_S6F1": 0,
    "6_SEN_S8F1": 0,
    "6_SEN_S10": 0,
  };
  const relayBoard = {
    "2_REL_S2": 0,
    "2_REL_S4": 0,
    "2_REL_F1": 0,
    "2_REL_D1": 0,
    "2_REL_C1": 0,
    "2_REL_C2": 0,
    "2_REL_B": 0,
    "4_REL_S4F1": 0,
    "4_REL_S4D1": 0,
    "4_REL_S2F1": 0,
    "4_REL_S6": 0,
    "4_REL_S8": 0,
    "4_REL_F2": 0,
    "4_REL_S4F2": 0,
    "4_REL_S4D2": 0,
    "6_REL_S6F1": 0,
    "6_REL_S4F1D1": 0,
    "6_REL_S8D1": 0,
    "6_REL_S10": 0,
    "6_REL_S8F1": 0,
  };
  const cSection = {
    "1C": 0,
    "2C": 0,
    "3C": 0,
  };
  const glassPart = {
    "2_GN_BLK": 0,
    "2_G1_BLK": 0,
    "4_GN_BLK": 0,
    "4_G1_BLK": 0,
    "6_GN_BLK": 0,
    "6_G1_BLK": 0,
    "6_G2_BLK": 0,
    "8_GN_BLK": 0,
    "8_G1_BLK": 0,
    "12_GN_BLK": 0,
    "12_G2_BLK": 0,
    "2_GN_GRY": 0,
    "2_G1_GRY": 0,
    "4_GN_GRY": 0,
    "4_G1_GRY": 0,
    "6_GN_GRY": 0,
    "6_G1_GRY": 0,
    "6_G2_GRY": 0,
    "8_GN_GRY": 0,
    "8_G1_GRY": 0,
    "12_GN_GRY": 0,
    "12_G2_GRY": 0,
    "2_GN_GLD": 0,
    "2_G1_GLD": 0,
    "4_GN_GLD": 0,
    "4_G1_GLD": 0,
    "6_GN_GLD": 0,
    "6_G1_GLD": 0,
    "6_G2_GLD": 0,
    "8_GN_GLD": 0,
    "8_G1_GLD": 0,
    "12_GN_GLD": 0,
    "12_G2_GLD": 0,
  };

  let screws = 0;
  panelData.forEach((panel) => {
    const quantity = panel.quantity || 1;
    panel.panelData.panelVariant.forEach((variant) => {
      if (variant.switches === 8 && variant.fans === 1) {
        touchSenseBoard["6_SEN_S8F1"] += quantity;
        cSection["3C"] += quantity;
        screws += 8 * quantity;
        relayBoard["6_REL_S8F1"] += quantity;
      } else if (variant.switches === 8 && variant.dimmers === 1) {
        touchSenseBoard["6_SEN_S8F1"] += quantity;
        cSection["3C"] += quantity;
        screws += 8 * quantity;
        relayBoard["6_REL_S8D1"] += quantity;
      } else if (variant.switches === 6 && variant.fans === 1) {
        touchSenseBoard["6_SEN_S6F1"] += quantity;
        cSection["3C"] += quantity;
        screws += 8 * quantity;
        relayBoard["6_REL_S6F1"] += quantity;
      } else if (
        variant.switches === 4 &&
        variant.fans === 1 &&
        variant.dimmer === 1
      ) {
        touchSenseBoard["6_SEN_S4F2"] += quantity;
        cSection["3C"] += quantity;
        screws += 8 * quantity;
        relayBoard["6_REL_S4F1D1"] += quantity;
      } else if (variant.switches === 4 && variant.dimmer === 2) {
        touchSenseBoard["6_SEN_S4F2"] += quantity;
        cSection["3C"] += quantity;
        screws += 8 * quantity;
        relayBoard["4_REL_S4D2"] += quantity;
      } else if (variant.switches === 4 && variant.fans === 2) {
        touchSenseBoard["6_SEN_S4F2"] += quantity;
        cSection["3C"] += quantity;
        screws += 8 * quantity;
        relayBoard["4_REL_S4F2"] += quantity;
      } else if (variant.dimmers === 2) {
        touchSenseBoard["4_SEN_F2"] += quantity;
        cSection["2C"] += quantity;
        screws += 6 * quantity;
        relayBoard["4_REL_F2"] += quantity;
      } else if (variant.switches === 6) {
        touchSenseBoard["4_SEN_S6"] += quantity;
        cSection["2C"] += quantity;
        screws += 6 * quantity;
        relayBoard["4_REL_S6"] += quantity;
      } else if (variant.switches === 2 && variant.fans === 1) {
        touchSenseBoard["4_SEN_S2F1"] += quantity;
        cSection["2C"] += quantity;
        screws += 6 * quantity;
        relayBoard["4_REL_S2F1"] += quantity;
      } else if (variant.switches === 4 && variant.dimmers === 1) {
        touchSenseBoard["4_SEN_S4F1"] += quantity;
        cSection["2C"] += quantity;
        screws += 6 * quantity;
        relayBoard["4_REL_S4F1"] += quantity;
      } else if (variant.switches === 4 && variant.fans === 1) {
        touchSenseBoard["4_SEN_S4F1"] += quantity;
        cSection["2C"] += quantity;
        screws += 6 * quantity;
        relayBoard["4_REL_S4F1"] += quantity;
      } else if (variant.bells === 1) {
        touchSenseBoard["2_SEN_B"] += quantity;
        cSection["1C"] += quantity;
        screws += 4 * quantity;
        relayBoard["2_REL_B"] += quantity;
      } else if (variant.curtains === 2) {
        touchSenseBoard["2_SEN_C2"] += quantity;
        cSection["1C"] += quantity;
        screws += 4 * quantity;
        relayBoard["2_REL_C2"] += quantity;
      } else if (variant.curtains === 1) {
        touchSenseBoard["2_SEN_C1"] += quantity;
        cSection["1C"] += quantity;
        screws += 4 * quantity;
        relayBoard["2_REL_C1"] += quantity;
      } else if (variant.dimmers === 1) {
        touchSenseBoard["2_SEN_F1"] += quantity;
        cSection["1C"] += quantity;
        screws += 4 * quantity;
        relayBoard["2_REL_F1"] += quantity;
      } else if (variant.fans === 1) {
        touchSenseBoard["2_SEN_F1"] += quantity;
        cSection["1C"] += quantity;
        screws += 4 * quantity;
        relayBoard["2_REL_F1"] += quantity;
      } else if (variant.switches === 4) {
        touchSenseBoard["2_SEN_S4"] += quantity;
        cSection["1C"] += quantity;
        screws += 4 * quantity;
        relayBoard["2_REL_S4"] += quantity;
      } else if (variant.switches === 2) {
        touchSenseBoard["2_SEN_S2"] += quantity;
        cSection["1C"] += quantity;
        screws += 4 * quantity;
        relayBoard["2_REL_S2"] += quantity;
      }
    });
  });

  panelData.forEach((panel) => {
    const quantity = panel.quantity || 1;
    if (panel.panelData.bigPanelVariant[0].length > 0) {
      panel.panelData.bigPanelVariant[0].forEach((variant) => {
        if (variant.switches === 8 && variant.fans === 1) {
          touchSenseBoard["6_SEN_S8F1"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["6_REL_S8F1"] += quantity;
        } else if (variant.switches === 8 && variant.dimmers === 1) {
          touchSenseBoard["6_SEN_S8F1"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["6_REL_S8D1"] += quantity;
        } else if (variant.switches === 6 && variant.fans === 1) {
          touchSenseBoard["6_SEN_S6F1"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["6_REL_S6F1"] += quantity;
        } else if (
          variant.switches === 4 &&
          variant.fans === 1 &&
          variant.dimmer === 1
        ) {
          touchSenseBoard["6_SEN_S4F2"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["6_REL_S4F1D1"] += quantity;
        } else if (variant.switches === 4 && variant.dimmer === 2) {
          touchSenseBoard["6_SEN_S4F2"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["4_REL_S4D2"] += quantity;
        } else if (variant.switches === 4 && variant.fans === 2) {
          touchSenseBoard["6_SEN_S4F2"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["4_REL_S4F2"] += quantity;
        } else if (variant.dimmers === 2) {
          touchSenseBoard["4_SEN_F2"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_F2"] += quantity;
        } else if (variant.switches === 6) {
          touchSenseBoard["4_SEN_S6"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_S6"] += quantity;
        } else if (variant.switches === 2 && variant.fans === 1) {
          touchSenseBoard["4_SEN_S2F1"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_S2F1"] += quantity;
        } else if (variant.switches === 4 && variant.dimmers === 1) {
          touchSenseBoard["4_SEN_S4F1"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_S4F1"] += quantity;
        } else if (variant.switches === 4 && variant.fans === 1) {
          touchSenseBoard["4_SEN_S4F1"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_S4F1"] += quantity;
        } else if (variant.bells === 1) {
          touchSenseBoard["2_SEN_B"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_B"] += quantity;
        } else if (variant.curtains === 2) {
          touchSenseBoard["2_SEN_C2"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_C2"] += quantity;
        } else if (variant.curtains === 1) {
          touchSenseBoard["2_SEN_C1"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_C1"] += quantity;
        } else if (variant.dimmers === 1) {
          touchSenseBoard["2_SEN_F1"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_F1"] += quantity;
        } else if (variant.fans === 1) {
          touchSenseBoard["2_SEN_F1"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_F1"] += quantity;
        } else if (variant.switches === 4) {
          touchSenseBoard["2_SEN_S4"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_S4"] += quantity;
        } else if (variant.switches === 2) {
          touchSenseBoard["2_SEN_S2"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_S2"] += quantity;
        }
      });
    }
    if (panel.panelData.bigPanelVariant[1].length > 0) {
      const quantity = panel.quantity || 1;
      panel.panelData.bigPanelVariant[1].forEach((variant) => {
        if (variant.switches === 8 && variant.fans === 1) {
          touchSenseBoard["6_SEN_S8F1"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["6_REL_S8F1"] += quantity;
        } else if (variant.switches === 8 && variant.dimmers === 1) {
          touchSenseBoard["6_SEN_S8F1"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["6_REL_S8D1"] += quantity;
        } else if (variant.switches === 6 && variant.fans === 1) {
          touchSenseBoard["6_SEN_S6F1"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["6_REL_S6F1"] += quantity;
        } else if (
          variant.switches === 4 &&
          variant.fans === 1 &&
          variant.dimmer === 1
        ) {
          touchSenseBoard["6_SEN_S4F2"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["6_REL_S4F1D1"] += quantity;
        } else if (variant.switches === 4 && variant.dimmer === 2) {
          touchSenseBoard["6_SEN_S4F2"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["4_REL_S4D2"] += quantity;
        } else if (variant.switches === 4 && variant.fans === 2) {
          touchSenseBoard["6_SEN_S4F2"] += quantity;
          cSection["3C"] += quantity;
          screws += 8 * quantity;
          relayBoard["4_REL_S4F2"] += quantity;
        } else if (variant.dimmers === 2) {
          touchSenseBoard["4_SEN_F2"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_F2"] += quantity;
        } else if (variant.switches === 6) {
          touchSenseBoard["4_SEN_S6"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_S6"] += quantity;
        } else if (variant.switches === 2 && variant.fans === 1) {
          touchSenseBoard["4_SEN_S2F1"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_S2F1"] += quantity;
        } else if (variant.switches === 4 && variant.dimmers === 1) {
          touchSenseBoard["4_SEN_S4F1"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_S4F1"] += quantity;
        } else if (variant.switches === 4 && variant.fans === 1) {
          touchSenseBoard["4_SEN_S4F1"] += quantity;
          cSection["2C"] += quantity;
          screws += 6 * quantity;
          relayBoard["4_REL_S4F1"] += quantity;
        } else if (variant.bells === 1) {
          touchSenseBoard["2_SEN_B"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_B"] += quantity;
        } else if (variant.curtains === 2) {
          touchSenseBoard["2_SEN_C2"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_C2"] += quantity;
        } else if (variant.curtains === 1) {
          touchSenseBoard["2_SEN_C1"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_C1"] += quantity;
        } else if (variant.dimmers === 1) {
          touchSenseBoard["2_SEN_F1"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_F1"] += quantity;
        } else if (variant.fans === 1) {
          touchSenseBoard["2_SEN_F1"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_F1"] += quantity;
        } else if (variant.switches === 4) {
          touchSenseBoard["2_SEN_S4"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_S4"] += quantity;
        } else if (variant.switches === 2) {
          touchSenseBoard["2_SEN_S2"] += quantity;
          cSection["1C"] += quantity;
          screws += 4 * quantity;
          relayBoard["2_REL_S2"] += quantity;
        }
      });
    }
  });

  //GLASS SOCKET
  panelData.forEach((panel) => {
    const quantity = panel.quantity || 1;
    panel.panelData.panelVariant.forEach((variant) => {
      if (panel.panelData.panelSize === 2) {
        if (panel.panelData.panelGlass === "#000") {
          if (variant === "ext") {
            glassPart["2_G1_BLK"] += quantity;
          } else {
            glassPart["2_GN_BLK"] += quantity;
          }
        } else if (panel.panelData.panelGlass === "#535150") {
          if (variant === "ext") {
            glassPart["2_G1_GRY"] += quantity;
          } else {
            glassPart["2_GN_GRY"] += quantity;
          }
        } else {
          if (variant === "ext") {
            glassPart["2_G1_GLD"] += quantity;
          } else {
            glassPart["2_GN_GLD"] += quantity;
          }
        }
      }
      if (panel.panelData.panelSize === 4) {
        if (panel.panelData.panelGlass === "#000") {
          if (variant === "ext") {
            glassPart["4_G1_BLK"] += quantity;
          } else {
            glassPart["4_GN_BLK"] += quantity;
          }
        } else if (panel.panelData.panelGlass === "#535150") {
          if (variant === "ext") {
            glassPart["4_G1_GRY"] += quantity;
          } else {
            glassPart["4_GN_GRY"] += quantity;
          }
        } else {
          if (variant === "ext") {
            glassPart["4_G1_GLD"] += quantity;
          } else {
            glassPart["4_GN_GLD"] += quantity;
          }
        }
      }
      if (panel.panelData.panelSize === 6) {
        let extCount = 0;
        if (panel.panelData.panelGlass === "#000") {
          if (variant === "ext") {
            extCount += 1;
            if (extCount == 1) {
              glassPart["6_G1_BLK"] += quantity;
            } else {
              glassPart["6_G2_BLK"] += quantity;
              glassPart["6_G1_BLK"] -= quantity;
            }
          } else {
            glassPart["6_GN_BLK"] += quantity;
          }
        } else if (panel.panelData.panelGlass === "#535150") {
          if (variant === "ext") {
            extCount += 1;
            if (extCount == 1) {
              glassPart["6_G1_GRY"] += quantity;
            } else {
              glassPart["6_G2_GRY"] -= quantity;
              glassPart["6_G1_GRY"] += quantity;
            }
          } else {
            glassPart["6_GN_GRY"] += quantity;
          }
        } else {
          if (variant === "ext") {
            extCount += 1;
            if (extCount == 1) {
              glassPart["6_G1_GLD"] += quantity;
            } else {
              glassPart["6_G2_GLD"] -= quantity;
              glassPart["6_G1_GLD"] += quantity;
            }
          } else {
            glassPart["6_GN_GLD"] += quantity;
          }
        }
      }
      if (panel.panelData.panelSize === 8) {
        if (panel.panelData.panelGlass === "#000") {
          if (variant === "ext") {
            glassPart["8_G1_BLK"] += quantity;
          } else {
            glassPart["8_GN_BLK"] += quantity;
          }
        } else if (panel.panelData.panelGlass === "#535150") {
          if (variant === "ext") {
            glassPart["8_G1_GRY"] += quantity;
          } else {
            glassPart["8_GN_GRY"] += quantity;
          }
        } else {
          if (variant === "ext") {
            glassPart["8_G1_GLD"] += quantity;
          } else {
            glassPart["8_GN_GLD"] += quantity;
          }
        }
      }
    });
  });

  return { touchSenseBoard, relayBoard, cSection, screws, glassPart };
}
