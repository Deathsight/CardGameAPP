import React from 'react'

// Import Text component
import { Text, View } from 'react-native';

import firebase from "firebase/app";
import "firebase/auth";
import db from "../../db.js";

let user = null;

const getUser = async () =>{
  let u = await db.collection('Users').doc(firebase.auth().currentUser.uid).get();
  console.log(u.data());
  user = u.data();
}
getUser();

console.log('props',user);

const Stats = ({
  user:{
    name,
    kills,
    wins,
    mosters
  },
  face: {
    bounds: {
      origin: { x: containerX, y: containerY },
      size: { width: faceWidth }
    },
    leftEyePosition,
    noseBasePosition, // nose position
    bottomMouthPosition, // mouth pos
    rightEyePosition,
    namePosition,
    killsPosition,
    winsPosition,
    monstersPosition,
  }
}) => {
  const eyeWidth = faceWidth / 4
  const pupilWidth = eyeWidth / 5
  // Define nose width
  const noseWidth = eyeWidth;
  const mouthWidth = noseWidth

  const translatedEyePositionX = eyePosition => eyePosition.x - eyeWidth / 2 - containerX
  const translatedEyePositionY = eyePosition => eyePosition.y - eyeWidth / 2 - containerY

  const translatedLeftEyePosition = {
    x: translatedEyePositionX(leftEyePosition),
    y: translatedEyePositionY(leftEyePosition)
  }
  const translatedRightEyePosition = {
    x: translatedEyePositionX(rightEyePosition),
    y: translatedEyePositionY(rightEyePosition)
  }

  const eyeStyle = (eyePosition, eyeBorderWidth = eyeWidth / 10) => ({
    position: 'absolute',
    left: eyePosition.x,
    top: eyePosition.y,
    borderRadius: eyeWidth,
    width: eyeWidth,
    height: eyeWidth,
    borderWidth: eyeBorderWidth,
    borderColor: 'black',
    backgroundColor:'pink'
  });

  const adjustedPupilPosition = coord => coord + eyeWidth / 2 - pupilWidth / 2
  const pupilStyle = (eyePosition) => ({
    position: 'absolute',
    left: adjustedPupilPosition(eyePosition.x),
    top: adjustedPupilPosition(eyePosition.y),
    borderRadius: pupilWidth,
    width: pupilWidth,
    height: pupilWidth,
    backgroundColor:'black'
  });

  // Define style for nose component
  // Set the nose angle according to face angle
  const noseTransformAngle = (
    angleRad = Math.atan(
      (rightEyePosition.y - leftEyePosition.y) /
      (rightEyePosition.x - leftEyePosition.x)
    )
  ) => angleRad * 180 / Math.PI
    
  const noseStyle = () => ({
    fontSize: noseWidth,
    position: 'absolute',
    left: noseBasePosition.x - noseWidth / 2 - containerX,
    top: noseBasePosition.y - noseWidth / 2 - containerY,
    transform: [{ rotate: `${noseTransformAngle()}deg`}]
  })

  const nameTransformAngle = (
    angleRad = Math.atan(
      (rightEyePosition.y - leftEyePosition.y) /
      (rightEyePosition.x - leftEyePosition.x)
    )
  ) => angleRad * 180 / Math.PI
    
  const nameStyle = () => ({
    fontSize: 100,
    position: 'absolute',
    left: noseBasePosition.x - noseWidth / 2 - containerX+20,
    top: noseBasePosition.y - noseWidth / 2 - containerY+20,
    transform: [{ rotate: `${nameTransformAngle()}deg`}]
  })

  // Define style for mouth component
  // Set the mouth angle according to face angle
  const mouthTransformAngle = (
    angleRad = Math.atan(
      (rightEyePosition.y - leftEyePosition.y) /
      (rightEyePosition.x - leftEyePosition.x)
    )
  ) => angleRad * 180 / Math.PI
    
  const mouthStyle = () => ({
    fontSize: mouthWidth,
    position: 'absolute',
    left: bottomMouthPosition.x - mouthWidth / 2 - containerX,
    top: bottomMouthPosition.y - mouthWidth / 2 - containerY,
    transform: [{ rotate: `${mouthTransformAngle()}deg`}]
  })
  
  return (
    user &&
    <View style={{ position: 'absolute', left: containerX, top: containerY }}>
      <View style = {{...eyeStyle(translatedLeftEyePosition)}} />
      <View style = {{...pupilStyle(translatedLeftEyePosition)}} />
      <View style = {{...eyeStyle(translatedRightEyePosition)}} />
      <View style = {{...pupilStyle(translatedRightEyePosition)}} />
      {/* Add nose component */}
      <Text style={{...mouthStyle()}}>🔥</Text>
      <Text style={{...noseStyle()}}>🖤</Text>
  <Text style={{...nameStyle()}}>{name}</Text>
    </View>
  );
};

export default Stats