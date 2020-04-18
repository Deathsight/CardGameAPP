import React, { Component, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  AppRegistry,
  TextInput,
} from "react-native";
import Constants from "expo-constants";
import * as Speech from "expo-speech";
import { render } from "react-dom";
//import Voice from "react-native-voice";

export default class App extends React.Component {
  state = {
    myComment: "",
  };

  onSpeechResults() {
    this.setState({
      results: e.value,
    });
  }

  speech() {
    Speech.speak({
      text: "Hi, how are you?",
      voice: "en_US",
    });
  }

  speak = (myComment) => {
    var thingToSay = this.state.myComment;
    Speech.speak(thingToSay);
  };

  handleTextChange = (inputText) => {
    this.setState({ myComment: inputText });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.title}>React Native - Text to Speech</Text>
        </View>

        <TextInput
          style={styles.textInputStyle}
          onChangeText={this.handleTextChange}
          placeholder="Enter your comment"
          placeholderTextColor="red"
        />

        <Button title="Press to hear" onPress={this.speak} />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
          }}
        >
          <Text style={styles.textOutputStyle}>{this.state.myComment}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    alignItems: "center",
  },
  Content: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },
  btn: {
    justifyContent: "center",
    flex: 1,
  },
  btnStyle: {
    padding: 10,
    backgroundColor: "#cecece",
    marginBottom: 10,
  },
  textInputStyle: {
    borderColor: "#9a73ef",
    borderWidth: 1,
    height: 60,
    margin: 20,
    padding: 10,
  },
  textOutputStyle: {
    fontSize: 20,
  },
});
