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

  const determineLobbyTextStyle = (lobby) => {
    let style = [styles.lobbyText];

    if (lobby.isGameInProgress) {
      style.push(styles.lobbyTextInProgress);
    } else {
      style.push(styles.lobbyTextWaiting);
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
        const { id, name, playerCount, maxPlayers } = lobby;
        return (
          <React.Fragment key={id}>
            <TouchableOpacity
              style={determineLobbyStyle(lobby)}
              disabled={playerCount >= maxPlayers}
              onPress={() => setSelectedLobbyId(id)}
            >
              <Text style={determineLobbyTextStyle(lobby)}>
                {name} ({playerCount}/{maxPlayers})
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
  lobbyTextInProgress: {
    color: "orange",
  },
  lobbyTextWaiting: {
    color: "green",
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
