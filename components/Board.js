import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import uuid from "uuid/v4";
import { RED, BLUE, BLACK, GRAY, CHOSEN, UNCHOSEN } from "../constants/Cards";
import { FIELD_OPERATIVE, SPYMASTER } from "../constants/Roles";

const canChooseCard = (card, player, currentTeam) => {
  return (
    player.role === FIELD_OPERATIVE &&
    player.team === currentTeam &&
    card.state === UNCHOSEN
  );
};

const determineCardStyle = card => {
  let style = [styles.boardCard];

  if (card.color) {
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

const determineCardTextStyle = card => {
  let style = [styles.boardCardText];

  if (card.color) {
    style.push(styles.boardCardTextChosen);
  }

  return style;
};

export default ({ board, player, currentTeam, chooseCard }) => {
  return (
    <View>
      {board.length > 0 &&
        board.map(row => {
          return (
            <View style={styles.boardRow} key={uuid()}>
              {row.length > 0 &&
                row.map(card => {
                  return (
                    <View
                      key={card.word}
                      pointerEvents={
                        canChooseCard(card, player, currentTeam)
                          ? "auto"
                          : "none"
                      }
                    >
                      <TouchableOpacity
                        onPress={() => chooseCard(card.row, card.col)}
                        style={determineCardStyle(card)}
                      >
                        <Text style={determineCardTextStyle(card)}>
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
    margin: 2,
    width: 80,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  boardCardBlue: {
    backgroundColor: "blue"
  },
  boardCardRed: {
    backgroundColor: "red"
  },
  boardCardGray: {
    backgroundColor: "dimgray"
  },
  boardCardBlack: {
    backgroundColor: "black"
  },
  boardCardText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "black"
  },
  boardCardTextChosen: {
    color: "white"
  }
});
