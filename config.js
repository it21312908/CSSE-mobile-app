import firebase from 'firebase/compat/app';
import { getDatabase } from 'firebase/database';



const firebaseConfig = {
  apiKey: "AIzaSyAI7pJyuua6UNxiVEwF6ydreyk7BvPZHfA",
  authDomain: "reactnativefirestore-1305e.firebaseapp.com",
  databaseURL: "https://reactnativefirestore-1305e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reactnativefirestore-1305e",
  storageBucket: "reactnativefirestore-1305e.appspot.com",
  messagingSenderId: "650885149670",
  appId: "1:650885149670:web:708e07260775c660a8dc27",
  measurementId: "G-11XTNFJBD6"
}

if(firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}



const db = getDatabase();

export {db};
