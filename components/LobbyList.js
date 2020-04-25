import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Divider from "./Divider";

export default ({ lobbyList, selectedLobbyId, setSelectedLobbyId }) => {
  const lobbyIds = Object.keys(lobbyList);

  const determineLobbyStyle = (lobby) => {
    let style = [styles.lobby];

    if (lobby.id === selectedLobbyId) {
      style.push(styles.selectedLobby);
    }

    return style;
  };

  const renderLobbyList = () => {
    if (lobbyIds.length === 0) {
      return (
        <View style={styles.noLobbiesFound}>
          <Text style={styles.noLobbiesFoundText}>No Lobbies Found</Text>
        </View>
      );
    } else {
      return lobbyIds.map((lobbyId) => {
        const lobby = lobbyList[lobbyId];
        const playerCount = Object.keys(lobby.playerList).length;

        return (
          <React.Fragment key={lobby.id}>
            <TouchableOpacity
              style={determineLobbyStyle(lobby)}
              onPress={() => setSelectedLobbyId(lobby.id)}
            >
              <Text style={styles.lobbyText}>
                {lobby.name} ({playerCount}/{lobby.maxPlayers})
              </Text>
            </TouchableOpacity>
            <Divider />
          </React.Fragment>
        );
      });
    }
  };

  return <ScrollView style={styles.lobbyList}>{renderLobbyList()}</ScrollView>;
};

const styles = {
  lobbyList: {
    width: 250,
    maxHeight: 300,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 3,
    margin: 30,
  },
  lobby: {
    padding: 10,
  },
  selectedLobby: {
    backgroundColor: "lightblue",
  },
  lobbyText: {
    textAlign: "center",
  },
  noLobbiesFound: {
    height: 295,
    justifyContent: "center",
    alignItems: "center",
  },
  noLobbiesFoundText: {
    fontSize: 24,
  },
};
