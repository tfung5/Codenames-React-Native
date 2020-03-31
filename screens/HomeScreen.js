import "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import React, { useContext, useEffect } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Keyboard
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationActions } from "react-navigation";
import Clues from "../components/Clues";
import CardsLeft from "../components/CardsLeft";
import SocketContext from "../components/SocketContext";
import GameContext from "../components/GameContext";
import {
  FETCH_TEAMS,
  INDIVIDUAL_START_GAME,
  JOIN_LOBBY,
  JOIN_SLOT,
  REQUEST_INDIVIDUAL_START_GAME,
  START_GAME,
  UPDATE_TEAMS
} from "../constants/Actions";
import { RED, BLUE } from "../constants/Cards";
import SnackBars from "../components/SnackBars";

const userName = {
  name: "",
  setName: () => {}
};
const userContext = React.createContext(userName);

function HomeScreen({ navigation }) {
  const { name, setName } = useContext(userContext);
  const { socket } = useContext(SocketContext);

  const joinLobby = () => {
    socket.emit(JOIN_LOBBY, name);
    navigation.navigate("LobbyView");
  };

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View
        style={{
          flex: 2,
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: 2
        }}
      >
        <Text style={{ fontSize: 25 }}>Join Lobby</Text>
      </View>

      <View
        style={{
          flex: 29,
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#EAE7F2"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            padding: 25
          }}
        >
          <Text style={{ fontSize: 25 }}>Name:</Text>
          <TextInput
            style={{
              fontSize: 18,
              backgroundColor: "white",
              borderWidth: 2,
              borderRadius: 10,
              borderColor: "lightskyblue",
              padding: 5,
              width: 220,
              textAlign: "center"
            }}
            onChangeText={text => {
              setName(text);
            }}
            value={name}
          />
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              alignItems: "center",
              backgroundColor: "white",
              borderWidth: 2,
              borderRadius: 10,
              width: 250
            }}
            onPress={joinLobby}
          >
            <Text style={{ fontSize: 25 }}>Join Lobby</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function LobbyView({ navigation }) {
  const { socket } = useContext(SocketContext);
  const { game, setGame } = useContext(GameContext);

  const startGame = () => {
    socket.emit(START_GAME);
    setGameInProgress();
    navigateToGameScreen();
  };

  const navigateToGameScreen = () => {
    navigation.navigate(
      "GameStack",
      {},
      NavigationActions.navigate({
        routeName: "Game"
      })
    );
  };

  const setGameInProgress = () => {
    setGame({
      ...game,
      isGameInProgress: true
    });
  };

  const disconnectFromGame = () => {
    console.log("Disconnecting from game");
  };

  const { name, setName } = useContext(userContext);
  const [redTeam, setRedTeam] = React.useState(new Array(4).fill(null));
  const [blueTeam, setBlueTeam] = React.useState(new Array(4).fill(null));

  // componentDidMount
  useEffect(() => {
    socket.emit(FETCH_TEAMS);
    subscribeToGameStart();
  }, []);

  // Handle UPDATE_TEAMS
  socket.on(UPDATE_TEAMS, payload => {
    const { redTeam, blueTeam } = payload;
    setRedTeam(redTeam);
    setBlueTeam(blueTeam);
  });

  const subscribeToGameStart = () => {
    socket.on(REQUEST_INDIVIDUAL_START_GAME, () => {
      socket.emit(INDIVIDUAL_START_GAME);
      navigateToGameScreen();
    });
  };

  const renderDisconnectScreen = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={disconnectFromGame}
          style={styles.testingButton}
        >
          <Text style={styles.testingButtonText}>Disconnect from Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToGameScreen}
          style={styles.testingButton}
        >
          <Text style={styles.testingButtonText}>Back to Game</Text>
        </TouchableOpacity>
      </View>
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
        slotColor = "#8A2BE2"; // Set color to purple
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
          marginHorizontal: "9%",
          marginVertical: 3
        }}
        onPress={() => {
          const redTeamCopy = [...redTeam];
          const blueTeamCopy = [...blueTeam];
          if (redTeam[index] === null) {
            const existingIndexR = redTeam.findIndex(
              element => element == name
            );
            const existingIndexB = blueTeam.findIndex(
              element => element == name
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
        slotColor = "#8A2BE2"; // Set color to purple
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
          marginHorizontal: "9%",
          marginVertical: 3
        }}
        onPress={() => {
          const blueTeamCopy = [...blueTeam];
          const redTeamCopy = [...redTeam];
          if (blueTeam[index] === null) {
            const existingIndexB = blueTeam.findIndex(
              element => element == name
            );
            const existingIndexR = redTeam.findIndex(
              element => element == name
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
    return renderDisconnectScreen();
  } else {
    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flex: 2,
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: 2
          }}
        >
          <Text style={{ fontSize: 25 }}>Join a Team</Text>
        </View>

        <View
          style={{
            flex: 29,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#EAE7F2"
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderColor: "firebrick",
              borderWidth: 2,
              borderRadius: 10,
              marginHorizontal: "9%",
              padding: 10,
              marginBottom: 4
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
              marginHorizontal: "9%",
              padding: 10,
              marginTop: 4
            }}
          >
            {listBlueItems}
          </View>
          <Text
            style={{ fontSize: 25 }}
            onPress={() => navigation.navigate("Test")}
          >
            Touch for Test
          </Text>
          <TouchableOpacity onPress={startGame}>
            <Text>Start Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export function TestScreen({ navigation }) {
  const [buttonPressed, setButtonPressed] = React.useState(false);
  const pressButton = buttonPressed => {
    setButtonPressed(true);
  };
  return (
    <View style={{ flex: 1 }}>
      <Clues canEdit={false} />
      <Clues canEdit={true} />
      <Text>{"\n"}</Text>
      <CardsLeft redLeft={6} blueLeft={3} canEnd={true} />
      <CardsLeft redLeft={3} blueLeft={4} canEnd={false} />
      <TouchableOpacity
        style={{ backgroundColor: "green" }}
        onPress={buttonPressed => {
          pressButton(buttonPressed);
        }}
      >
        <Text>Touch for Snack</Text>
      </TouchableOpacity>
      <SnackBars
        visible={buttonPressed}
        setVisible={setButtonPressed}
        correct={true}
        number={1}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [name, setName] = React.useState("");
  return (
    <userContext.Provider value={{ name, setName }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="HomeScreen"
        >
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen
            name="LobbyView"
            component={props => <LobbyView {...props} {...{ navigation }} />}
          />
          <Stack.Screen name="TestScreen" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </userContext.Provider>
  );
}

const styles = StyleSheet.create({
  testingButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 25,
    width: 150,
    padding: 10
  },
  testingButtonText: {
    textAlign: "center"
  }
});
