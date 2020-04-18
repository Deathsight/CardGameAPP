import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Button

} from "react-native";
import { Asset } from "expo-asset";
import { AR } from "expo";
// Let's alias ExpoTHREE.AR as ThreeAR so it doesn't collide with Expo.AR.
import ExpoTHREE, { THREE, loadAsync } from "expo-three";
import * as ThreeAR from "expo-three-ar";
// Let's also import `expo-graphics`
// expo-graphics manages the setup/teardown of the gl context/ar session, creates a frame-loop, and observes size/orientation changes.
// it also provides debug information with `isArCameraStateEnabled`
import { View as GraphicsView } from "expo-graphics";
import { StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import Graphic from './Graphic'
export default function PetScreen() {
  const [move,setMove] =useState(-0.5);
  const [attack, setAttack] = useState(false)
  const [enemyAttackTurn, setEnemyAttackTrun] = useState(false)
  const [enemyHealth, setEnemyHealth] = useState(200)
  const [yourHealth, setYourHealth] = useState(200)

  useEffect(()=>{
    if(enemyHealth < 0 || yourHealth < 0 ){
      if(enemyHealth > yourHealth){
        return alert("the enemy killed you")// win
      }
      if(enemyHealth < yourHealth){
        return alert("you killed the enemy")// lose
      }
    }
    if(attack === true || enemyAttackTurn === true){
      let enemyAttack1 = Math.floor(Math.random() * 100);
      let yourAttack1 = Math.floor(Math.random() * 100);
      setEnemyHealth(enemyHealth - yourAttack1)
      setYourHealth(yourHealth - enemyAttack1)
    }
    
  },[attack,enemyAttackTurn])

  const attacks  = () =>{
    setAttack(true)
    const timer = setTimeout(() => {
      if(enemyHealth < 0 || yourHealth < 0 ){
        if(enemyHealth < yourHealth){
          console.log("you killed the enemy")
        }else{
          console.log("enemy killed you")
        }
      }
      setAttack(false);
      console.log("here1")
    }, 1000);
    if(enemyHealth > 0 || yourHealth > 0){
      let time = setTimeout(() =>{
        enmeyAttacks()
      },2000)
    }
  }
  const enmeyAttacks = () =>{
    console.log("here2")
    setEnemyAttackTrun(true)
    const timer1 = setTimeout(() => {
      if(enemyHealth < 0 || yourHealth < 0 ){
        if(enemyHealth < yourHealth){
          console.log("you killed the enemy")
        }else{
          console.log("enemy killed you")
        }
      }
      setEnemyAttackTrun(false);
    }, 2000);
  }


  return(
    <View style={{ flex: 1}}>
      <View style={{flex: 8}}>
        <Graphic moveS={move} attacks={attack} enmeyAtt={enemyAttackTurn}/>
      </View>
      <View style={{flex: 2}} >
      <Text>your health: {yourHealth} / enemy health: {enemyHealth}</Text>
      <Button title="Move Right" onPress={() =>setMove(move+0.2)}/>
      <Button title="Attack!" onPress={() =>attacks()}/>
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
