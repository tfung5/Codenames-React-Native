import React, { Component, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Modal,
  Text,
  TouchableHighlight,
  View
} from "react-native";

//Get player team, role, and name as prop
export default ({visible, setVisible, playerInfo}) => {

  const listRedPlayers = () => {
    var redNames = [];
    var redRoles = [];
    let items = Object.values(playerInfo);
    for (const key of items) {
      if (key.team === "RED"){
        redNames.push(<Text style={styles.chartText} key={key.id}>{key.name}</Text>)
        if (key.role === "SPYMASTER"){
          redRoles.push(<Text style={styles.chartText} key={key.id}>Spymaster</Text>)
        }
        else if (key.role === "FIELD_OPERATIVE"){
          redRoles.push(<Text style={styles.chartText} key={key.id}>Player</Text>)
        }
      }
    }
    return(
      <View style={styles.chartRow}>
        <View style={styles.chartColumn}>
          {redNames}
        </View>
        <View style={styles.chartColumn}>
          {redRoles}
        </View>
      </View>
    )
  }

  const listBluePlayers = () => {
    var blueNames = []
    var blueRoles = []
    let items = Object.values(playerInfo);
    for (const key of items) {
      if (key.team === "BLUE"){
        blueNames.push(<Text style={styles.chartText} key={key.id}>{key.name}</Text>)
        if (key.role === "SPYMASTER"){
          blueRoles.push(<Text style={styles.chartText} key={key.id}>Spymaster</Text>)
        }
        else if (key.role === "FIELD_OPERATIVE"){
          blueRoles.push(<Text style={styles.chartText} key={key.id}>Player</Text>)
        }
      }
    }
    return(
      <View View style={styles.chartRow}>
      <View style={styles.chartColumn}>
        {blueNames}
      </View>
      <View style={styles.chartColumn}>
        {blueRoles}
      </View>
      </View>
    )
  }

  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        style={styles.modalBorder}
      >
      <View style={styles.centeredView}>
         <View style={styles.modalView}>
           <View style={styles.chartRow}>
              <View style={{ flex: 1, alignSelf: 'stretch' }}>
                <Text style={styles.modalText}>Red Team </Text>
                {listRedPlayers()}
              </View>
              <View style={{ flex: 1, alignSelf: 'stretch'}}>
                <Text style={styles.modalText}>Blue Team</Text>
                {listBluePlayers()}
              </View>
            </View>
            <TouchableHighlight
             style={styles.openButton}
             onPress={() => setVisible(false)}
            >
            <Text style={styles.textStyle}>Close</Text>
            </TouchableHighlight>
          </View>
       </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    width: 500,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalBorder: {
    borderWidth: 0,
  },
  chartText:{
    marginLeft: 8,
    marginRight: 8,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "center"
  },
  chartRow:{
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 5,
    marginBottom: 5,
  },
  chartColumn:{
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 5,
    marginBottom: 5,
  }
});
