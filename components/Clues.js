import React, { Component } from "react";
import { TouchableOpacity, Image, Text, TextInput, View } from "react-native";

export default ({ canEdit }) => {
  const hidden = canEdit => {
    if (canEdit === false) {
      return <>{null}</>;
    }
    return (
      <>
        <TouchableOpacity>
          <Image
            style={{ margin: 4, width: 40, height: 40 }}
            source={require("../assets/images/play-icon.png")}
          />
        </TouchableOpacity>
      </>
    );
  };
  return (
    <>
      <Text>{"\n"}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={{ margin: 4, fontSize: 25 }}>Clue:</Text>
        <TextInput
          editable={canEdit}
          style={{
            fontSize: 18,
            margin: 4,
            backgroundColor: "white",
            borderColor: "lightskyblue",
            padding: 5,
            borderWidth: 2,
            borderRadius: 10,
            width: 180
          }}
          textAlign={"center"}
        />
        <TextInput
          editable={canEdit}
          style={{
            fontSize: 18,
            margin: 4,
            backgroundColor: "white",
            borderColor: "lightskyblue",
            padding: 5,
            borderWidth: 2,
            borderRadius: 10,
            width: 50
          }}
          textAlign={"center"}
          keyboardType={"numeric"}
        />
        {hidden(canEdit)}
      </View>
    </>
  );
};
