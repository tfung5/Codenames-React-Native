import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import uuid from "uuid/v4";
import { RED, BLUE, BLACK, GRAY, CHOSEN, UNCHOSEN } from "../constants/Cards";

const determineCardStyle = card => {
  let style = [styles.boardCard];

  if (card.status === CHOSEN) {
    style.push(styles.boardCardChosen);

    switch (card.color) {
      case RED:
        style.push(styles.boardCardRed);
        break;
      case BLUE:
        style.push(styles.boardCardBlue);
        break;
      case BLACK:
        style.push(styles.boardCardBlack);
        break;
      default:
        style.push(styles.boardCardGray);
        break;
    }
  }

  return style;
};

export default ({ board, chooseCard }) => {
  return (
    <View>
      {board.length > 0 &&
        board.map(row => {
          return (
            <View style={styles.boardRow} key={uuid()}>
              {row.length > 0 &&
                row.map(card => {
                  return (
                    <View key={card.word}>
                      <TouchableOpacity
                        onPress={() => chooseCard(card.row, card.col)}
                      >
                        <Text style={determineCardStyle(card)}>
                          {card.word}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  boardRow: {
    flexDirection: "row"
  },
  boardCard: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    color: "black",
    margin: 2,
    fontFamily: "Courier New",
    fontSize: 12,
    fontWeight: "bold",
    width: 80,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  boardCardBlue: {
    borderColor: "blue",
    backgroundColor: "blue"
  },
  boardCardRed: {
    borderColor: "red",
    backgroundColor: "red"
  },
  boardCardGray: {
    borderColor: "dimgray",
    backgroundColor: "dimgray"
  },
  boardCardBlack: {
    backgroundColor: "black",
    borderColor: "black"
  },
  boardCardChosen: {
    color: "white"
  }
});
