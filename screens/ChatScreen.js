import React from "react";
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  AsyncStorage
} from "react-native";
import { NavigationActions } from "react-navigation";

import CombinedContext from "../components/CombinedContext";
import ProvideCombinedContext from "../components/ProvideCombinedContext";

import { GiftedChat } from "react-native-gifted-chat";
import { CHAT_MESSAGE, USER_NAME } from "../constants/Actions";

class ChatScreen extends React.Component {
  static contextType = CombinedContext;

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      user: {
        _id: 1,
        name: "Player",
        avatar: ""
      }
    };
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
  }

  componentDidMount = () => {
    if (this.isRedirectToHomeNeeded()) {
      this.navigateToHomeScreen();
    } else {
      this.runSetup();
    }
  };

  runSetup = async () => {
    await this.saveSocket();
    await this.subscribeToChatMessageUpdates();
    await this.getUserId();
    await this.getUsername();
  };

  saveSocket = () => {
    this.socket = this.context.SocketContext.socket;
  };

  isRedirectToHomeNeeded = () => {
    /**
     * Returns true if there is no game in progress
     * If the user did not come from the LobbyScreen, then there is no game in progress
     */
    return !this.context.GameContext.game.isGameInProgress;
  };

  navigateToHomeScreen = () => {
    this.props.navigation.navigate(
      "HomeStack",
      {},
      NavigationActions.navigate({
        routeName: "Home"
      })
    );
  };

  subscribeToChatMessageUpdates = () => {
    this.socket.on(CHAT_MESSAGE, this.onReceivedMessage);
  };

  getUserId = () => {
    let newID = this.socket.id;
    this.state.user._id = newID;
    this.serverUsername();
  };

  serverUsername = () => {
    this.socket.emit(USER_NAME);
  };

  getUsername = () => {
    this.socket.on(USER_NAME, username => {
      this.state.user.name = username;
    });
  };

  //When the server sends a message to this, store it in this component's state.
  onReceivedMessage(messages) {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages)
      };
    });
  }

  //When a message is sent, send the message to the server.
  onSend(messages = []) {
    this.socket.emit(CHAT_MESSAGE, messages[0]);
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        renderUsernameOnMessage={true}
        user={this.state.user}
      />
    );
  }
}

const WrappedChatScreen = props => {
  return (
    <ProvideCombinedContext>
      <ChatScreen {...props} />
    </ProvideCombinedContext>
  );
};

export default WrappedChatScreen;
