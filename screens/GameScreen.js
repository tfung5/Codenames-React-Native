import React from "react";
import { Keyboard, Text, TouchableOpacity, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Credit: https://stackoverflow.com/questions/48018084/componentdidmount-function-is-not-called-after-navigation
import { NavigationActions, NavigationEvents } from "react-navigation";

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
  CHOOSE_CARD_RESPONSE,
  END_TURN,
  FETCH_GAME,
  FETCH_PLAYER_INFO,
  LOAD_PRESET_BOARD,
  RESTART_GAME,
  UPDATE_GAME,
  UPDATE_PLAYER_INFO,
} from "../constants/Actions";

class GameScreen extends React.Component {
  static contextType = CombinedContext;

  constructor(props) {
    super(props);

    this.initialState = {
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
      timeOfLatestMessage: 0,
    };

    this.state = this.initialState;
  }

  componentDidMount = () => {
    if (this.isRedirectToHomeNeeded()) {
      this.navigateToHomeScreen();
    } else {
      this.clearAllInfo();
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

  clearAllInfo = () => {
    if (this.context.GameContext.game.hasLeftPreviousGame) {
      this.setState(this.initialState);
      this.context.GameContext.game.hasLeftPreviousGame = false;
    }
  };

  runSetup = async () => {
    await this.saveSocket();
    await this.subscribeToGameUpdates();
    await this.subscribeToPlayerUpdates();
    await this.subscribeToChooseCardUpdates();
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
      this.setState({
        ...this.state,
        ...payload,
      });

      /**
       * Payload includes:
       * currentTeam, board, redCardCounter,
       * blueCardCounter, guessCounter, clue,
       * winningTeam, timeOfLatestMessage
       */
    });
  };

  subscribeToPlayerUpdates = () => {
    this.socket.on(UPDATE_PLAYER_INFO, (player) => {
      this.setState({
        player,
      });
    });
  };

  subscribeToChooseCardUpdates = () => {
    this.socket.on(CHOOSE_CARD_RESPONSE, async (res) => {
      await this.setGuessCorrect(res);
      await this.setSnackbarVisible(true);
    });
  };

  getGame = () => {
    this.socket.emit(FETCH_GAME);
  };

  getPlayerInfo = () => {
    this.socket.emit(FETCH_PLAYER_INFO);
  };

  loadPresetBoard = () => {
    this.socket.emit(LOAD_PRESET_BOARD);
  };

  restartGame = () => {
    this.socket.emit(RESTART_GAME);
  };

  chooseCard = (row, col) => {
    this.socket.emit(CHOOSE_CARD, { row, col });
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

  renderChatNotificationIfNeeded = () => {
    if (
      this.context.GameContext.game.timeOfLastReadMessage <
      this.state.timeOfLatestMessage
    ) {
      return (
        <Image
          style={styles.notificationIcon}
          source={require("../assets/images/bell.png")}
        />
      );
    }
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
      hasClueBeenSet,
    } = this.state;
    const { name, team, role } = player;

    const gameOver = (endedGame, blueTurn) => {
      if (endedGame === BLUE || endedGame === RED) {
        return <Winner blueTurn={endedGame} />;
      }
      return <CurrentTurn blueTurn={blueTurn} />;
    };

    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={this.determineContentContainerStyle()}
      >
        <NavigationEvents onDidFocus={this.componentDidMount} />
        {gameOver(this.state.winningTeam, currentTeam)}
        <Text style={styles.optionsTitleText}>
          You are on {team === RED ? "Red Team" : "Blue Team"}
        </Text>
        <CardsLeft
          redLeft={redCardCounter}
          blueLeft={blueCardCounter}
          canEnd={false}
        />
        <View style={styles.boardWrapper}>
          <Board
            {...{ board, player, currentTeam, winningTeam }}
            chooseCard={this.chooseCard}
          />
        </View>
        <Clues
          {...{ clue, player, currentTeam, board, winningTeam, hasClueBeenSet }}
        />
        {clue && clue.word && clue.number >= 0 && (
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
            {this.renderChatNotificationIfNeeded()}
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
    marginTop: 12,
    marginBottom: 12,
  },
  testingButtons: {
    marginTop: 8,
  },
  testingButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 25,
    width: 150,
    padding: 10,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  testingButtonText: {
    textAlign: "center",
  },
  notificationIcon: {
    width: 22,
    height: 22,
  },
  gameScreen: {
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 55,
  },
  keyboardInFocus: {
    justifyContent: "center",
  },
  keyboardNotInFocus: {
    justifyContent: "space-evenly",
  },
  boardWrapper: {
    marginVertical: 10,
  },
};
