import React from "react";
import {
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from "react-native";
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
import PlayerInfoModal from "../components/PlayerInfoModal";

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
      isModalVisible: false,
      victoryVisible: true,
      guess: {},
      keyboardOffset: 0,
      timeOfLatestMessage: 0,
      playerList: [],
      isGuessCorrect: false,
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
       * winningTeam, timeOfLatestMessage, playerList
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
      await this.setGuess(res);
      await this.setIsGuessCorrect(res.isGuessCorrect);
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

  setModalVisible = (value) => {
    this.setState({
      isModalVisible: value,
    });
  };

  setGuess = (value) => {
    this.setState({
      guess: value,
    });
  };

  setVictoryVisible = (value) => {
    this.setState({
      victoryVisible: value,
    });
  };

  setIsGuessCorrect = (value) => {
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
      isModalVisible,
      victoryVisible,
      guess,
      hasClueBeenSet,
      playerList,
      isGuessCorrect,
    } = this.state;
    const { name, team, role } = player;

    const gameOver = (endedGame, blueTurn) => {
      if (endedGame === BLUE || endedGame === RED) {
        return <Winner blueTurn={endedGame} />;
      }
      return <CurrentTurn blueTurn={blueTurn} />;
    };

    const turnEnder = (hasClueBeenSet, isGuessCorrect, currentTeam, role) => {
      if (!isGuessCorrect) {
        return <>{null}</>;
      }
      if (
        hasClueBeenSet === true &&
        isGuessCorrect === true &&
        currentTeam === team &&
        role === FIELD_OPERATIVE
      ) {
        return (
          <TouchableOpacity onPress={this.endTurn} style={styles.turnEndButton}>
            <Text style={styles.turnEndButtonText}>End Turn</Text>
          </TouchableOpacity>
        );
      }
      return <>{null}</>;
    };

    const victoryModal = (winner, visibility, setVisibility) => {
      if (winner === "BLUE" && visibility === true) {
        return (
          <Modal
            animationType="fade"
            transparent={true}
            visible={visibility}
            style={{ borderWidth: 0 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#A89CD0",
                  borderRadius: 10,
                  padding: 20,
                  margin: 10,
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: "dodgerblue",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Blue Team Wins!
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    borderRadius: 5,
                    borderWidth: 1,
                    padding: 6,
                  }}
                  onPress={() => setVisibility(false)}
                >
                  <Text style={{ fontSize: 15 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        );
      }
      if (winner === "RED") {
        return (
          <Modal
            animationType="fade"
            transparent={true}
            visible={visibility}
            style={{ borderWidth: 0 }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFC58E",
                  borderRadius: 10,
                  padding: 20,
                  margin: 10,
                  paddingHorizontal: 30,
                  alignItems: "center",
                  borderColor: "firebrick",
                  borderWidth: 2,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Red Team Wins!
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    borderRadius: 5,
                    borderWidth: 1,
                    padding: 6,
                  }}
                  onPress={() => setVisibility(false)}
                >
                  <Text style={{ fontSize: 15 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        );
      }
      return <>{null}</>;
    };

    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.contentContainer}
      >
        <SafeAreaView style={this.determineContentContainerStyle()}>
          <NavigationEvents onDidFocus={this.componentDidMount} />
          {gameOver(this.state.winningTeam, currentTeam)}
          <View style={styles.infoModal}>
            {victoryModal(
              this.state.winningTeam,
              victoryVisible,
              this.setVictoryVisible
            )}
          </View>
          <Text style={styles.optionsTitleText}>
            {player.name}, you are on the{" "}
            {team === RED ? "Red Team" : "Blue Team"}
          </Text>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <CardsLeft
              redLeft={redCardCounter}
              blueLeft={blueCardCounter}
              canEnd={false}
            />
            {turnEnder(hasClueBeenSet, isGuessCorrect, currentTeam, role)}
          </View>
          <View style={styles.boardWrapper}>
            <Board
              {...{ board, player, currentTeam, winningTeam, clue }}
              chooseCard={this.chooseCard}
            />
          </View>
          <Clues
            {...{
              clue,
              player,
              currentTeam,
              board,
              winningTeam,
              hasClueBeenSet,
            }}
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
            <TouchableOpacity
              onPress={this.navigateToChat}
              style={styles.testingButton}
            >
              {this.renderChatNotificationIfNeeded()}
              <Text style={styles.testingButtonText}>Open Chat</Text>
            </TouchableOpacity>
            {isModalVisible === false && (
              <TouchableOpacity
                onPress={() => this.setModalVisible(true)} // Should open modal
                style={styles.testingButton}
              >
                <Text style={styles.testingButtonText}>
                  Show Players in Game
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.infoModal}>
            {isModalVisible && (
              <PlayerInfoModal
                visible={isModalVisible}
                setVisible={this.setModalVisible}
                playerInfo={playerList}
              />
            )}
          </View>
          <SnackBars
            visible={isSnackbarVisible}
            setVisible={this.setSnackbarVisible}
            guess={guess}
            number={guessCounter}
          />
        </SafeAreaView>
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
    padding: 10,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    width: 175,
  },
  turnEndButton: {
    margin: 10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 25,
    width: 100,
    padding: 10,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  testingButtonText: {
    textAlign: "center",
  },
  turnEndButtonText: {
    textAlign: "center",
    color: "red",
  },
  notificationIcon: {
    width: 22,
    height: 22,
  },
  contentContainer: {
    height: "100%",
  },
  gameScreen: {
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 55,
    flex: 1,
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
  infoModal: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
};
