import "react-native-gesture-handler";
import React, { useContext, useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions, NavigationEvents } from "react-navigation";
import SocketContext from "../components/SocketContext";
import GameContext from "../components/GameContext";
import {
  CREATE_LOBBY,
  FETCH_LOBBY,
  FETCH_LOBBY_LIST,
  JOIN_GAME,
  JOIN_LOBBY,
  JOIN_SLOT,
  LEAVE_GAME,
  REQUEST_INDIVIDUAL_START_GAME,
  RESET_LOBBY,
  START_GAME,
  UPDATE_LOBBY,
  UPDATE_LOBBY_LIST,
  LEAVE_SLOT,
  READY_CHANGE,
} from "../constants/Actions";
import { RED, BLUE } from "../constants/Cards";
import LobbyList from "../components/LobbyList";

export default function HomeScreen({ navigation }) {
  const { socket } = useContext(SocketContext);
  const { game, setGame } = useContext(GameContext);

  // componentDidMount
  useEffect(() => {
    subscribeToLobbyListUpdates();
    fetchLobbyList();
  }, []);

  const [lobbyList, setLobbyList] = React.useState({});
  const [selectedLobbyId, setSelectedLobbyId] = React.useState(null);
  const [name, setName] = React.useState("");
  const defaultPlayerName = "Player";

  const fetchLobbyList = () => {
    socket.emit(FETCH_LOBBY_LIST);
  };

  const subscribeToLobbyListUpdates = () => {
    socket.on(UPDATE_LOBBY_LIST, (payload) => {
      setLobbyList(payload);
    });
  };

  const navigateToLobbyScreen = () => {
    navigation.navigate("Lobby", {
      name: name ? name : defaultPlayerName,
    });
  };

  const createLobby = () => {
    socket.emit(CREATE_LOBBY, { name: name ? name : defaultPlayerName });
    navigateToLobbyScreen();
  };

  const joinLobby = () => {
    const lobbyId = selectedLobbyId;

    // Store the current lobby id in GameContext
    setGame({
      ...game,
      lobbyId,
    });

    socket.emit(
      JOIN_LOBBY,
      { name: name ? name : defaultPlayerName, lobbyId },
      (res) => {
        // res is expected to be true if there is space available in the lobby
        if (res) {
          navigateToLobbyScreen();
        } else {
          fetchLobbyList(); // Unable to join, so get the latest lobbyList to see that it's full
          setSelectedLobbyId(null); // Clear selectedLobbyId if user selected one already
        }
      }
    ); // Join lobby by id on server-side
  };

  const renderCreateLobbyButton = () => {
    return (
      <TouchableOpacity
        onPress={createLobby}
        style={[styles.defaultButton, styles.defaultButtonHome]}
      >
        <Text style={styles.defaultButtonText}>Create Lobby</Text>
      </TouchableOpacity>
    );
  };

  const renderJoinLobbyButton = () => {
    return (
      <TouchableOpacity
        onPress={joinLobby}
        disabled={!selectedLobbyId} // Disabled if a lobby hasn't been selected yet
        style={determineJoinLobbyButtonStyle()}
      >
        <Text style={styles.defaultButtonText}>Join Lobby</Text>
      </TouchableOpacity>
    );
  };

  const renderRefreshLobbyListButton = () => {
    return (
      <TouchableOpacity
        onPress={fetchLobbyList}
        style={[styles.defaultButton, styles.defaultButtonHome]}
      >
        <Text style={styles.defaultButtonText}>Refresh List</Text>
      </TouchableOpacity>
    );
  };

  const determineJoinLobbyButtonStyle = () => {
    let style = [styles.defaultButton, styles.defaultButtonHome];

    if (!selectedLobbyId) {
      style.push(styles.disabledButton);
    }

    return style;
  };

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ height: "100%", backgroundColor: "#EAE7F2" }}
    >
      <NavigationEvents onDidFocus={fetchLobbyList} />
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#EAE7F2",
          height: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              fontSize: 18,
              backgroundColor: "white",
              borderWidth: 2,
              borderRadius: 10,
              borderColor: "lightskyblue",
              padding: 5,
              width: 220,
              textAlign: "center",
            }}
            onChangeText={(text) => {
              if (text.length <= 10) {
                setName(text);
              }
            }}
            value={name}
            placeholder="Enter name..."
          />
        </View>
        <LobbyList {...{ lobbyList, selectedLobbyId, setSelectedLobbyId }} />
        {renderCreateLobbyButton()}
        {renderJoinLobbyButton()}
        {renderRefreshLobbyListButton()}
      </View>
    </KeyboardAwareScrollView>
  );
}

export function LobbyScreen({ navigation }) {
  const { socket } = useContext(SocketContext);
  const { game, setGame } = useContext(GameContext);

  // Initiated by the first player to hit Start Game
  const startGame = () => {
    socket.emit(START_GAME);
  };

  // Will join game by:
  const joinGame = () => {
    socket.emit(JOIN_GAME); // Join the appropriate room depending on player's role
    setGame({
      ...game,
      isGameInProgress: true,
    });
    navigateToGameScreen();
  };

  const navigateToGameScreen = () => {
    navigation.navigate(
      "GameStack",
      {},
      NavigationActions.navigate({
        routeName: "Game",
      })
    );
  };

  const navigateToHomeScreen = () => {
    navigation.navigate("Home");
  };

  const handleLeaveGame = () => {
    emitLeaveGame();
    setGame({
      ...game,
      isGameInProgress: false,
      hasLeftPreviousGame: true,
    });
    navigateToHomeScreen();
  };

  const emitLeaveGame = () => {
    socket.emit(LEAVE_GAME);
  };

  const { name } = navigation.state.params;
  const [redTeam, setRedTeam] = React.useState(new Array(4).fill(null));
  const [blueTeam, setBlueTeam] = React.useState(new Array(4).fill(null));
  const [isGameInProgress, setIsGameInProgress] = React.useState(false);

  const slotWidth = 200;
  const slotHeight = 35;

  // componentDidMount
  useEffect(() => {
    socket.emit(FETCH_LOBBY);
    subscribeToGameStart();
    subscribeToLobbyUpdates();
  }, []);

  const subscribeToLobbyUpdates = () => {
    // Handle UPDATE_LOBBY
    socket.on(UPDATE_LOBBY, (payload) => {
      const {
        redTeam,
        blueTeam,
        isGameInProgress,
        redReadys,
        blueReadys,
      } = payload;
      setRedTeam(redTeam);
      setBlueTeam(blueTeam);
      setIsGameInProgress(isGameInProgress);
      setRedReady(redReadys);
      setBlueReady(blueReadys);
    });
  };

  // Upon receiving request from the server to start game, will join game
  const subscribeToGameStart = () => {
    socket.on(REQUEST_INDIVIDUAL_START_GAME, () => {
      joinGame();
    });
  };

  const resetLobby = () => {
    socket.emit(RESET_LOBBY);
  };

  const renderGameButton = () => {
    if (isGameInProgress) {
      return (
        <TouchableOpacity onPress={joinGame} style={styles.defaultButton}>
          <Text style={styles.defaultButtonText}>Join Game</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={startGame} style={styles.defaultButton}>
          <Text style={styles.defaultButtonText}>Start Game</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderResetLobbyButton = () => {
    return (
      <TouchableOpacity onPress={resetLobby} style={styles.defaultButton}>
        <Text style={styles.defaultButtonText}>Reset Lobby</Text>
      </TouchableOpacity>
    );
  };

  const renderLeaveGameScreen = () => {
    return (
      <SafeAreaView style={[styles.leaveGameScreen, styles.centerItems]}>
        <TouchableOpacity
          onPress={handleLeaveGame}
          style={styles.defaultButton}
        >
          <Text style={styles.defaultButtonText}>Leave Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToGameScreen}
          style={styles.defaultButton}
        >
          <Text style={styles.defaultButtonText}>Back to Game</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  const renderBackToHomeButton = () => {
    return (
      <TouchableOpacity onPress={handleLeaveGame} style={styles.defaultButton}>
        <Text style={styles.defaultButtonText}>Back to Home</Text>
      </TouchableOpacity>
    );
  };

  const [redReady, setRedReady] = React.useState(new Array(4).fill(null));
  const [blueReady, setBlueReady] = React.useState(new Array(4).fill(null));

  const isOnATeam = () => {
    let res = false;

    for (let player of redTeam) {
      if (player?.id === socket.id) {
        res = true;
      }
    }

    for (let player of blueTeam) {
      if (player?.id === socket.id) {
        res = true;
      }
    }

    return res;
  };

  const determineJoinGameButtonStyle = () => {
    let style = [styles.defaultButton];

    if (!isOnATeam()) {
      style.push(styles.disabledButton);
    }

    return style;
  };

  const canStartGame = (readyRed, readyBlue) => {
    let totalPlayers = 0;
    let totalReady = 0;
    for (let i in readyRed) {
      if (readyRed[i] !== null) {
        totalPlayers += 1;
      }
      if (readyRed[i] === true) {
        totalReady += 1;
      }
    }
    for (let i in readyBlue) {
      if (readyBlue[i] !== null) {
        totalPlayers += 1;
      }
      if (readyBlue[i] === true) {
        totalReady += 1;
      }
    }
    if (isGameInProgress) {
      return (
        <TouchableOpacity
          onPress={joinGame}
          style={determineJoinGameButtonStyle()}
          disabled={isOnATeam() ? false : true}
        >
          <Text style={styles.defaultButtonText}>Join Game</Text>
        </TouchableOpacity>
      );
    } else {
      if (totalPlayers != totalReady) {
        return (
          <TouchableOpacity style={styles.defaultButton}>
            <Text style={styles.defaultButtonText}>
              ({totalReady}/{totalPlayers})Start Game
            </Text>
          </TouchableOpacity>
        );
      }
      if (totalPlayers === totalReady) {
        return (
          <TouchableOpacity onPress={startGame} style={styles.readyButton}>
            <Text style={styles.readyButtonText}>
              ({totalReady}/{totalPlayers})Start Game
            </Text>
          </TouchableOpacity>
        );
      }
    }
  };

  const leaveSlotButton = (visible, slotName, team) => {
    if (
      visible === true &&
      slotName != "Player Slot" &&
      slotName != "Spymaster Slot"
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            const redTeamCopy = [...redTeam];
            const blueTeamCopy = [...blueTeam];
            if (slotName === name) {
              socket.emit(LEAVE_SLOT);
              if (team === "RED") {
                const existingIndexR = redTeam.findIndex(
                  (element) => element == name
                );
                redTeamCopy[existingIndexR] = null;
                socket.emit(LEAVE_SLOT);
                setRedTeam(redTeamCopy);
              }
              if (team === "BLUE") {
                const existingIndexB = blueTeam.findIndex(
                  (element) => element == name
                );
                blueTeamCopy[existingIndexB] = null;
                setBlueTeam(blueTeamCopy);
                socket.emit(LEAVE_SLOT);
              }
            }
          }}
        >
          <Image
            style={{ margin: 10, width: 20, height: 20 }}
            source={require("../assets/images/redx.png")}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const readySlotButton = (visible, slotName, readiness, index, team) => {
    if (
      readiness[index] === false &&
      visible === true &&
      slotName != "Player Slot" &&
      slotName != "Spymaster Slot"
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (slotName === name) {
              socket.emit(READY_CHANGE, { team, index });
            }
          }}
        >
          <Image
            style={{ margin: 10, width: 20, height: 20 }}
            source={require("../assets/images/greycheck.png")}
          />
        </TouchableOpacity>
      );
    } else if (
      readiness[index] === true &&
      visible === true &&
      slotName != "Player Slot" &&
      slotName != "Spymaster Slot"
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (slotName === name) {
              socket.emit(READY_CHANGE, { team, index });
            }
          }}
        >
          <Image
            style={{ margin: 10, width: 20, height: 20 }}
            source={require("../assets/images/greencheck.png")}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const listRedItems = redTeam.map((redPlayer, index) => {
    let slotColor = "lightgrey";
    let slotName = "Player Slot";
    let slotBorderColor = "black";
    let showButtons = false;
    if (index === 0) {
      slotName = "Spymaster Slot";
      slotBorderColor = "firebrick";
    }
    if (index != 0) {
      slotName = "Player Slot";
      slotBorderColor = "black";
    }
    if (redTeam[index] === null) {
      slotColor = "white";
      showButtons = false;
    } else {
      // If slot is taken
      slotColor = "lightgrey"; // Set color to gray
      slotName = redPlayer.name; // Set name to player's name
      showButtons = true;
      // But if slot is the current player
      if (redPlayer.id === socket.id) {
        slotColor = "#FFC58E"; // Set color to orange
      }
    }

    return (
      <TouchableOpacity
        key={index}
        style={{
          backgroundColor: slotColor,
          borderColor: slotBorderColor,
          borderRadius: 10,
          borderWidth: 2,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 3,
          width: slotWidth,
          height: slotHeight,
        }}
        onPress={() => {
          const redTeamCopy = [...redTeam];
          const blueTeamCopy = [...blueTeam];
          if (redPlayer === null) {
            const existingIndexR = redTeam.findIndex(
              (element) => element == name
            );
            const existingIndexB = blueTeam.findIndex(
              (element) => element == name
            );
            if (existingIndexR != -1) {
              redTeamCopy[existingIndexR] = null;
            }
            if (existingIndexB != -1) {
              blueTeamCopy[existingIndexB] = null;
            }
            redTeamCopy[index] = name;
            showButtons = true;
            socket.emit(JOIN_SLOT, { team: RED, index });
          }
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {leaveSlotButton(showButtons, slotName, "RED")}
          <Text
            style={{
              fontSize: 20,
              fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
            }}
          >
            {slotName}
          </Text>
          {!isGameInProgress &&
            readySlotButton(showButtons, slotName, redReady, index, "RED")}
        </View>
      </TouchableOpacity>
    );
  });
  const listBlueItems = blueTeam.map((bluePlayer, index) => {
    let slotColor = "lightgrey";
    let slotName = "Player Slot";
    let slotBorderColor = "black";
    let showButtons = false;
    if (index === 0) {
      slotName = "Spymaster Slot";
      slotBorderColor = "dodgerblue";
    }
    if (index != 0) {
      slotName = "Player Slot";
      slotBorderColor = "black";
    }
    if (blueTeam[index] === null) {
      slotColor = "white";
      showButtons = false;
    } else {
      // If slot is taken
      slotColor = "lightgrey"; // Set color to gray
      slotName = bluePlayer.name; // Set name to player's name
      showButtons = true;
      // But if slot is the current player
      if (bluePlayer.id === socket.id) {
        slotColor = "#A89CD0"; // Set color to purple
      }
    }

    return (
      <TouchableOpacity
        key={index}
        style={{
          backgroundColor: slotColor,
          borderColor: slotBorderColor,
          borderRadius: 10,
          borderWidth: 2,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 3,
          width: slotWidth,
          height: slotHeight,
        }}
        onPress={() => {
          const blueTeamCopy = [...blueTeam];
          const redTeamCopy = [...redTeam];
          if (bluePlayer === null) {
            const existingIndexB = blueTeam.findIndex(
              (element) => element == name
            );
            const existingIndexR = redTeam.findIndex(
              (element) => element == name
            );
            if (existingIndexB != -1) {
              blueTeamCopy[existingIndexB] = null;
            }
            if (existingIndexR != -1) {
              redTeamCopy[existingIndexR] = null;
            }
            blueTeamCopy[index] = name;
            showButtons = true;
            socket.emit(JOIN_SLOT, { team: BLUE, index });
          }
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {leaveSlotButton(showButtons, slotName, "BLUE")}
          <Text
            style={{
              fontSize: 20,
              fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
            }}
          >
            {slotName}
          </Text>
          {readySlotButton(showButtons, slotName, blueReady, index, "BLUE")}
        </View>
      </TouchableOpacity>
    );
  });

  if (game.isGameInProgress) {
    return renderLeaveGameScreen();
  } else {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flex: 29,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#EAE7F2",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderColor: "firebrick",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 50,
              paddingVertical: 10,
              marginBottom: 10,
            }}
          >
            {listRedItems}
          </View>
          <View
            style={{
              backgroundColor: "white",
              borderColor: "dodgerblue",
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 50,
              padding: 10,
              marginTop: 10,
            }}
          >
            {listBlueItems}
          </View>
          {/* {renderGameButton()} */}
          {canStartGame(redReady, blueReady)}
          {renderResetLobbyButton()}
          {renderBackToHomeButton()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerItems: {
    alignItems: "center",
    justifyContent: "center",
  },
  leaveGameScreen: {
    flex: 1,
  },
  defaultButton: {
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 16,
    width: 200,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  readyButton: {
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 16,
    width: 200,
    paddingVertical: 4,
    backgroundColor: "green",
  },
  defaultButtonText: {
    fontSize: 20,
    textAlign: "center",
  },
  readyButtonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  defaultButtonHome: { width: 250, marginTop: 0, marginBottom: 8 },
  disabledButton: {
    backgroundColor: "lightgray",
  },
});
