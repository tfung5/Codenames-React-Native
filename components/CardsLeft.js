import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export default ({ redLeft, blueLeft, canEnd }) => {
  const hidden = (canEnd) => {
    if (canEnd === false) {
      return null;
    }
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          borderColor: "red",
          borderRadius: 10,
          borderWidth: 2,
          alignItems: "center",
          justifyContent: "center",
          margin: 10,
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        <Text style={{ color: "red", fontSize: 18 }}>End Turn</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 25 }}>Cards Left: </Text>
      <Text style={{ fontSize: 25, color: "firebrick" }}>{redLeft}</Text>
      <Text style={{ fontSize: 25 }}> | </Text>
      <Text style={{ fontSize: 25, color: "dodgerblue" }}>{blueLeft}</Text>
      {hidden(canEnd)}
    </View>
  );
};
