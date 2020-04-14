import React, { useState, useEffect } from 'react'
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
import * as Permissions from "expo-permissions";
import * as FaceDetector from 'expo-face-detector';
import { Camera } from "expo-camera";
import Mask from './Mask/index2'

export default function FaceFilterScreen() {
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [faces, setFaces] = useState([]);
    let facees = [];


    useEffect(() => {
        askPermission();
        //console.log('permission is: ',hasCameraPermission);
    }, []);

    const askPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        
        setHasCameraPermission(status === "granted");
    };

    const onFacesDetected = ({ faces }) => {
        //console.log(faces)
        
        setFaces(faces)
    }

    const onFaceDetectionError = (error) => {
        //console.log(error)
    }

    return (
    <View style={styles.flexCenterStyle}>
        {
            hasCameraPermission?
            <>
                <Camera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={{ flex:1,width:400,height:300 }}
                    type={Camera.Constants.Type.front}
                    onFacesDetected={onFacesDetected}
                    onFacesDetectedError={onFaceDetectionError}
                    faceDetectorSettings={{
                        mode: FaceDetector.Constants.Mode.fast,
                        detectLandmarks: FaceDetector.Constants.Landmarks.all,
                        runClassifications: FaceDetector.Constants.Classifications.all,
                        minDetectionInterval: 100,
                        tracking: true,
                      }}
                />
                    {
                        console.log('inside return',faces),
                        faces.map(face => (<Mask key={face.faceID} face={face} />))
                    }
                </>
            :
                <Text>No access to camera</Text>

        }
    </View>
    )
}

const styles = StyleSheet.create({
    cameraStyle : { flex: 1 } ,
    flexCenterStyle : { flex: 1, justifyContent: 'center', alignItems: 'center' }
})