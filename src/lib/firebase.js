import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBsJkv2ruObmiXynB0SFZv7ZqhySbZ2UEE",
  authDomain: "aruna-1cfc9.firebaseapp.com",
  projectId: "aruna-1cfc9",
  storageBucket: "aruna-1cfc9.firebasestorage.app",
  messagingSenderId: "1073583086865",
  appId: "1:1073583086865:web:3e20995d663b45caffc0b0",
  measurementId: "G-ZZTV5LDJQ5"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
