import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button,Linking,Alert,TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

//firebase
import firebase from "firebase/app";
import "firebase/auth";
import db from "../db.js";



export default function BarCodeScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [hasPermissionMic, sethasPermissionMic] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
 
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    const supported = await Linking.canOpenURL(data);
    console.log(data)
    if (supported) {
      await Linking.openURL(data);
    } else {
      let temp = fetchMonster(data)
      if(temp){
        collectMonster(temp)
      } else {
        Alert.alert('Incorrect QR code')
      }   
    }
    // const response = await fetch(`https://api.barcodelookup.com/v2/products?barcode=${data}&formatted=y&key=r7w70x27axuy3iveqikreebx0061ww`)
    // const json = await response.json()
    // console.log('json', json)
    // alert(`Product is ${json.products[0].product_name}`);
  };

  const collectMonster = async (obj) => {
    let temp = null;
    const response = await db.collection("users").doc(firebase.auth().currentUser.uid).get()
    temp = response
    if(response.monsters.include(obj)){
      Alert.alert(`
        Monster Was detected! i'ts being added to your collection!!!!
        Monster Found: ${obj.name}
      `);
      db.collection("users").doc(firebase.auth().currentUser.uid).update({
        monsters:temp.monsters.push(obj)
      })
    } else {
      Alert.alert('You Already claimed this monster')
    }
  }

  const fetchMonster = async (id) => {
    let temp = false
    const info = await db.collection("QRcodes").where("id", "==", id).get()
    info.forEach(doc => {
      console.log("Monster",doc.data())
      temp = doc.data()
    })
    if(temp && temp != undefined){
      return temp
    } else {
      return false
    }
  }
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end"
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

BarCodeScreen.navigationOptions = {
  title: "BarCode"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
    justifyContent:"center"
  }
});
