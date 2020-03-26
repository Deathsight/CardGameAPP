import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState, useEffect } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppNavigator from "./navigation/AppNavigator";

import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";

import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "921405b7336b4d13944462b58e6684b7"
});
process.nextTick = setImmediate;

import Auth from "./auth";

const resize = async uri => {
  let manipulatedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { height: 300, width: 300 } }],
    { base64: true }
  );
  return manipulatedImage.base64;
};

const makeInput = async base64 => {
  // create new array based on inputs to use below
  const response = await app.inputs.create({
    base64,
    concepts: [{ id: "me" }]
  });
  console.log("response", response);
  return response;
};

const makeModel = async () => {
  const response = await app.models.create("faces2", [{ id: "me" }]);
  console.log("model response", response);
  return response;
};

const trainModel = async () => {
  const response = await app.models.train("faces2");
  console.log("train result", response);
  return response;
};

const predictModel = async base64 => {
  const response = await app.models.predict({ id: "faces2" }, { base64 });
  console.log("predict result", response);
  return response;
};

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [allowedIn, setAllowedIn] = useState(true);
  Auth.init(setAllowedIn);

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    askPermission();
  }, []);

  const [FACES, setFACES] = useState(false); // model
  const [numInputs, setNumInputs] = useState(0); // counting new inputs
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const findModel = async () => {
    try {
      setFACES(await app.models.get("faces2"));
    } catch (error) {
      setFACES(null);
      console.log("faces no model", error);
    }
    console.log("faces model", FACES);
  };

  useEffect(() => {
    findModel();
  }, []);

  const handleFacesDetected = async () => {
    setUploadInProgress(true);
    if (FACES) {
      console.log("faces model already exists", FACES);
      const uri = await capturePhoto();
      const base64 = await resize(uri);
      const predict = await predictModel(base64);
      const result = 1 * predict.outputs[0].data.concepts[0].value;
      console.log(
        " ******* prediction result",
        predict.outputs[0].data.concepts[0].value
      );

      // use predict, check value field of result for high number
      // then set isAllowed or not
      if (result > 0.9) {
        setAllowedIn(true);
      }
    } else {
      console.log("no model, adding an input, number of inputs", numInputs);
      if (numInputs >= 10) {
        console.log("running makeModel and trainModel");
        const response2 = await makeModel();
        const response3 = await trainModel();
        const response4 = await findModel();
        console.log("finished make, train, and find");
      } else {
        const uri = await capturePhoto();
        const base64 = await resize(uri);
        console.log("base64", base64.substring(0, 20));
        const response1 = await makeInput(base64);
        setNumInputs(numInputs + 1);
      }
    }
    setUploadInProgress(false);
  };

  const capturePhoto = async () => {
    const photo = await this.camera.takePictureAsync();
    console.log("uri of photo capture", photo.uri);
    return photo.uri;
  };

  if (FACES === false || (!isLoadingComplete && !props.skipLoadingScreen)) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else if (!allowedIn) {
    // use camera, show the current picture to the user, include a "Take Photo" button
    // -- keep track of how many, after 10?, do train, etc.
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
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              disabled={uploadInProgress}
              style={{
                flex: 1,
                alignSelf: "flex-end",
                alignItems: "center"
              }}
              onPress={handleFacesDetected}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                {console.log(FACES)}
                {FACES ? `Recognize me` : `Take photo ${numInputs + 1}`}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator setAllowedIn={setAllowedIn} />
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
