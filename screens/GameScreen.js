import React from "react";
import io from "socket.io-client";
import { StyleSheet, Text, View } from "react-native";

import Board from "../components/Board";

export const RED = "RED";
export const BLUE = "BLUE";
export const BLACK = "BLACK";
export const GRAY = "GRAY";
export const CHECKED = "CHECKED";
export const UNCHECKED = "UNCHECKED";
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
    this.createSocketConnections();
    this.selectStartTeam();
    this.createBoardFromWordList();
    this.randomizeColorOfCards();
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

  selectStartTeam = () => {
    let startTeam = Math.floor(Math.random()* 2) + 1;
    this.state.team = startTeam === 1 ? RED : BLUE;
  }

  createBoardFromWordList = () => {
    let board = [];
    let count = 0;

    for (let row = 0; row < 5; ++row) {
      let currRow = [];
      for (let col = 0; col < 5; ++col) {
        currRow.push({
          word: this.wordList[count++],
          color: GRAY,
          status: UNCHECKED,
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

  //Randomizing the color of the cards
  randomizeColorOfCards = () => {
    //let boardCopy = this.state.board;
    //boardCopy[1][1].status = CHECKED;
    console.log(this.state.board);
    //this.emitBoard(boardCopy);
  }

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
  }
});
