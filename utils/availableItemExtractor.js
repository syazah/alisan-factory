export const extractAvailableItems = (data) => {
  let availableItems = [];

  Object.keys(data).forEach((category) => {
    if (typeof data[category] === "object") {
      Object.entries(data[category]).forEach(([key, value]) => {
        if (value > 0) {
          availableItems.push({ objectID: key, id: key, amount: value });
        }
      });
    } else if (typeof data[category] === "number" && data[category] > 0) {
      availableItems.push({
        objectID: category,
        id: category,
        amount: data[category],
      });
    }
  });

  return availableItems;
};
