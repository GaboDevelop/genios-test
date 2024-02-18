import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOof1HHUohw-LvUydnsB4oCvszcW4DFr4",
  authDomain: "genios-test.firebaseapp.com",
  projectId: "genios-test",
  storageBucket: "genios-test.appspot.com",
  messagingSenderId: "91153657829",
  appId: "1:91153657829:web:facdff5fb53d1ff6d3890c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;