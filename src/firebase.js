import firebase from "firebase";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyAaS40woQ6w3aelS2N6L34RzbGKgpXFN2E",
  authDomain: "chatbot-luisa.firebaseapp.com",
  projectId: "chatbot-luisa",
  storageBucket: "chatbot-luisa.appspot.com",
  messagingSenderId: "645471949425",
  appId: "1:645471949425:web:53afe02b91c7e6af6fc1d0",
  measurementId: "G-QSZ48B0C2Q",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
const storage = firebase.storage();

export { storage };
