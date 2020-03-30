import React, { useContext } from "react";
import SocketContext from "../components/SocketContext";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Board from "../components/Board";
import { RED, BLUE } from "../constants/Cards";
import { FIELD_OPERATIVE, SPYMASTER } from "../constants/Roles";

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
      player: {}
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
      const { currentTeam, board } = payload;
      this.setState({
        currentTeam,
        board
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

  render() {
    const { board, player, currentTeam } = this.state;
    const { name, team, role } = player;

    return (
      <View>
        <Text style={styles.optionsTitleText}>
          You are on {team === RED ? "Red Team" : "Blue Team"}
        </Text>
        <Text style={styles.optionsTitleText}>
          {currentTeam === RED ? "Red Team" : "Blue Team"}'s Turn
        </Text>
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
