import React from "react";
import io from "socket.io-client";
import { StyleSheet, Image, Text, TextInput, View, AsyncStorage } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default class ChatView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Professor Grezes',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
      user:{
        _id: 1,
        name: 'stella',
        avatar: 'https://placeimg.com/140/140/any',
      }
    };
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
  }

  componentDidMount = () => {
    this.socket = io("http://127.0.0.1:3000");
    this.socket.on("chat message", this.onReceivedMessage);
  };

  /**
   * When the server sends a message to this,
   *store it in this component's state.
   */
  onReceivedMessage(messages) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
 }

 /**
 * When a message is sent, send the message to the server.
 */
  onSend(messages=[]) {
  this.socket.emit('chat message', messages[0]);
}

  render() {
    return (
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderUsernameOnMessage={true}
          showUserAvatar={true}
          user={this.state.user}
        />
    );
  }
}
