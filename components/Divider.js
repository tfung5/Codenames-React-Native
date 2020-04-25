// Credit: https://stackoverflow.com/questions/43380260/draw-horizontal-rule-in-react-native

import React from "react";
import { View } from "react-native";

export default () => {
  return (
    <View
      style={{
        borderBottomColor: "#d5d5d5",
        borderBottomWidth: 1,
      }}
    />
  );
};
