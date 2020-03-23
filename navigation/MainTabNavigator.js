import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import GameScreen from "../screens/GameScreen";
import ChatScreen from "../screens/ChatScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  { headerMode: "none" }
);

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-home${focused ? "" : "-outline"}`
          : "md-home"
      }
    />
  )
};

HomeStack.path = "";

const GameStack = createStackNavigator(
  {
    Game: GameScreen
  },
  { headerMode: "none" }
);

GameStack.navigationOptions = {
  tabBarLabel: "Game",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={"logo-game-controller-a"} />
  )
};

GameStack.path = "";

const ChatStack = createStackNavigator(
  {
    Chat: ChatScreen
  },
  { headerMode: "none" }
);

ChatStack.navigationOptions = {
  tabBarLabel: "Chat",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-chatbubbles" : "md-chatbubbles"}
    />
  )
};

ChatStack.path = "";

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  GameStack,
  ChatStack
});

tabNavigator.path = "";

export default tabNavigator;
