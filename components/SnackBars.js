import SnackBar from "react-native-snackbar-component";
import React from "react";
import { RED } from "../constants/Cards";

// Commented here is what is needed before calling SnackBars component
// const [buttonPressed, setButtonPressed] = React.useState(false)
// const pressButton = ((buttonPressed)=>{
//   setButtonPressed(true)
// });

export default ({ visible, setVisible, guess, number }) => {
  React.useEffect(() => {
    if (visible === true) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
  }, [visible]);

  const determineMessage = (guess) => {
    const { isGuessCorrect, guesser, guessedWord } = guess;
    let message = "'" + guessedWord + "'" + " was guessed";

    if (guesser) {
      message += " by " + guesser;
    }

    message += ", which is";

    if (isGuessCorrect) {
      message += " correct! " + number + " guesses remaining.";
    } else {
      message += " incorrect!";
    }

    return message;
  };

  const determineBackgroundColor = (guess) => {
    if (guess?.isGuessCorrect) {
      return "#d3f5e9"; // Light green
    } else {
      return "#F8B2B2"; // Sundown red
    }
  };

  return (
    <SnackBar
      visible={visible}
      textMessage={determineMessage(guess)}
      backgroundColor={determineBackgroundColor(guess)}
      messageColor={"black"}
      bottom={15}
      containerStyle={{
        borderRadius: 10,
        borderWidth: 0.5,
        marginLeft: 15,
        marginRight: 15,
      }}
      messageStyle={{
        textAlign: "center",
      }}
    />
  );
};
