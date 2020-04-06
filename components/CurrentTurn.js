import React, { useContext, Component } from "react";
import { Text, View } from "react-native";
import { RED, BLUE } from "../constants/Cards";

export default ({ blueTurn }) => {
  const whosTurn = (blueTurn) => {
    if (blueTurn === BLUE) {
      return (
        <>
          <Text style={{ fontSize: 25, margin: 0, marginTop: 10 }}>
            Blue Team's Turn
          </Text>
        </>
      );
    }
    return (
      <>
        <Text style={{ fontSize: 25, margin: 0, marginTop: 10 }}>
          Red Team's Turn
        </Text>
      </>
    );
  };
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 2,
        backgroundColor: "white",
      }}
    >
      <Text>{"\n"}</Text>
      {whosTurn(blueTurn)}
    </View>
  );
};
