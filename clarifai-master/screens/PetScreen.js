import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, Button

} from "react-native";
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";



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
import { DiscreteInterpolant } from "three";
export default function PetScreen() {
  const [move,setMove] =useState(-0.5);
  const [attack, setAttack] = useState(false)
  const [enemyAttackTurn, setEnemyAttackTrun] = useState(false)
  const [enemyHealth, setEnemyHealth] = useState(200)
  const [yourHealth, setYourHealth] = useState(200)
  const [allowed,setAllowed] = useState(false)
  const [hero,setHero] = useState(null)
  const [monsterList, setMonsterList] = useState([]);

  useEffect(()=>{
    if(enemyHealth < 0 || yourHealth < 0 ){
      if(enemyHealth < yourHealth){
        updateWins()
        return alert("You won")// win
      }
      if(enemyHealth > yourHealth){
        return alert("You lost")// lose
      }
    }
    if(attack === true || enemyAttackTurn === true){
      let enemyAttack1 = Math.floor(Math.random() * 100);
      let yourAttack1 = Math.floor(Math.random() * 100);
      setEnemyHealth(enemyHealth - yourAttack1)
      setYourHealth(yourHealth - enemyAttack1)
    }
    
  },[attack,enemyAttackTurn])

  useEffect(()=>{
    getMonsterList()
  },[])
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

  const selectCharacter = (character) =>{
    setHero(character)
    setAllowed(true)
  }
  const back = () =>{
    setAllowed(false)
    setEnemyHealth(200)
    setYourHealth(200)
  }
  const updateWins = async () => {
    const info = await db.collection('Users').doc(firebase.auth().currentUser.uid).get()
    let temp = info.data()
    if(temp){
      db.collection('Users').doc(firebase.auth().currentUser.uid).update({wins:temp.wins +1})
    }
  }
  const getMonsterList = async () => {
    db.collection("Users").onSnapshot(querySnapshot => {
      let mahmoudZg = []
      querySnapshot.forEach( doc =>{
        if(doc.id === firebase.auth().currentUser.uid){
          mahmoudZg.push([...doc.data().monsters])
        }
      })
      console.log("mahmoudZg: ",mahmoudZg)
      setMonsterList(mahmoudZg[0])
    })
  }
  return(
    allowed ? 
      <View style={{ flex: 1}}>
        <View style={{flex: 8}}>
          <Graphic moveS={move} attacks={attack} enmeyAtt={enemyAttackTurn} hero={hero}/>
        </View>
        <View style={{flex: 2}} >
        <Text>your health: {yourHealth} / enemy health: {enemyHealth}</Text>
        <Button title="Attack!" onPress={() =>attacks()}/>
        <Button title="Back" onPress={() =>back()}/>
        </View>
      </View>
      :
      <View style={{ flex: 1}}>
        <View>
          <Text style={{fontSize: 30, fontStyle: 'normal'}}>Select your hero</Text>
          {monsterList ?
              <View>
                
                {monsterList.length > 0 ? monsterList.map((n,i) =>
                <Button key={i}title={""+n.name} onPress={() =>selectCharacter(n.k)}/>
                ): <Text>No monsters added yet..</Text>}
              </View>
          :null}
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


{/* <Button title="Spider Man" onPress={() =>selectCharacter("spiderMan")}/>
          <Button title="Donald Trump" onPress={() =>selectCharacter("trump")}/>
          <Button title="Sonic" onPress={() =>selectCharacter("sonic")}/>
          <Button title="Spongy Boby" onPress={() =>selectCharacter("Boby")}/> */}