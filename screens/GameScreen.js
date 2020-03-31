import React, { useContext } from "react";
import SocketContext from "../components/SocketContext";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Board from "../components/Board";
import { RED, BLUE } from "../constants/Cards";
import { FIELD_OPERATIVE, SPYMASTER } from "../constants/Roles";
import CardsLeft from "../components/CardsLeft";

import {
  CHOOSE_CARD,
  END_TURN,
  GET_GAME,
  GET_PLAYER_INFO,
  RESTART_GAME,
  UPDATE_GAME,
  UPDATE_PLAYER_INFO
} from "../constants/Actions";

export default class GameScreen extends React.Component {
  static contextType = SocketContext;

  constructor(props) {
    super(props);

    this.state = {
      board: [],
      currentTeam: "",
      player: {},
      redCardCounter: 0,
      blueCardCounter: 0
    };
  }

  componentDidMount = async () => {
    await this.saveSocket();
    await this.subscribeToGameUpdates();
    await this.subscribeToPlayerUpdates();
    await this.getPlayerInfo();
    await this.getGame();
  };

  saveSocket = () => {
    this.socket = this.context.socket;
  };

  subscribeToGameUpdates = () => {
    this.socket.on(UPDATE_GAME, payload => {
      const { currentTeam, board, redCardCounter, blueCardCounter } = payload;
      this.setState({
        currentTeam,
        board,
        redCardCounter,
        blueCardCounter
      });
    });
  };

  subscribeToPlayerUpdates = () => {
    this.socket.on(UPDATE_PLAYER_INFO, player => {
      this.setState({
        player
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
      blueCardCounter
    } = this.state;
    const { name, team, role } = player;

    return (
      <View>
        <Text style={styles.optionsTitleText}>
          You are on {team === RED ? "Red Team" : "Blue Team"}
        </Text>
        <Text style={styles.optionsTitleText}>
          {currentTeam === RED ? "Red Team" : "Blue Team"}'s Turn
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

const styles = StyleSheet.create({
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12
  },
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
