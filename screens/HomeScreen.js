import "react-native-gesture-handler";
import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
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

  const createLobby = () => {
    socket.emit(CREATE_LOBBY, { name: name ? name : defaultPlayerName });

    navigation.navigate("Lobby", { name: name ? name : defaultPlayerName }); // Navigate to LobbyScreen
  };

  const joinLobby = () => {
    const lobbyId = selectedLobbyId;

    // Store the current lobby id in GameContext
    setGame({
      ...game,
      lobbyId,
    });

    socket.emit(JOIN_LOBBY, { name: name ? name : defaultPlayerName, lobbyId }); // Join lobby by id on server-side

    navigation.navigate("Lobby", { name: name ? name : defaultPlayerName }); // Navigate to LobbyScreen
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
        style={[styles.defaultButton, styles.defaultButtonHome]}
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

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, flexDirection: "column" }}
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
            justifyContent: "space-around",
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
    </KeyboardAvoidingView>
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

  const slotWidth = 175;
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
      const { redTeam, blueTeam, isGameInProgress } = payload;
      setRedTeam(redTeam);
      setBlueTeam(blueTeam);
      setIsGameInProgress(isGameInProgress);
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
      <View style={styles.centerItems}>
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
      </View>
    );
  };

  const renderBackToHomeButton = () => {
    return (
      <TouchableOpacity onPress={handleLeaveGame} style={styles.defaultButton}>
        <Text style={styles.defaultButtonText}>Back to Home</Text>
      </TouchableOpacity>
    );
  };

  const listRedItems = redTeam.map((buttonnum, index) => {
    let slotColor = "lightgrey";
    let slotName = "Player Slot";
    let slotBorderColor = "black";
    if (index === 0) {
      slotName = "Spymaster Slot";
      slotBorderColor = "firebrick";
    }
    if (redTeam[index] === null) {
      slotColor = "white";
    } else {
      // If slot is taken
      slotColor = "lightgrey"; // Set color to gray
      slotName = redTeam[index].name; // Set name to player's name

      // But if slot is the current player
      if (redTeam[index].id === socket.id) {
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
          if (redTeam[index] === null) {
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
          }
          setRedTeam(redTeamCopy);
          setBlueTeam(blueTeamCopy);
          socket.emit(JOIN_SLOT, { team: RED, index });
        }}
      >
        <Text style={{ fontSize: 20 }}>{slotName}</Text>
      </TouchableOpacity>
    );
  });
  const listBlueItems = blueTeam.map((buttonnum, index) => {
    let slotColor = "lightgrey";
    let slotName = "Player Slot";
    let slotBorderColor = "black";
    if (index === 0) {
      slotName = "Spymaster Slot";
      slotBorderColor = "dodgerblue";
    }

    if (blueTeam[index] === null) {
      slotColor = "white";
    } else {
      // If slot is taken
      slotColor = "lightgrey"; // Set color to gray
      slotName = blueTeam[index].name; // Set name to player's name

      // But if slot is the current player
      if (blueTeam[index].id === socket.id) {
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
          if (blueTeam[index] === null) {
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
          }
          setRedTeam(redTeamCopy);
          setBlueTeam(blueTeamCopy);
          socket.emit(JOIN_SLOT, { team: BLUE, index });
        }}
      >
        <Text style={{ fontSize: 20 }}>{slotName}</Text>
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
              paddingHorizontal: "9%",
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
              paddingHorizontal: "9%",
              padding: 10,
              marginTop: 10,
            }}
          >
            {listBlueItems}
          </View>
          {renderGameButton()}
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
  defaultButton: {
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 16,
    width: 175,
    paddingVertical: 4,
    backgroundColor: "white",
  },
  defaultButtonText: {
    fontSize: 20,
    textAlign: "center",
  },
  defaultButtonHome: { width: 250, marginTop: 0, marginBottom: 8 },
});
