import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import uuid from "uuid/v4";
import styles from "../styles/CodenamesStyles";
import { RED, BLUE } from "../components/Codenames";

export default props => {
  const { board, team, setCellStyle } = props;

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
                          onPress={() => setCellStyle(cell.row, cell.col)}
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
};
