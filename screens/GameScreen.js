import React from "react";
import io from "socket.io-client";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Board from "../components/Board";

export const RED = "RED";
export const BLUE = "BLUE";
export const BLACK = "BLACK";
export const GRAY = "GRAY";
export const CHECKED = "CHECKED";
export const UNCHECKED = "UNCHECKED";
const UPDATE_BOARD = "UPDATE_BOARD";
const FETCH_BOARD = "FETCH_BOARD";
const GENERATE_BOARD = "GENERATE_BOARD";

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: [],
      team: RED
    };
  }

  componentDidMount = async () => {
    await this.createSocketConnections();
    await this.fetchBoard();
  };

  createSocketConnections = () => {
    this.socket = io("http://127.0.0.1:3000");
    this.socket.on(UPDATE_BOARD, board => {
      this.setState({ board });
    });
  };

  fetchBoard = () => {
    this.socket.emit(FETCH_BOARD);
  };

  randomizeBoard = () => {
    this.socket.emit(GENERATE_BOARD);
  };

  emitBoard = board => {
    this.socket.emit(UPDATE_BOARD, board);
  };

  markCellChecked = (row, col) => {
    let boardCopy = this.state.board;
    boardCopy[row][col].status = CHECKED;
    this.emitBoard(boardCopy);
  };

  render() {
    const { board, team } = this.state;

    return (
      <View>
        <Text style={styles.optionsTitleText}>
          {team === RED ? "Red Team" : "Blue Team"}
        </Text>
        <Board board={board} markCellChecked={this.markCellChecked} />
        <TouchableOpacity
          onPress={this.randomizeBoard}
          style={styles.randomizeButton}
        >
          <Text style={styles.randomizeButtonText}>Randomize Board</Text>
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
  randomizeButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 25,
    width: 150,
    padding: 10
  },
  randomizeButtonText: {
    textAlign: "center"
  }
});
