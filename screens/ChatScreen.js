/**
 * Credit: https://github.com/FaridSafi/react-native-gifted-chat/issues/1272
 * for help fixing the keyboard hiding GiftedChat input
 */

import React from "react";
import { NavigationActions } from "react-navigation";

import CombinedContext from "../components/CombinedContext";
import ProvideCombinedContext from "../components/ProvideCombinedContext";

import { GiftedChat } from "react-native-gifted-chat";
import {
  CHAT_MESSAGE,
  FETCH_PLAYER_INFO,
  GET_MESSAGES,
  SAVE_LATEST_TIME,
  UPDATE_NOTIFICATION,
  UPDATE_PLAYER_INFO,
} from "../constants/Actions";

class ChatScreen extends React.Component {
  static contextType = CombinedContext;

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      user: {
        _id: 1,
        name: "Player",
        avatar: "",
      },
    };
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
  }

  componentDidMount = () => {
    this._isMounted = true;
    if (this.isRedirectToHomeNeeded()) {
      this.navigateToHomeScreen();
    } else {
      this.runSetup();
    }
  };

  componentWillUnmount = () => {
    this._isMounted = false;
    this.updateTimeOfLastReadMessage();
    this.socket.emit(UPDATE_NOTIFICATION);
  };

  updateTimeOfLastReadMessage = () => {
    this.context.GameContext.game.timeOfLastReadMessage = Date.now();
  };

  runSetup = async () => {
    await this.saveSocket();
    await this.subscribeToPlayerUpdates();
    await this.getPlayerInfo();
    await this.subscribeToChatMessageUpdates();
    await this.loadEarlierMessages();
    await this.getMessages();
    await this.updateTimeOfLastReadMessage();
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
        routeName: "Home",
      })
    );
  };

  getMessages = () => {
    this.socket.emit(GET_MESSAGES);
  };

  loadEarlierMessages = () => {
    this.socket.on(GET_MESSAGES, (payload) => {
      for (let i = 0; i < payload.length; i++) {
        this.onReceivedMessage(payload[i]);
      }
    });
  };

  //Get messages
  subscribeToChatMessageUpdates = () => {
    this.socket.on(CHAT_MESSAGE, this.onReceivedMessage);
  };

  getPlayerInfo = () => {
    this.socket.emit(FETCH_PLAYER_INFO);
  };

  subscribeToPlayerUpdates = () => {
    this.socket.on(UPDATE_PLAYER_INFO, (player) => {
      const { id, name } = player;
      if (this._isMounted) {
        this.setState({
          user: {
            _id: id,
            name: name,
          },
        });
      }
    });
  };

  subscribeToGameUpdates = () => {
    this.socket.on(UPDATE_GAME, (payload) => {
      const {
        currentTeam,
        board,
        redCardCounter,
        blueCardCounter,
        guessCounter,
        winningTeam,
      } = payload;
      if (this._isMounted) {
        this.setState({
          currentTeam,
          board,
          redCardCounter,
          blueCardCounter,
          guessCounter,
          winningTeam,
        });
      }
    });
  };

  //When the server sends a message to this, store it in this component's state.
  onReceivedMessage(messages) {
    if (this._isMounted) {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
      this.updateTimeOfLastReadMessage();
    }
  }

  //Send messages
  //When a message is sent, send the message to the server.
  onSend(messages = []) {
    let dateNow = Date.now();
    this.socket.emit(CHAT_MESSAGE, messages[0]);
    this.socket.emit(SAVE_LATEST_TIME, dateNow);
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        renderUsernameOnMessage={true}
        user={this.state.user}
      />
    );
  }
}

const WrappedChatScreen = (props) => {
  return (
    <ProvideCombinedContext>
      <ChatScreen {...props} />
    </ProvideCombinedContext>
  );
};

export default WrappedChatScreen;
