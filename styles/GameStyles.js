import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
