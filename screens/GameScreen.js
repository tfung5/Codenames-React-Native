import React from "react";
import io from "socket.io-client";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import uuid from "uuid/v4";

export const RED = "RED";
export const BLUE = "BLUE";
const UPDATE_BOARD = "UPDATE_BOARD";

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: [],
      team: RED
    };

    this.wordList = [
      "Hollywood",
      "Well",
      "Screen",
      "Fair",
      "Play",
      "Tooth",
      "Marble",
      "Staff",
      "Dinosaur",
      "Bill",
      "Cat",
      "Shot",
      "Pitch",
      "King",
      "Bond",
      "Pan",
      "Greece",
      "Square",
      "Deck",
      "Buffalo",
      "Spike",
      "Scientist",
      "Center",
      "Chick",
      "Vacuum",
      "Atlantis",
      "Unicorn",
      "Spy",
      "Undertaker",
      "Mail",
      "Sock",
      "Nut",
      "Loch",
      "Ness",
      "Log",
      "Horse",
      "Pirate",
      "Berlin",
      "Face",
      "Platypus",
      "Stick",
      "Port",
      "Disease",
      "Chest",
      "Yard",
      "Box",
      "Mount",
      "Compound",
      "Slug",
      "Ship",
      "Dice",
      "Watch",
      "Lead",
      "Space",
      "Hook",
      "Flute",
      "Carrot",
      "Tower",
      "Poison",
      "Death",
      "Stock"
    ];
  }

  componentDidMount = () => {
    this.createBoardFromWordList();
    this.createSocketConnections();
  };

  createSocketConnections = () => {
    this.socket = io("http://127.0.0.1:3000");
    this.socket.on(UPDATE_BOARD, board => {
      this.setState({ board });
    });
  };

  emitBoard = board => {
    this.socket.emit(UPDATE_BOARD, board);
  };

  createBoardFromWordList = () => {
    let board = [];
    let count = 0;

    for (let row = 0; row < 5; ++row) {
      let currRow = [];
      for (let col = 0; col < 5; ++col) {
        currRow.push({
          word: this.wordList[count++],
          style: styles.boardCell,
          row,
          col
        });
      }
      board.push(currRow);
    }

    this.setState({
      board
    });
  };

  setCellStyle = (row, col) => {
    let boardCopy = this.state.board;
    if (this.state.team === RED) {
      boardCopy[row][col].style = [styles.boardCell, styles.boardCellRed];
    } else {
      boardCopy[row][col].style = [styles.boardCell, styles.boardCellBlue];
    }
    this.emitBoard(boardCopy);
  };

  render() {
    const { board, team } = this.state;

    return (
      <View>
        <Text style={styles.optionsTitleText}>
          {team === RED ? "Red Team" : "Blue Team"}
        </Text>
        <View>
          {board.length > 0 &&
            board.map(row => {
              return (
                <View style={styles.boardRow} key={uuid()}>
                  {row.length > 0 &&
                    row.map(cell => {
                      return (
                        <View key={cell.word}>
                          <TouchableOpacity
                            onPress={() =>
                              this.setCellStyle(cell.row, cell.col)
                            }
                          >
                            <Text style={cell.style}>{cell.word}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </View>
              );
            })}
        </View>
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
  boardRow: {
    flexDirection: "row"
  },
  boardCell: {
    borderColor: "black",
    borderWidth: 1,
    margin: 2,
    width: 100,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  boardCellText: {
    color: "black"
  },
  boardCellBlue: {
    borderColor: "blue",
    color: "blue"
  },
  boardCellRed: {
    borderColor: "red",
    color: "red"
  }
});
