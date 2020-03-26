import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  CameraRoll
} from "react-native";

import { MonoText } from "../components/StyledText";

import { Camera } from "expo-camera";
//import * as FaceDetector from "expo-face-detector";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "921405b7336b4d13944462b58e6684b7"
});
process.nextTick = setImmediate;

import Auth from "../auth";

export default function HomeScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    askPermission();
  }, []);

  const capturePhoto = async () => {
    const photo = await this.camera.takePictureAsync();
    return photo.uri;
  };

  const resize = async photo => {
    let manipulatedImage = await ImageManipulator.manipulateAsync(
      photo,
      [{ resize: { height: 300, width: 300 } }],
      { base64: true }
    );
    return manipulatedImage.base64;
  };

  const predict = async image => {
    let predictions = await app.models.predict(
      Clarifai.GENERAL_MODEL, // model need to get prediction from
      image
    );
    return predictions;
  };

  const objectDetection = async () => {
    let photo = await capturePhoto();
    let resized = await resize(photo);
    let predictions = await predict(resized);
    //this.setState({ predictions: predictions.outputs[0].data.concepts });
    console.log("predictions", predictions);
  };

  const handleDeleteThings = async () => {
    // const response1 = await app.models.delete("faces1");
    // console.log("deleted model", response1);
    // const response2 = await app.inputs.delete();
    // console.log("deleted inputs", response2);

    Auth.setAllowedIn(false)
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={{ flex: 1 }}
        type={Camera.Constants.Type.front}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "column",
            justifyContent: "flex-end"
          }}
        >
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignItems: "center",
              backgroundColor: "black",
              height: "10%"
            }}
            onPress={objectDetection}
          >
            <Text style={{ fontSize: 30, color: "white", padding: 15 }}>
              Capture Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignItems: "center",
              backgroundColor: "black",
              height: "10%"
            }}
            onPress={handleDeleteThings}
          >
            <Text style={{ fontSize: 30, color: "white", padding: 15 }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/development-mode/"
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes"
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
