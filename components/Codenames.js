import React from "react";
import { View } from "react-native";
import CodenamesView from "../views/CodenamesView";
import styles from "../styles/CodenamesStyles";

export const RED = "RED";
export const BLUE = "BLUE";

export default class Codenames extends React.Component {
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
    this.setState({
      board: boardCopy
    });
  };

  render() {
    const { board, team } = this.state;

    return (
      <View>
        <CodenamesView
          board={board}
          team={team}
          setCellStyle={this.setCellStyle}
        />
      </View>
    );
  }
}
