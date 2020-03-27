import React from "react";
import io from "socket.io-client";
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  AsyncStorage
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { CHAT_MESSAGE, USER_NAME } from "../constants/Actions";
import SocketContext from "../components/SocketContext";

export default class ChatView extends React.Component {
  static contextType = SocketContext;

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

  componentDidMount = async () => {
    await this.saveSocket();
    await this.subscribeToChatMessageUpdates();
    await this.getUserId();
    await this.getUsername();
  };

  saveSocket = () => {
    this.socket = this.context.socket;
  };

  subscribeToChatMessageUpdates = () => {
    this.socket.on(CHAT_MESSAGE, this.onReceivedMessage);
  };

  getUserId = () => {
    let newID = this.socket.id;
    this.state.user._id = newID;
    this.serverUsername();
  }

  serverUsername = () => {
    this.socket.emit(USER_NAME);
  }

  getUsername = () => {
    this.socket.on(USER_NAME, username => {
      this.state.user.name = username ;
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
