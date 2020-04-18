import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import BarCodeScreen from "../screens/BarCodeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FaceFilterScreen from "../screens/FaceFilterScreen";
//import ArTesting from "../screens/ArTesting";
import VoiceTesting from "../screens/VoiceTesting";
import SpeechTest from "../screens/SpeechTest";
import PetScreen from "../screens/PetScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
    />
  ),
};

HomeStack.path = "";

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: "Links",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  ),
};

LinksStack.path = "";

const BarCodeStack = createStackNavigator(
  {
    BarCode: BarCodeScreen,
  },
  config
);

BarCodeStack.navigationOptions = {
  tabBarLabel: "BarCode",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  ),
};

BarCodeStack.path = "";
/////////////////////////////////////////////////////////
const PetStack = createStackNavigator(
  {
    PetScreen: PetScreen,
  },
  config
);

PetStack.navigationOptions = {
  tabBarLabel: "Pet",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  ),
};

PetStack.path = "";

/////////////////////////////////////////////////////////

const VoiceTestingStack = createStackNavigator(
  {
    VoiceTesting: VoiceTesting,
  },
  config
);

VoiceTestingStack.navigationOptions = {
  tabBarLabel: "VoiceTesting",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  ),
};

VoiceTestingStack.path = "";

/////////////////////////////////////////////////////////

/*const ArTestingStack = createStackNavigator(
  {
    ArTesting: ArTesting,
  },
  config
);

ArTestingStack.navigationOptions = {
  tabBarLabel: "ArTesting",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  ),
};

ArTestingStack.path = "";*/

/////////////////////////////////////////////////////////

const SpeechTestStack = createStackNavigator(
  {
    SpeechTest: SpeechTest,
  },
  config
);

SpeechTestStack.navigationOptions = {
  tabBarLabel: "SpeechTest",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  ),
};

SpeechTestStack.path = "";
/////////////////////////////////////////////////////////

const FaceFilterStack = createStackNavigator(
  {
    FaceFilter: FaceFilterScreen,
  },
  config
);

FaceFilterStack.navigationOptions = {
  tabBarLabel: "FaceFilter",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  ),
};

FaceFilterStack.path = "";

/////////////////////////////////////////////////////////
const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  ),
};

SettingsStack.path = "";

const tabNavigator = createBottomTabNavigator({
  // HomeStack,
  // LinksStack,
  BarCodeStack,
  // SettingsStack,
  PetStack,
  FaceFilterStack,

  //ArTestingStack,
  // SpeechTestStack,
  // VoiceTestingStack
});

tabNavigator.path = "";

export default tabNavigator;
