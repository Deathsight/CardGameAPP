import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyAOBu-55oKgLc0CExYLkImFCPvOdGnhgcU",
    authDomain: "persian-turtle.firebaseapp.com",
    databaseURL: "https://persian-turtle.firebaseio.com",
    projectId: "persian-turtle",
    storageBucket: "persian-turtle.appspot.com",
    messagingSenderId: "48851894372",
    appId: "1:48851894372:web:731e5f0a4044f1f72cdf71",
    measurementId: "G-W9JJZJGR67"
});
//firebase.functions()
export default firebase.firestore()