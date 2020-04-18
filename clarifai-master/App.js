// bugfix for firebase 7.11.0
import { decode, encode } from "base-64";
global.btoa = global.btoa || encode;
global.atob = global.atob || decode;

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
  TouchableOpacity,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppNavigator from "./navigation/AppNavigator";

import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";

import Clarifai from "clarifai";

import firebase from "firebase/app";
import "firebase/auth";
import db from "./db.js";

import Auth from "./auth";
import { TextInput } from "react-native-gesture-handler";

export default function App(props) {
  const [FACES, setFACES] = useState(false); // model
  const [numInputs, setNumInputs] = useState(0); // counting new inputs
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [allowedIn, setAllowedIn] = useState(false);
  Auth.init(setAllowedIn);
  const [id, setId] = useState("");

  let ref = null;

  const app = new Clarifai.App({
    apiKey: "695d30ba91ae4b68a6abf2ce1a7f3817",
  });
  process.nextTick = setImmediate;

  const resize = async (uri) => {
    let manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { height: 300, width: 300 } }],
      { base64: true }
    );
    return manipulatedImage.base64;
  };

  const makeInput = async (base64) => {
    // create new array based on inputs to use below
    console.log("this is id", id);
    const response = await app.inputs.create({
      base64,
      concepts: [{ id: id }],
    });
    //console.log("response", response);
    return response;
  };

  const makeModel = async () => {
    console.log("this is id", id);

    db.collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .set({ name: id, wins: 0, monsters: [], avatar: "" });

    const response = await app.models.create("faces3", [{ id: id }]);
    //console.log("model response", response);
    return response;
  };

  const trainModel = async () => {
    const response = await app.models.train("faces3");
    //console.log("train result", response);
    return response;
  };

  const predictModel = async (base64) => {
    const response = await app.models.predict({ id: "faces3" }, { base64 });
    //console.log("predict result", response);
    return response;
  };

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    askPermission();
  }, []);

  const findModel = async () => {
    try {
      setFACES(await app.models.get("faces3"));
    } catch (error) {
      setFACES(null);
      //console.log("faces no model", error);
    }
    //console.log("faces model", FACES);
  };

  useEffect(() => {
    findModel();
  }, []);

  const handleFacesDetected = async () => {
    setUploadInProgress(true);
    if (FACES) {
      //console.log("faces model already exists", FACES);
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
      if (result > 0.75) {
        //console.log(FACES);
        setAllowedIn(true);
      }
    } else {
      console.log("no model, adding an input, number of inputs", numInputs);
      if (numInputs >= 10) {
        //console.log("running makeModel and trainModel");
        const response2 = await makeModel();
        const response3 = await trainModel();
        const response4 = await findModel();
        //console.log("finished make, train, and find");
      } else {
        const uri = await capturePhoto();
        const base64 = await resize(uri);
        //console.log("base64", base64.substring(0, 20));
        const response1 = await makeInput(base64);
        setNumInputs(numInputs + 1);
      }
    }
    setUploadInProgress(false);
  };
  const [name, setName] = useState("");
  const capturePhoto = async () => {
    const photo = await this.camera.takePictureAsync();
    console.log("uri of photo capture", photo.uri);
    return photo.uri;
  };

  const handleLogin = async () => {
    let email = `${name}@${name}.com`;
    let password = name;

    await firebase.auth().signInWithEmailAndPassword(email, password);

    let temp = await db
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get();
    console.log(temp.data().name);
    if (temp) {
      if (temp.data().name != name) {
        alert("you dont have a user in the database");
      } else {
        setId(temp.data());
        findModel();
      }
    }
  };

  const handleSubmit = async () => {
    let email = `${name}@${name}.com`;
    let password = name;
    console.log(email);

    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const response = await fetch(
      `https://us-central1-parkingcp3445.cloudfunctions.net/initUser?uid=${
        firebase.auth().currentUser.uid
      }`
    );
    setId(name);
  };

  const handleNewUser = () => {
    setFACES(null);
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
        {id != "" ? (
          <Camera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={Camera.Constants.Type.front}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                disabled={uploadInProgress}
                style={{
                  flex: 1,
                  alignSelf: "flex-end",
                  alignItems: "center",
                }}
                onPress={handleFacesDetected}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  {FACES || numInputs >= 10
                    ? "Recognize me"
                    : `Take photo ${numInputs + 1}`}{" "}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={uploadInProgress}
                style={{
                  flex: 1,
                  alignSelf: "flex-end",
                  alignItems: "center",
                }}
                onPress={handleNewUser}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  {FACES ? `New User?` : null}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        ) : (
          <>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderWidth: 1,
                flex: 1,
              }}
              onChangeText={setName}
              placeholder="What is your Name"
              value={name}
            />
            <Button title="Register" type="outline" onPress={handleSubmit} />
            <Button title="Login" type="outline" onPress={handleLogin} />
          </>
        )}
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
      require("./assets/images/robot-prod.png"),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
    }),
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
    backgroundColor: "#fff",
  },
});
