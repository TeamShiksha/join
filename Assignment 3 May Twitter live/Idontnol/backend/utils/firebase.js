const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// const firebaseConfig = {
//     apiKey: "AIzaSyC9F7WIMTnYxQcyzJmJCNABsxQ_9J0Z90I",
//     authDomain: "wizzmedia-buzz.firebaseapp.com",
//     projectId: "wizzmedia-buzz",
//     storageBucket: "wizzmedia-buzz.appspot.com",
//     messagingSenderId: "1026346131975",
//     appId: "1:1026346131975:web:89e4ce2977e1721ec280a2",
//     measurementId: "G-NLGEZJM820"
//   };

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };

const app=initializeApp(firebaseConfig);
const db=getFirestore(app);
module.exports = {db};