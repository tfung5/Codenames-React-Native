import React, { useContext } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions } from "react-navigation";

import CombinedContext from "../components/CombinedContext";
import ProvideCombinedContext from "../components/ProvideCombinedContext";

import Board from "../components/Board";
import { RED, BLUE } from "../constants/Cards";
import { FIELD_OPERATIVE, SPYMASTER } from "../constants/Roles";
import CardsLeft from "../components/CardsLeft";
import Clues from "../components/Clues";
import Winner from "../components/Winner";
import CurrentTurn from "../components/CurrentTurn";
import SnackBars from "../components/SnackBars";

import {
  CHOOSE_CARD,
  END_TURN,
  GET_GAME,
  GET_PLAYER_INFO,
  LOAD_PRESET_BOARD,
  RESTART_GAME,
  UPDATE_GAME,
  UPDATE_PLAYER_INFO,
} from "../constants/Actions";

class GameScreen extends React.Component {
  static contextType = CombinedContext;

  constructor(props) {
    super(props);

    this.state = {
      board: [],
      currentTeam: "",
      player: {},
      redCardCounter: 0,
      blueCardCounter: 0,
      guessCounter: 0,
      winningTeam: "",
      isSnackbarVisible: false,
      isGuessCorrect: false,
      keyboardOffset: 0,
    };
  }

  componentDidMount = () => {
    if (this.isRedirectToHomeNeeded()) {
      this.navigateToHomeScreen();
    } else {
      this.runSetup();
    }
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  };

  componentWillUnmount = () => {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  _keyboardDidShow = (event) => {
    this.setState({
      keyboardOffset: event.endCoordinates.height,
    });
  };

  _keyboardDidHide = () => {
    this.setState({
      keyboardOffset: 0,
    });
  };

  runSetup = async () => {
    await this.saveSocket();
    await this.subscribeToGameUpdates();
    await this.subscribeToPlayerUpdates();
    await this.getPlayerInfo();
    await this.getGame();
  };

  saveSocket = () => {
    this.socket = this.context.SocketContext.socket;
  };

  isRedirectToHomeNeeded = () => {
    /**
     * Returns true if there is no game in progress
     * If the user did not come from the LobbyScreen, then there is no game in progress
     */
    return !this.context.GameContext.game.isGameInProgress;
  };

  navigateToHomeScreen = () => {
    this.props.navigation.navigate(
      "HomeStack",
      {},
      NavigationActions.navigate({
        routeName: "Home",
      })
    );
  };

  subscribeToGameUpdates = () => {
    this.socket.on(UPDATE_GAME, (payload) => {
      const {
        currentTeam,
        board,
        redCardCounter,
        blueCardCounter,
        guessCounter,
        clue,
        winningTeam,
      } = payload;
      this.setState({
        currentTeam,
        board,
        redCardCounter,
        blueCardCounter,
        guessCounter,
        clue,
        winningTeam,
      });
    });
  };

  subscribeToPlayerUpdates = () => {
    this.socket.on(UPDATE_PLAYER_INFO, (player) => {
      this.setState({
        player,
      });
    });
  };

  getGame = () => {
    this.socket.emit(GET_GAME);
  };

  getPlayerInfo = () => {
    this.socket.emit(GET_PLAYER_INFO);
  };

  loadPresetBoard = () => {
    this.socket.emit(LOAD_PRESET_BOARD);
  };

  restartGame = () => {
    this.socket.emit(RESTART_GAME);
  };

  chooseCard = (row, col) => {
    this.socket.emit(CHOOSE_CARD, { row, col }, async (res) => {
      await this.setGuessCorrect(res);
      await this.setSnackbarVisible(true);
    });
  };

  endTurn = () => {
    this.socket.emit(END_TURN);
  };

  navigateToChat = () => {
    this.props.navigation.navigate("Chat");
  };

  setSnackbarVisible = (value) => {
    this.setState({
      isSnackbarVisible: value,
    });
  };

  // Sets isGuessCorrect to either true or false, depending on the response
  setGuessCorrect = (value) => {
    this.setState({
      isGuessCorrect: value,
    });
  };

  determineContentContainerStyle = () => {
    const { keyboardOffset } = this.state;

    let res = [styles.gameScreen];

    if (keyboardOffset > 0) {
      res.push(styles.keyboardInFocus);
    } else {
      res.push(styles.keyboardNotInFocus);
    }

    return res;
  };

  render() {
    const {
      board,
      player,
      currentTeam,
      redCardCounter,
      blueCardCounter,
      guessCounter,
      winningTeam,
      clue,
      isSnackbarVisible,
      isGuessCorrect,
    } = this.state;
    const { name, team, role } = player;

    const gameOver = (endedGame, blueTurn) => {
      if (endedGame === BLUE || endedGame === RED) {
        return (
          <>
            <Winner blueTurn={endedGame} />
          </>
        );
      }
      return (
        <>
          <CurrentTurn blueTurn={blueTurn} />
        </>
      );
    };

    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={this.determineContentContainerStyle()}
      >
        {gameOver(this.state.winningTeam, currentTeam)}
        <Text style={styles.optionsTitleText}>
          You are on {team === RED ? "Red Team" : "Blue Team"}
        </Text>
        <CardsLeft
          redLeft={redCardCounter}
          blueLeft={blueCardCounter}
          canEnd={false}
        />
        <Board
          {...{ board, player, currentTeam, winningTeam }}
          chooseCard={this.chooseCard}
        />
        <Clues {...{ clue, player, currentTeam, board, winningTeam }} />
        {clue && clue.word && clue.number && (
          <Text style={styles.optionsTitleText}>
            Number of Guesses Remaining: {guessCounter}
          </Text>
        )}
        <View style={styles.testingButtons}>
          <TouchableOpacity
            onPress={this.loadPresetBoard}
            style={styles.testingButton}
          >
            <Text style={styles.testingButtonText}>Load Preset Board</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.restartGame}
            style={styles.testingButton}
          >
            <Text style={styles.testingButtonText}>Restart Game</Text>
          </TouchableOpacity>
          {currentTeam === team && role === FIELD_OPERATIVE && (
            <TouchableOpacity
              onPress={this.endTurn}
              style={styles.testingButton}
            >
              <Text style={styles.testingButtonText}>End Turn</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={this.navigateToChat}
            style={styles.testingButton}
          >
            <Text style={styles.testingButtonText}>Open Chat</Text>
          </TouchableOpacity>
        </View>
        <SnackBars
          visible={isSnackbarVisible}
          setVisible={this.setSnackbarVisible}
          correct={isGuessCorrect}
          number={guessCounter}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const WrappedGameScreen = (props) => {
  return (
    <ProvideCombinedContext>
      <GameScreen {...props} />
    </ProvideCombinedContext>
  );
};

export default WrappedGameScreen;

const styles = {
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
  },
  testingButtons: {},
  testingButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 25,
    width: 150,
    padding: 10,
    marginTop: 5,
  },
  testingButtonText: {
    textAlign: "center",
  },
  gameScreen: {
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,
  },
  keyboardInFocus: {
    justifyContent: "center",
  },
  keyboardNotInFocus: {
    justifyContent: "space-evenly",
  },
};
