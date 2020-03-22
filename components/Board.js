import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import uuid from "uuid/v4";
import {
  RED,
  BLUE,
  BLACK,
  GRAY,
  CHECKED,
  UNCHECKED
} from "../screens/GameScreen";

const determineCellStyle = cell => {
  if (cell.status === CHECKED) {
    switch (cell.color) {
      case RED:
        return [styles.boardCell, styles.boardCellRed];
      case BLUE:
        return [styles.boardCell, styles.boardCellBlue];
      case BLACK:
        return [styles.boardCell, styles.boardCellBlack];
      default:
        return [styles.boardCell, styles.boardCellGray];
    }
  } else {
    return styles.boardCell;
  }
};

export default ({ board, chooseCard }) => {
  return (
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
                        onPress={() => chooseCard(cell.row, cell.col)}
                      >
                        <Text style={determineCellStyle(cell)}>
                          {cell.word}
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
  boardCell: {
    borderColor: "black",
    borderWidth: 1,
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
  },
  boardCellGray: {
    borderColor: "gray",
    color: "gray"
  },
  boardCellBlack: {
    borderColor: "black",
    color: "black"
  }
});
