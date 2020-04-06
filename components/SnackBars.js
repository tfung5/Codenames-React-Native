import SnackBar from "react-native-snackbar-component";
import React, { useEffect } from "react";

// Commented here is what is needed before calling SnackBars component
// const [buttonPressed, setButtonPressed] = React.useState(false)
// const pressButton = ((buttonPressed)=>{
//   setButtonPressed(true)
// });

export default ({ visible, setVisible, correct, number }) => {
  React.useEffect(() => {
    if (visible === true) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
  }, [visible]);

  const determineMessage = (correct, number) => {
    if (correct) {
      return "Correct! " + number + " guesses remaining.";
    } else {
      return "Incorrect!";
    }
  };

  const determineBackgroundColor = (correct) => {
    if (correct) {
      return "#d3f5e9"; // Light green
    } else {
      return "#F8B2B2"; // Sundown red
    }
  };

  return (
    <>
      <SnackBar
        visible={visible}
        textMessage={determineMessage(correct, number)}
        backgroundColor={determineBackgroundColor(correct)}
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
    </>
  );
};
