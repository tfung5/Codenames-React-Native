import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

import {
  CHOOSE_CARD,
  END_TURN,
  GET_GAME,
  GET_PLAYER_INFO,
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
    };
  }

  componentDidMount = () => {
    if (this.isRedirectToHomeNeeded()) {
      this.navigateToHomeScreen();
    } else {
      this.runSetup();
    }
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

  render() {
    const {
      board,
      player,
      currentTeam,
      redCardCounter,
      blueCardCounter,
      guessCounter,
      clue,
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
      <View>
        {gameOver(this.state.winningTeam, currentTeam)}
        <Text style={styles.optionsTitleText}>
          You are on {team === RED ? "Red Team" : "Blue Team"}
        </Text>
        <Text style={styles.optionsTitleText}>
          {currentTeam === RED ? "Red Team" : "Blue Team"}'s Turn
        </Text>
        <Text style={styles.optionsTitleText}>
          Number of Guesses Remaining: {guessCounter}
        </Text>
        <CardsLeft
          redLeft={redCardCounter}
          blueLeft={blueCardCounter}
          canEnd={false}
        />
        <Board
          {...{ board, player, currentTeam }}
          chooseCard={this.chooseCard}
        />
        <Clues {...{ clue, player, currentTeam }} />
        <TouchableOpacity
          onPress={this.restartGame}
          style={styles.testingButton}
        >
          <Text style={styles.testingButtonText}>Restart Game</Text>
        </TouchableOpacity>
        {currentTeam === team && role === FIELD_OPERATIVE && (
          <TouchableOpacity onPress={this.endTurn} style={styles.testingButton}>
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

const styles = StyleSheet.create({
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
  },
  testingButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 25,
    width: 150,
    padding: 10,
  },
  testingButtonText: {
    textAlign: "center",
  },
});
