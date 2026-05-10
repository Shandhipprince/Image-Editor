/**
 * ============================================================
 * IMPERION — Sign Up Script
 * ============================================================
 */

import { 
  auth, 
  googleProvider, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from './firebase-config.js'

// ============================================================
// DOM ELEMENTS
// ============================================================
const signupForm = document.getElementById('signupForm')
const googleSignupBtn = document.getElementById('googleSignup')
const signupName = document.getElementById('signupName')
const signupEmail = document.getElementById('signupEmail')
const signupPassword = document.getElementById('signupPassword')
const signupConfirmPassword = document.getElementById('signupConfirmPassword')

// ============================================================
// GOOGLE SIGN UP
// ============================================================
googleSignupBtn?.addEventListener('click', async () => {
  const originalHTML = googleSignupBtn.innerHTML
  googleSignupBtn.innerHTML = '<span class="auth-spinner"></span> Connecting...'
  googleSignupBtn.disabled = true

  try {
    const result = await signInWithPopup(auth, googleProvider)
    console.log('✅ Google sign-up successful:', result.user.displayName)

    localStorage.setItem('user', JSON.stringify({
      uid: result.user.uid,
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL
    }))

    // Show success briefly then redirect
    googleSignupBtn.innerHTML = '✓ Account created!'
    googleSignupBtn.style.background = '#10b981'
    
    setTimeout(() => {
      window.location.href = '/src/pages/editor.html'
    }, 800)
  } catch (error) {
    console.error('❌ Google sign-up error:', error)
    
    if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      showMessage('Sign-up failed. Please try again.', 'error')
    }
    
    googleSignupBtn.innerHTML = originalHTML
    googleSignupBtn.disabled = false
  }
})

// ============================================================
// EMAIL/PASSWORD SIGN UP
// ============================================================
signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = signupName?.value?.trim()
  const email = signupEmail?.value?.trim()
  const password = signupPassword?.value
  const confirmPassword = signupConfirmPassword?.value

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return showMessage('Please fill in all fields.', 'error')
  }

  if (password !== confirmPassword) {
    return showMessage('Passwords do not match.', 'error')
  }

  if (password.length < 6) {
    return showMessage('Password must be at least 6 characters.', 'error')
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return showMessage('Please enter a valid email address.', 'error')
  }

  const submitBtn = signupForm.querySelector('button[type="submit"]')
  const originalHTML = submitBtn.innerHTML
  submitBtn.innerHTML = '<span class="auth-spinner"></span> Creating account...'
  submitBtn.disabled = true

  try {
    // Create user
    const result = await createUserWithEmailAndPassword(auth, email, password)
    console.log('✅ Account created:', result.user.email)

    // Update profile with name
    await updateProfile(result.user, {
      displayName: name
    })

    // Store user data
    localStorage.setItem('user', JSON.stringify({
      uid: result.user.uid,
      name: name,
      email: result.user.email,
      photo: null
    }))

    // Show success
    submitBtn.innerHTML = '✓ Account Created!'
    submitBtn.style.background = '#10b981'
    
    showMessage('Account created successfully! Redirecting...', 'success')

    setTimeout(() => {
      window.location.href = '/src/pages/editor.html'
    }, 1000)
  } catch (error) {
    console.error('❌ Sign-up error:', error)

    let message = 'Failed to create account. Please try again.'

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists. <a href="/">Sign in instead →</a>'
        break
      case 'auth/invalid-email':
        message = 'Invalid email address.'
        break
      case 'auth/operation-not-allowed':
        message = 'Email/password sign-up is not enabled. Please contact support.'
        break
      case 'auth/weak-password':
        message = 'Password is too weak. Please use a stronger password.'
        break
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection.'
        break
    }

    showMessage(message, 'error')
    submitBtn.innerHTML = originalHTML
    submitBtn.disabled = false
  }
})

// ============================================================
// SHOW MESSAGE
// ============================================================
function showMessage(message, type = 'error') {
  // Remove existing messages
  const existingError = document.querySelector('.auth-error')
  const existingSuccess = document.querySelector('.auth-success')
  existingError?.remove()
  existingSuccess?.remove()

  const div = document.createElement('div')
  div.className = type === 'error' ? 'auth-error' : 'auth-success'
  div.innerHTML = message
  div.classList.add('visible')

  // Insert after the form
  signupForm?.parentNode?.insertBefore(div, signupForm.nextSibling)

  // Auto-remove after 6 seconds
  setTimeout(() => {
    div.classList.remove('visible')
    setTimeout(() => div.remove(), 300)
  }, 6000)
}

console.log('📝 Sign-up page ready')