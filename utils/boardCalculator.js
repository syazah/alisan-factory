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
    panel.panelData.panelVariant.forEach((variant) => {
      if (variant.switches === 8 && variant.fans === 1) {
        touchSenseBoard["6_SEN_S8F1"] += 1;
        cSection["3C"] += 1;
        screws += 8;
        relayBoard["6_REL_S8F1"] += 1;
      } else if (variant.switches === 8 && variant.dimmers === 1) {
        touchSenseBoard["6_SEN_S8F1"] += 1;
        cSection["3C"] += 1;
        screws += 8;
        relayBoard["6_REL_S8D1"] += 1;
      } else if (variant.switches === 6 && variant.fans === 1) {
        touchSenseBoard["6_SEN_S6F1"] += 1;
        cSection["3C"] += 1;
        screws += 8;
        relayBoard["6_REL_S6F1"] += 1;
      } else if (
        variant.switches === 4 &&
        variant.fans === 1 &&
        variant.dimmer === 1
      ) {
        touchSenseBoard["6_SEN_S4F2"] += 1;
        cSection["3C"] += 1;
        screws += 8;
        relayBoard["6_REL_S4F1D1"] += 1;
      } else if (variant.switches === 4 && variant.dimmer === 2) {
        touchSenseBoard["6_SEN_S4F2"] += 1;
        cSection["3C"] += 1;
        screws += 8;
        relayBoard["4_REL_S4D2"] += 1;
      } else if (variant.switches === 4 && variant.fans === 2) {
        touchSenseBoard["6_SEN_S4F2"] += 1;
        cSection["3C"] += 1;
        screws += 8;
        relayBoard["4_REL_S4F2"] += 1;
      } else if (variant.dimmers === 2) {
        touchSenseBoard["4_SEN_F2"] += 1;
        cSection["2C"] += 1;
        screws += 6;
        relayBoard["4_REL_F2"] += 1;
      } else if (variant.switches === 6) {
        touchSenseBoard["4_SEN_S6"] += 1;
        cSection["2C"] += 1;
        screws += 6;
        relayBoard["4_REL_S6"] += 1;
      } else if (variant.switches === 2 && variant.fans === 1) {
        touchSenseBoard["4_SEN_S2F1"] += 1;
        cSection["2C"] += 1;
        screws += 6;
        relayBoard["4_REL_S2F1"] += 1;
      } else if (variant.switches === 4 && variant.dimmers === 1) {
        touchSenseBoard["4_SEN_S4F1"] += 1;
        cSection["2C"] += 1;
        screws += 6;
        relayBoard["4_REL_S4F1"] += 1;
      } else if (variant.switches === 4 && variant.fans === 1) {
        touchSenseBoard["4_SEN_S4F1"] += 1;
        cSection["2C"] += 1;
        screws += 6;
        relayBoard["4_REL_S4F1"] += 1;
      } else if (variant.bells === 1) {
        touchSenseBoard["2_SEN_B"] += 1;
        cSection["1C"] += 1;
        screws += 4;
        relayBoard["2_REL_B"] += 1;
      } else if (variant.curtains === 2) {
        touchSenseBoard["2_SEN_C2"] += 1;
        cSection["1C"] += 1;
        screws += 4;
        relayBoard["2_REL_C2"] += 1;
      } else if (variant.curtains === 1) {
        touchSenseBoard["2_SEN_C1"] += 1;
        cSection["1C"] += 1;
        screws += 4;
        relayBoard["2_REL_C1"] += 1;
      } else if (variant.dimmers === 1) {
        touchSenseBoard["2_SEN_F1"] += 1;
        cSection["1C"] += 1;
        screws += 4;
        relayBoard["2_REL_F1"] += 1;
      } else if (variant.fans === 1) {
        touchSenseBoard["2_SEN_F1"] += 1;
        cSection["1C"] += 1;
        screws += 4;
        relayBoard["2_REL_F1"] += 1;
      } else if (variant.switches === 4) {
        touchSenseBoard["2_SEN_S4"] += 1;
        cSection["1C"] += 1;
        screws += 4;
        relayBoard["2_REL_S4"] += 1;
      } else if (variant.switches === 2) {
        touchSenseBoard["2_SEN_S2"] += 1;
        cSection["1C"] += 1;
        screws += 4;
        relayBoard["2_REL_S2"] += 1;
      }
    });
  });

  panelData.forEach((panel) => {
    if (panel.panelData.bigPanelVariant[0].length > 0) {
      panel.panelData.bigPanelVariant[0].forEach((variant) => {
        if (variant.switches === 8 && variant.fans === 1) {
          touchSenseBoard["6_SEN_S8F1"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["6_REL_S8F1"] += 1;
        } else if (variant.switches === 8 && variant.dimmers === 1) {
          touchSenseBoard["6_SEN_S8F1"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["6_REL_S8D1"] += 1;
        } else if (variant.switches === 6 && variant.fans === 1) {
          touchSenseBoard["6_SEN_S6F1"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["6_REL_S6F1"] += 1;
        } else if (
          variant.switches === 4 &&
          variant.fans === 1 &&
          variant.dimmer === 1
        ) {
          touchSenseBoard["6_SEN_S4F2"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["6_REL_S4F1D1"] += 1;
        } else if (variant.switches === 4 && variant.dimmer === 2) {
          touchSenseBoard["6_SEN_S4F2"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["4_REL_S4D2"] += 1;
        } else if (variant.switches === 4 && variant.fans === 2) {
          touchSenseBoard["6_SEN_S4F2"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["4_REL_S4F2"] += 1;
        } else if (variant.dimmers === 2) {
          touchSenseBoard["4_SEN_F2"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_F2"] += 1;
        } else if (variant.switches === 6) {
          touchSenseBoard["4_SEN_S6"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_S6"] += 1;
        } else if (variant.switches === 2 && variant.fans === 1) {
          touchSenseBoard["4_SEN_S2F1"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_S2F1"] += 1;
        } else if (variant.switches === 4 && variant.dimmers === 1) {
          touchSenseBoard["4_SEN_S4F1"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_S4F1"] += 1;
        } else if (variant.switches === 4 && variant.fans === 1) {
          touchSenseBoard["4_SEN_S4F1"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_S4F1"] += 1;
        } else if (variant.bells === 1) {
          touchSenseBoard["2_SEN_B"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_B"] += 1;
        } else if (variant.curtains === 2) {
          touchSenseBoard["2_SEN_C2"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_C2"] += 1;
        } else if (variant.curtains === 1) {
          touchSenseBoard["2_SEN_C1"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_C1"] += 1;
        } else if (variant.dimmers === 1) {
          touchSenseBoard["2_SEN_F1"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_F1"] += 1;
        } else if (variant.fans === 1) {
          touchSenseBoard["2_SEN_F1"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_F1"] += 1;
        } else if (variant.switches === 4) {
          touchSenseBoard["2_SEN_S4"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_S4"] += 1;
        } else if (variant.switches === 2) {
          touchSenseBoard["2_SEN_S2"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_S2"] += 1;
        }
      });
    }
    if (panel.panelData.bigPanelVariant[1].length > 0) {
      panel.panelData.bigPanelVariant[1].forEach((variant) => {
        if (variant.switches === 8 && variant.fans === 1) {
          touchSenseBoard["6_SEN_S8F1"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["6_REL_S8F1"] += 1;
        } else if (variant.switches === 8 && variant.dimmers === 1) {
          touchSenseBoard["6_SEN_S8F1"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["6_REL_S8D1"] += 1;
        } else if (variant.switches === 6 && variant.fans === 1) {
          touchSenseBoard["6_SEN_S6F1"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["6_REL_S6F1"] += 1;
        } else if (
          variant.switches === 4 &&
          variant.fans === 1 &&
          variant.dimmer === 1
        ) {
          touchSenseBoard["6_SEN_S4F2"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["6_REL_S4F1D1"] += 1;
        } else if (variant.switches === 4 && variant.dimmer === 2) {
          touchSenseBoard["6_SEN_S4F2"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["4_REL_S4D2"] += 1;
        } else if (variant.switches === 4 && variant.fans === 2) {
          touchSenseBoard["6_SEN_S4F2"] += 1;
          cSection["3C"] += 1;
          screws += 8;
          relayBoard["4_REL_S4F2"] += 1;
        } else if (variant.dimmers === 2) {
          touchSenseBoard["4_SEN_F2"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_F2"] += 1;
        } else if (variant.switches === 6) {
          touchSenseBoard["4_SEN_S6"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_S6"] += 1;
        } else if (variant.switches === 2 && variant.fans === 1) {
          touchSenseBoard["4_SEN_S2F1"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_S2F1"] += 1;
        } else if (variant.switches === 4 && variant.dimmers === 1) {
          touchSenseBoard["4_SEN_S4F1"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_S4F1"] += 1;
        } else if (variant.switches === 4 && variant.fans === 1) {
          touchSenseBoard["4_SEN_S4F1"] += 1;
          cSection["2C"] += 1;
          screws += 6;
          relayBoard["4_REL_S4F1"] += 1;
        } else if (variant.bells === 1) {
          touchSenseBoard["2_SEN_B"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_B"] += 1;
        } else if (variant.curtains === 2) {
          touchSenseBoard["2_SEN_C2"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_C2"] += 1;
        } else if (variant.curtains === 1) {
          touchSenseBoard["2_SEN_C1"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_C1"] += 1;
        } else if (variant.dimmers === 1) {
          touchSenseBoard["2_SEN_F1"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_F1"] += 1;
        } else if (variant.fans === 1) {
          touchSenseBoard["2_SEN_F1"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_F1"] += 1;
        } else if (variant.switches === 4) {
          touchSenseBoard["2_SEN_S4"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_S4"] += 1;
        } else if (variant.switches === 2) {
          touchSenseBoard["2_SEN_S2"] += 1;
          cSection["1C"] += 1;
          screws += 4;
          relayBoard["2_REL_S2"] += 1;
        }
      });
    }
  });

  //GLASS SOCKET
  panelData.forEach((panel) => {
    panel.panelData.panelVariant.forEach((variant) => {
      if (panel.panelData.panelSize === 2) {
        if (panel.panelData.panelGlass === "#000") {
          if (variant === "ext") {
            glassPart["2_G1_BLK"] += 1;
          } else {
            glassPart["2_GN_BLK"] += 1;
          }
        } else if (panel.panelData.panelGlass === "#535150") {
          if (variant === "ext") {
            glassPart["2_G1_GRY"] += 1;
          } else {
            glassPart["2_GN_GRY"] += 1;
          }
        } else {
          if (variant === "ext") {
            glassPart["2_G1_GLD"] += 1;
          } else {
            glassPart["2_GN_GLD"] += 1;
          }
        }
      }
      if (panel.panelData.panelSize === 4) {
        if (panel.panelData.panelGlass === "#000") {
          if (variant === "ext") {
            glassPart["4_G1_BLK"] += 1;
          } else {
            glassPart["4_GN_BLK"] += 1;
          }
        } else if (panel.panelData.panelGlass === "#535150") {
          if (variant === "ext") {
            glassPart["4_G1_GRY"] += 1;
          } else {
            glassPart["4_GN_GRY"] += 1;
          }
        } else {
          if (variant === "ext") {
            glassPart["4_G1_GLD"] += 1;
          } else {
            glassPart["4_GN_GLD"] += 1;
          }
        }
      }
      if (panel.panelData.panelSize === 6) {
        let extCount = 0;
        if (panel.panelData.panelGlass === "#000") {
          if (variant === "ext") {
            extCount += 1;
            if (extCount == 1) {
              glassPart["6_G1_BLK"] += 1;
            } else {
              glassPart["6_G2_BLK"] += 1;
              glassPart["6_G1_BLK"] -= 1;
            }
          } else {
            glassPart["6_GN_BLK"] += 1;
          }
        } else if (panel.panelData.panelGlass === "#535150") {
          if (variant === "ext") {
            extCount += 1;
            if (extCount == 1) {
              glassPart["6_G1_GRY"] += 1;
            } else {
              glassPart["6_G2_GRY"] -= 1;
              glassPart["6_G1_GRY"] += 1;
            }
          } else {
            glassPart["6_GN_GRY"] += 1;
          }
        } else {
          if (variant === "ext") {
            extCount += 1;
            if (extCount == 1) {
              glassPart["6_G1_GLD"] += 1;
            } else {
              glassPart["6_G2_GLD"] -= 1;
              glassPart["6_G1_GLD"] += 1;
            }
          } else {
            glassPart["6_GN_GLD"] += 1;
          }
        }
      }
      if (panel.panelData.panelSize === 8) {
        if (panel.panelData.panelGlass === "#000") {
          if (variant === "ext") {
            glassPart["8_G1_BLK"] += 1;
          } else {
            glassPart["8_GN_BLK"] += 1;
          }
        } else if (panel.panelData.panelGlass === "#535150") {
          if (variant === "ext") {
            glassPart["8_G1_GRY"] += 1;
          } else {
            glassPart["8_GN_GRY"] += 1;
          }
        } else {
          if (variant === "ext") {
            glassPart["8_G1_GLD"] += 1;
          } else {
            glassPart["8_GN_GLD"] += 1;
          }
        }
      }
    });
  });

  return { touchSenseBoard, relayBoard, cSection, screws, glassPart };
}
