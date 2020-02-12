import React from "react";
import { StyleSheet, Image, Text, View } from "react-native";
import Touchable from "react-native-platform-touchable";

export default class CodenamesView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: []
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
    this.fillBoard();
  };

  fillBoard = () => {
    let board = [];
    let count = 0;
    for (let i = 0; i < 5; ++i) {
      let currRow = [];
      for (let j = 0; j < 5; ++j) {
        currRow.push(this.wordList[count++]);
      }
      board.push(currRow);
    }
    this.setState({
      board
    });
  };

  renderBoard = () => {
    const { board } = this.state;
    return (
      <View>
        {board.length > 0 &&
          board.map(row => {
            return (
              <View style={styles.boardRow} key={row}>
                {row.length > 0 &&
                  row.map(cell => {
                    return (
                      <View style={styles.boardCell} key={cell}>
                        <Text>{cell}</Text>
                      </View>
                    );
                  })}
              </View>
            );
          })}
      </View>
    );
  };

  render() {
    return (
      <View>
        <Text style={styles.optionsTitleText}>Red Team</Text>
        {this.renderBoard()}
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
  }
});
