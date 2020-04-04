import React, { useEffect, useContext, Component } from "react";
import { TouchableOpacity, Image, Text, TextInput, View } from "react-native";
import { SET_CLUE } from "../constants/Actions";
import { SPYMASTER } from "../constants/Roles";
import SocketContext from "../components/SocketContext";

export default ({ clue, player, currentTeam, board }) => {
  const { socket } = useContext(SocketContext);
  const [word, setWord] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [canEdit, setCanEdit] = React.useState(false);
  const [hasEdited, setHasEdited] = React.useState(false);

  // Executes whenever clue is updated
  useEffect(() => {
    if (clue && clue.word && clue.number) {
      setWord(clue.word);
      setNumber(clue.number);
    } else {
      setWord("");
      setNumber("");
    }
  }, [clue]);

  // Executes whenever currentTeam or board are updated
  // Board was included to also execute this when the board is randomized (ie. through pressing "Restart Game" button)
  useEffect(() => {
    determineIfCanEdit();
  }, [currentTeam, board]);

  const determineIfCanEdit = () => {
    if (player) {
      // If the player is a spymaster on the current team, and they also have not chosen a clue for this turn yet, give them permission to edit
      if (
        !hasEdited &&
        player.role === SPYMASTER &&
        currentTeam === player.team
      ) {
        setCanEdit(true);
      } else {
        setCanEdit(false);
      }

      if (currentTeam !== player.team) {
        setHasEdited(false); // Clear hasEdited on opposing team's turn
      }
    }
  };

  const submitClues = () => {
    socket.emit(SET_CLUE, { word, number });
    setHasEdited(true); // To prevent the current spymaster from setting the clue more than once per turn
  };

  const hidden = (canEdit) => {
    if (canEdit === false) {
      return <>{null}</>;
    }
    return (
      <>
        <TouchableOpacity onPress={submitClues}>
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
          justifyContent: "center",
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
            width: 180,
            textAlign: "center",
          }}
          onChangeText={(text) => {
            setWord(text);
          }}
          value={word}
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
            width: 50,
            textAlign: "center",
          }}
          keyboardType={"numeric"}
          onChangeText={(text) => {
            setNumber(text);
          }}
          value={number}
        />
        {hidden(canEdit)}
      </View>
    </>
  );
};
