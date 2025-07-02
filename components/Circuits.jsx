import { View, Text } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

const Circuits = ({ circuitType, currentValue, setCurrentValue }) => {
  return (
    <>
      {circuitType === 2 ? (
        <View className="p-2 bg-red-900 rounded-xl mt-2">
          <Text className="text-white">{circuitType} Module</Text>
          <Picker
            mode="dialog"
            value={currentValue}
            onValueChange={(value) => {
              setCurrentValue(value);
            }}
            dropdownIconColor="white"
            style={{
              width: "100%",
              color: "white",
            }}
          >
            <Picker.Item value={null} label="N/A" />
            <Picker.Item
              value={{
                cost: 2,
                variant: {
                  switches: 2,
                },
              }}
              label="2 Switches"
            />
            <Picker.Item
              value={{
                cost: 2,
                variant: {
                  switches: 4,
                },
              }}
              label="4 Switches"
            />
            <Picker.Item
              value={{
                cost: 2,
                variant: {
                  curtains: 1,
                },
              }}
              label="1 Curtain"
            />
            <Picker.Item
              value={{
                cost: 2,
                variant: {
                  curtains: 2,
                },
              }}
              label="2 Curtains"
            />
            <Picker.Item
              value={{
                cost: 2,
                variant: {
                  fans: 1,
                },
              }}
              label="1 Fan"
            />
          </Picker>
        </View>
      ) : circuitType === 4 ? (
        <View className="p-2 bg-red-900 rounded-xl mt-2">
          <Text className="text-white">{circuitType} Module</Text>
          <Picker
            mode="dialog"
            value={currentValue}
            onValueChange={(value) => {
              setCurrentValue(value);
            }}
            dropdownIconColor="white"
            style={{
              width: "100%",
              color: "white",
            }}
          >
            <Picker.Item value={null} label="N/A" />
            {[
              {
                cost: 4,
                label: "4 Switches 1 Fans",
                variant: {
                  switches: 4,
                  fans: 1,
                },
              },
              {
                cost: 4,
                variant: {
                  switches: 4,
                  dimmers: 1,
                },
                label: "4 Switches 1 Dimmers",
              },
              {
                cost: 4,
                variant: {
                  switches: 2,
                  fans: 1,
                },
                label: "2 Switches 1 Fans",
              },
              {
                cost: 4,
                variant: {
                  switches: 6,
                },
                label: "6 Switches",
              },
              {
                cost: 4,
                variant: {
                  switches: 8,
                },
                label: "8 Switches",
              },
              {
                cost: 4,
                variant: {
                  dimmers: 2,
                },
                label: "2 Dimmers",
              },
            ].map((item, index) => (
              <Picker.Item value={item} key={index} label={item.label} />
            ))}
          </Picker>
        </View>
      ) : (
        <View className="p-2 bg-red-900 rounded-xl mt-2">
          <Text className="text-white">{circuitType} Module</Text>
          <Picker
            mode="dialog"
            value={currentValue}
            onValueChange={(value) => {
              setCurrentValue(value);
            }}
            dropdownIconColor="white"
            style={{
              width: "100%",
              color: "white",
            }}
          >
            <Picker.Item value={null} label="N/A" />
            {[
              {
                cost: 6,
                variant: {
                  switches: 4,
                  fans: 2,
                },
                label: "2 Switches 2 Fans",
              },
              {
                cost: 6,
                variant: {
                  switches: 4,
                  dimmers: 2,
                },
                label: "4 Switches 2 Dimmers",
              },
              {
                cost: 6,
                variant: {
                  switches: 6,
                  fans: 1,
                },
                label: "6 Switches 1 Fan",
              },
              {
                cost: 6,
                variant: {
                  switches: 6,
                  dimmers: 1,
                },
                label: "6 Switches 1 Dimmer",
              },
              {
                cost: 6,
                variant: {
                  switches: 10,
                },
                label: "10 Switches",
              },
              {
                cost: 6,
                variant: {
                  switches: 8,
                  fans: 1,
                },
                label: "8 Switches 1 Fan",
              },
              {
                cost: 6,
                variant: {
                  switches: 4,
                  fans: 2,
                },
                label: "4 Switches 2 Fan",
              },
            ].map((item, index) => (
              <Picker.Item value={item} key={index} label={item.label} />
            ))}
          </Picker>
        </View>
      )}
    </>
  );
};

export default Circuits;
