import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Button

} from "react-native";
import { Asset } from "expo-asset";
import { AR } from "expo";
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
import ExpoTHREE, { THREE } from "expo-three";
import * as ThreeAR from "expo-three-ar";
// Let's also import `expo-graphics`
// expo-graphics manages the setup/teardown of the gl context/ar session, creates a frame-loop, and observes size/orientation changes.
// it also provides debug information with `isArCameraStateEnabled`
import { View as GraphicsView } from "expo-graphics";
import { StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import Graphic from './Graphic'
export default function PetScreen() {
  const [move,setMove] =useState(0)

  

  return(
    <View style={{ flex: 1}}>
      <View style={{flex: 8}}>
        <Graphic moveS={move}/>
      </View>
      <View style={{flex: 1}} >

      <Button title="Move" onPress={() =>(setMove(move+1))}/>
      </View>
      
    </View>
    
  )
}

PetScreen.navigationOptions = {
  title: "Pet"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
