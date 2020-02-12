import * as WebBrowser from "expo-web-browser";
import React from "react";
import { StyleSheet, Image, Text, View } from "react-native";
import Touchable from "react-native-platform-touchable";
import { Ionicons } from "@expo/vector-icons";

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
        <Touchable
          style={styles.option}
          background={Touchable.Ripple("#ccc", false)}
          onPress={this._handlePressDocs}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.optionIconContainer}></View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Read the Expo documentation</Text>
            </View>
          </View>
        </Touchable>

        <Touchable
          style={styles.option}
          background={Touchable.Ripple("#ccc", false)}
          onPress={this._handlePressForums}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="ios-chatboxes" size={22} color="#ccc" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>
                Ask a question on the Expo forums
              </Text>
            </View>
          </View>
        </Touchable>
      </View>
    );
  }

  _handlePressDocs = () => {
    WebBrowser.openBrowserAsync("http://docs.expo.io");
  };

  _handlePressForums = () => {
    WebBrowser.openBrowserAsync("http://forums.expo.io");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  },
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12
  },
  optionIconContainer: {
    marginRight: 9
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EDEDED"
  },
  optionText: {
    fontSize: 15,
    marginTop: 1
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
