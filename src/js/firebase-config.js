/**
 * ============================================================
 * IMPERION — Firebase Configuration
 * ============================================================
 */

import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  updateProfile
} from 'firebase/auth'

// Your Firebase configuration
// Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCGGAZJ0YahVHsv2sIfuo0Y9r99Gij9r4E",
  authDomain: "image-editor-site.firebaseapp.com",
  projectId: "image-editor-site",
  storageBucket: "image-editor-site.firebasestorage.app",
  messagingSenderId: "958806881512",
  appId: "1:958806881512:web:a76a7c71391a154b0d855d"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Auth exports
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Export all auth functions
export { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  updateProfile
}

console.log('🔥 Firebase configured')