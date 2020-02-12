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
  }

  componentDidMount = () => {
    this.fillBoard();
  };

  fillBoard = () => {
    let board = [];
    let currLetter = 65;
    for (let i = 0; i < 5; ++i) {
      let currRow = [];
      for (let j = 0; j < 5; ++j) {
        currRow.push(String.fromCharCode(currLetter++));
      }
      board.push(currRow);
    }
    console.log("fillboard's board: ", board);
    this.setState({
      board
    });
  };

  renderBoard = () => {
    const { board } = this.state;
    console.log("board: ", board);
    return (
      <View>
        {board.length > 0 &&
          board.map(row => {
            return (
              <View style={styles.boardRow}>
                {row.map(cell => {
                  return (
                    <View style={styles.boardCell}>
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
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
