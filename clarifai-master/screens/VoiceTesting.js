import React, { useState, useEffect } from 'react'
import {
  StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform,
} from 'react-native'
import { FileSystem } from 'expo'
import * as Permissions from "expo-permissions";
import { Audio } from 'expo-av';

import axios from 'axios'

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1e88e5',
    paddingVertical: 20,
    width: '90%',
    alignItems: 'center',
    borderRadius: 5,
    padding: 8,
    marginTop: 20,
  },
  text: {
    color: '#fff',
  }
})

export default function SpeechToTextButton() {
    const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      }

      const [isRecording, setIsRecording] = useState(false);
      let recording = null;

      const startRecording = async () => {
          console.log('started');
        // request permissions to record audio
        const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        // if the user doesn't allow us to do so - return as we can't do anything further :(
        if (status !== 'granted') return
        // when status is granted - setting up our state
        setIsRecording(true) 
      
        // basic settings before we start recording,
        // you can read more about each of them in expo documentation on Audio
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: true,
        })
        const rec = new Audio.Recording()
        
        try {
          // here we pass our recording options
          await rec.prepareToRecordAsync(recordingOptions)
          // and finally start the record
          await rec.startAsync()
        } catch (error) {
            console.log('stops here');
            console.log(error)
          // we will take a closer look at stopRecording function further in this article
        //   stopRecording()
        }
      
        // if recording was successful we store the result in variable, 
        // so we can refer to it from other functions of our component
        console.log('recodingggg',rec);
        recording = rec
      }

    const ENCODING = 'LINEAR16';
    const SAMPLE_RATE_HERTZ = 41000;
    const LANGUAGE = 'en-US';

    const [isFetching, setIsFetching] = useState(false);
    const [query, setQuery] = useState(false);


    getTranscription = async () => {
        setIsFetching(true);
        try {
          const info = await FileSystem.getInfoAsync(recording.getURI());
          console.log(`FILE INFO: ${JSON.stringify(info)}`);
          const uri = info.uri;
          const formData = new FormData();
          formData.append('file', {
            uri,
            type: 'audio/x-wav',
            // could be anything 
            name: 'speech2text'
          });
          const response = await fetch(config.CLOUD_FUNCTION_URL, {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
         setQuery(data.transcript);
        } catch(error) {
          console.log('There was an error', error);
          stopRecording();
          resetRecording();
        }
        setIsFetching(false);
      }



      const stopRecording = async () => {
          console.log('stopped')
        // set our state to false, so the UI knows that we've stopped the recording
        setIsRecording(false) 
        try {
          // stop the recording
          getTranscription()
          await recording.stopAndUnloadAsync()
        } catch (error) {
          console.log(error)
        }
      }

    return (
      <View style={styles.container}>
        <TouchableOpacity 
            onPress={startRecording}
            style={styles.button}
            >
            <Text style={styles.text}>
                <Text style={styles.text}>
                Start recording
                </Text>
            </Text>
        </TouchableOpacity>
        <TouchableOpacity 
            onPress={stopRecording}
            style={styles.button}
            >
            <Text style={styles.text}>
                <Text style={styles.text}>
               stop Recording
                </Text>
            </Text>
        </TouchableOpacity>
      </View>
    )
  
};