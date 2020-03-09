import 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import React, { useContext } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Keyboard
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const userName = {
  name: '',
  setName: () => { }
};
const userContext = React.createContext(userName);

function HomeScreen({ navigation }) {
  const { name, setName } = useContext(userContext);
  // console.log("user: ", user)
  return (

    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2 }}>
        <Text style={{ fontSize: 25 }}>Join Lobby</Text>
      </View>

      <View style={{ flex: 29, flexDirection: 'column', justifyContent: 'center', backgroundColor: '#EAE7F2' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 25 }}>
          <Text style={{ fontSize: 25 }}>Name:</Text>
          <TextInput style={{ backgroundColor: 'white', borderWidth: 2, borderRadius: 10, borderColor: 'lightskyblue', padding: 5, width: 220 }} textAlign={'center'} onChangeText={text => { setName(text) }} value={name} />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ alignItems: 'center', backgroundColor: 'white', borderWidth: 2, borderRadius: 10, width: 250 }} onPress={() => navigation.navigate('LobbyView')}>
            <Text style={{ fontSize: 25 }} onPress={() => navigation.navigate('LobbyView')}>Join Lobby</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function LobbyView({ navigation }) {
  const { name, setName } = useContext(userContext);
  const [redTeam, setRedTeam] = React.useState(new Array(4).fill(null))
  const [blueTeam, setBlueTeam] = React.useState(new Array(4).fill(null))
  const listRedItems = redTeam.map((buttonnum, index) => {
    let slotColor = 'lightgrey'
    let slotName = 'Player Slot'
    let slotBorderColor = 'black'
    if (index === 0) {
      slotName = 'Spymaster Slot'
      slotBorderColor = 'firebrick'
    }
    if (redTeam[index] === null) {
      slotColor = 'white'
    }
    if (redTeam[index] === name) {
      slotColor = '#EDB0A8'
      slotName = name
    }
    return (<TouchableOpacity style={{ backgroundColor: slotColor, borderColor: slotBorderColor, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginHorizontal: '9%', marginVertical: 3 }}
      onPress={() => {
        const redTeamCopy = [...redTeam]
        const blueTeamCopy = [...blueTeam]
        if (redTeam[index] === null) {
          const existingIndexR = redTeam.findIndex((element) => element == name)
          const existingIndexB = blueTeam.findIndex((element) => element == name)
          if (existingIndexR != -1) {
            redTeamCopy[existingIndexR] = null
          }
          if (existingIndexB != -1) {
            blueTeamCopy[existingIndexB] = null
          }
          redTeamCopy[index] = name
        }
        setRedTeam(redTeamCopy)
        setBlueTeam(blueTeamCopy)

      }}>
      <Text style={{ fontSize: 20 }}>{slotName}</Text>
    </TouchableOpacity>
    )
  });
  const listBlueItems = blueTeam.map((buttonnum, index) => {
    let slotColor = 'lightgrey'
    let slotName = 'Player Slot'
    let slotBorderColor = 'black'
    if (index === 0) {
      slotName = 'Spymaster Slot'
      slotBorderColor = 'dodgerblue'
    }
    if (blueTeam[index] === null) {
      slotColor = 'white'
    }
    if (blueTeam[index] === name) {
      slotColor = '#A8A8ED'
      slotName = name
    }
    return (<TouchableOpacity style={{ backgroundColor: slotColor, borderColor: slotBorderColor, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginHorizontal: '9%', marginVertical: 3 }}
      onPress={() => {
        const blueTeamCopy = [...blueTeam]
        const redTeamCopy = [...redTeam]
        if (blueTeam[index] === null) {
          const existingIndexB = blueTeam.findIndex((element) => element == name)
          const existingIndexR = redTeam.findIndex((element) => element == name)
          if (existingIndexB != -1) {
            blueTeamCopy[existingIndexB] = null
          }
          if (existingIndexR != -1) {
            redTeamCopy[existingIndexR] = null
          }
          blueTeamCopy[index] = name
        }
        setRedTeam(redTeamCopy)
        setBlueTeam(blueTeamCopy)
      }}>
      <Text style={{ fontSize: 20 }}>{slotName}</Text>
    </TouchableOpacity>
    )
  });
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2 }}>
        <Text style={{ fontSize: 25 }}>Join a Team</Text>
      </View>

      <View style={{ flex: 29, flexDirection: 'column', alignItem: 'center', justifyContent: 'center', backgroundColor: '#EAE7F2' }}>
        <View style={{ backgroundColor: 'white', borderColor: 'firebrick', borderWidth: 2, borderRadius: 10, marginHorizontal: '9%', padding: 10, marginBottom: 4 }}>
          {listRedItems}
        </View>
        <View style={{ backgroundColor: 'white', borderColor: 'dodgerblue', borderWidth: 2, borderRadius: 10, marginHorizontal: '9%', padding: 10, marginTop: 4 }}>
          {listBlueItems}
        </View>
        <Text style={{ fontSize: 25 }} onPress={() => navigation.navigate('HomeScreen')}>Touch for Home</Text>
      </View>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [name, setName] = React.useState('')
  return (
    <userContext.Provider value={{ name, setName }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="LobbyView" component={LobbyView} />
        </Stack.Navigator>
      </NavigationContainer>
    </userContext.Provider>
  );
}
