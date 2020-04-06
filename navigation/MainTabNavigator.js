import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen, { LobbyScreen, TestScreen } from "../screens/HomeScreen";
import GameScreen from "../screens/GameScreen";
import ChatScreen from "../screens/ChatScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Lobby: LobbyScreen,
    Test: TestScreen,
  },
  { headerMode: "none" }
);

HomeStack.navigationOptions = {
  tabBarVisible: false,
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-home" : "md-home"}
    />
  ),
};

HomeStack.path = "";

const GameStack = createStackNavigator(
  {
    Game: GameScreen,
    Chat: ChatScreen,
  },
  { headerMode: "none" }
);

GameStack.navigationOptions = {
  tabBarLabel: "Game",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={"logo-game-controller-a"} />
  ),
};

GameStack.path = "";

// https://reactnavigation.org/docs/2.x/bottom-tab-navigator/

const routeConfigs = {
  HomeStack,
  GameStack,
};

const bottomTabNavigatorConfig = {
  tabBarOptions: {
    keyboardHidesTabBar: false,
  },
};

const tabNavigator = createBottomTabNavigator(
  routeConfigs,
  bottomTabNavigatorConfig
);

tabNavigator.path = "";

export default tabNavigator;
