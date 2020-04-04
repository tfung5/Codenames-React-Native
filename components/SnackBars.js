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

  const isCorrect = correct => {
    if (correct == true) {
      return "Correct";
    }
    return "Wrong";
  };

  return (
    <>
      <SnackBar
        visible={visible}
        textMessage={`${isCorrect(correct)}! ${number} guesses remaining.`}
        backgroundColor={"#d3f5e9"}
        messageColor={"black"}
        containerStyle={{
          borderRadius: 10,
          borderWidth: 0.5,
          marginLeft: 15,
          marginRight: 15
        }}
      />
    </>
  );
};
