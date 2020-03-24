import React, { useContext } from "react";
import SocketContext from "../components/SocketContext";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Board from "../components/Board";
import { RED, BLUE } from "../constants/Cards";
import { SEND_PLAYER_INFO } from "../constants/Actions";
import { FIELD_OPERATIVE, SPYMASTER } from "../constants/Roles";

import {
  UPDATE_GAME,
  GET_GAME,
  RESTART_GAME,
  CHOOSE_CARD
} from "../constants/Actions";

export default class GameScreen extends React.Component {
  static contextType = SocketContext;

  constructor(props) {
    super(props);

    this.state = {
      board: [],
      team: RED
    };
  }

  componentDidMount = async () => {
    await this.saveSocket();
    await this.subscribeToGameUpdates();
    await this.getGame();
  };

  saveSocket = () => {
    this.socket = this.context.socket;
  };

  subscribeToGameUpdates = () => {
    this.socket.on(UPDATE_GAME, payload => {
      const { board } = payload;
      this.setState({ board });
    });
  };

  getGame = () => {
    this.socket.emit(GET_GAME);
  };

  restartGame = () => {
    this.socket.emit(RESTART_GAME);
  };

  chooseCard = (row, col) => {
    this.socket.emit(CHOOSE_CARD, { row, col });
  };

  render() {
    const { board, team } = this.state;

    return (
      <View>
        <Text style={styles.optionsTitleText}>
          {team === RED ? "Red Team" : "Blue Team"}
        </Text>
        <Board board={board} chooseCard={this.chooseCard} />
        <TouchableOpacity
          onPress={this.restartGame}
          style={styles.restartGameButton}
        >
          <Text style={styles.restartGameButtonText}>Restart Game</Text>
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
  restartGameButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 25,
    width: 150,
    padding: 10
  },
  restartGameButtonText: {
    textAlign: "center"
  }
});
