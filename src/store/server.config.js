import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAdxZvjkWUd7qkS0E2IGA8DMW4u3bhR-k",
  authDomain: "bivestcoin.firebaseapp.com",
  projectId: "bivestcoin",
  storageBucket: "bivestcoin.appspot.com",
  messagingSenderId: "15821293887",
  appId: "1:15821293887:web:5a1ba4ec22274c1d2bab8a",
  measurementId: "G-HZMY34ZRZL",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export default getFirestore();
