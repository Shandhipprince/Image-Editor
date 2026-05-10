/**
 * ============================================================
 * IMPERION — Main Application Script
 * Premium Interactions, Animations & Firebase Authentication
 * ============================================================
 */

import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  onAuthStateChanged 
} from './firebase-config.js'

// ============================================================
// 1. DOM READY — WAIT FOR FULL PAGE LOAD
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c🚀 Imperion %cInitialized', 'font-weight:bold;color:#a855f7;', 'color:#94a3b8;')
  initAll()
})

function initAll() {
  initCustomCursor()
  initParticles()
  initNavigation()
  initMobileMenu()
  initScrollAnimations()
  initCounterAnimations()
  initTiltEffect()
  initModalSystem()
  initFirebaseAuth()
  initSmoothScroll()
  initParallaxEffect()
}

// ============================================================
// 2. CUSTOM CURSOR
// ============================================================
function initCustomCursor() {
  const cursor = document.getElementById('customCursor')
  const dot = cursor?.querySelector('.cursor-dot')
  const ring = cursor?.querySelector('.cursor-ring')
  
  if (!cursor || !dot || !ring) return
  
  let mouseX = 0, mouseY = 0
  let dotX = 0, dotY = 0
  let ringX = 0, ringY = 0
  
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    
    // Dot follows instantly
    dot.style.left = mouseX + 'px'
    dot.style.top = mouseY + 'px'
  })
  
  // Ring follows with smooth lag
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15
    ringY += (mouseY - ringY) * 0.15
    ring.style.left = ringX + 'px'
    ring.style.top = ringY + 'px'
    requestAnimationFrame(animateCursor)
  }
  animateCursor()
  
  // Hover effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .tilt-effect, .feature-card, .hero-card, .cta-card, [role="button"]')
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'))
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'))
    el.addEventListener('mousedown', () => cursor.classList.add('click'))
    el.addEventListener('mouseup', () => cursor.classList.remove('click'))
  })
  
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0'
  })
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1'
  })
  
  // Touch devices — hide custom cursor
  if ('ontouchstart' in window) {
    cursor.style.display = 'none'
    document.body.style.cursor = 'auto'
  }
}

// ============================================================
// 3. PARTICLE SYSTEM
// ============================================================
function initParticles() {
  const container = document.getElementById('particlesContainer')
  if (!container) return
  
  const particleCount = 35
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.classList.add('particle')
    
    // Random properties
    const size = Math.random() * 3 + 1
    const startX = Math.random() * 100
    const duration = Math.random() * 15 + 10
    const delay = Math.random() * 10
    const opacity = Math.random() * 0.4 + 0.1
    
    particle.style.cssText = `
      left: ${startX}%;
      bottom: -10px;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${opacity};
      background: ${Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(168,85,247,0.6)'};
    `
    
    container.appendChild(particle)
  }
  
  // Periodically refresh particles to maintain effect
  setInterval(() => {
    const particles = container.querySelectorAll('.particle')
    if (particles.length < particleCount) {
      const particle = document.createElement('div')
      particle.classList.add('particle')
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: -10px;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: 0s;
        opacity: ${Math.random() * 0.4 + 0.1};
        background: rgba(255,255,255,0.7);
      `
      container.appendChild(particle)
    }
    
    // Remove old particles that have finished
    particles.forEach(p => {
      const computedStyle = getComputedStyle(p)
      const transform = computedStyle.transform
      if (transform && transform.includes('-10vh')) {
        p.remove()
      }
    })
  }, 3000)
}

// ============================================================
// 4. NAVIGATION — SCROLL EFFECT
// ============================================================
function initNavigation() {
  const nav = document.getElementById('navbar')
  if (!nav) return
  
  let lastScroll = 0
  let scrollTimeout
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset
    
    // Add scrolled class for background
    if (currentScroll > 50) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }
    
    // Hide/show on scroll direction
    if (currentScroll > lastScroll && currentScroll > 200) {
      nav.style.transform = 'translateY(-100%)'
    } else {
      nav.style.transform = 'translateY(0)'
    }
    
    lastScroll = currentScroll
    
    // Clear timeout
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      nav.style.transform = 'translateY(0)'
    }, 1500)
  })
  
  // Active link highlighting based on scroll position
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.nav__link')
  
  window.addEventListener('scroll', () => {
    let current = ''
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.clientHeight
      
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id')
      }
    })
    
    navLinks.forEach(link => {
      link.style.color = ''
      const href = link.getAttribute('href')
      if (href && href.includes(current) && current !== '') {
        link.style.color = 'var(--color-primary-light)'
      }
    })
  })
}

// ============================================================
// 5. MOBILE MENU
// ============================================================
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle')
  const menu = document.getElementById('mobileMenu')
  const mobileLoginBtn = document.getElementById('mobileLoginBtn')
  const mobileCtaBtn = document.getElementById('mobileCtaBtn')
  
  if (!toggle || !menu) return
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active')
    menu.classList.toggle('active')
    
    const isExpanded = toggle.classList.contains('active')
    toggle.setAttribute('aria-expanded', isExpanded)
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? 'hidden' : ''
  })
  
  // Close menu on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active')
      menu.classList.remove('active')
      toggle.setAttribute('aria-expanded', 'false')
      document.body.style.overflow = ''
    })
  })
  
  // Mobile login button
  mobileLoginBtn?.addEventListener('click', () => {
    toggle.classList.remove('active')
    menu.classList.remove('active')
    document.body.style.overflow = ''
    openLoginModal()
  })
  
  // Mobile CTA button
  mobileCtaBtn?.addEventListener('click', () => {
    toggle.classList.remove('active')
    menu.classList.remove('active')
    document.body.style.overflow = ''
    openLoginModal()
  })
}

// ============================================================
// 6. SCROLL-TRIGGERED ANIMATIONS
// ============================================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]')
  if (animatedElements.length === 0) return
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-animate-delay') || 0
        
        setTimeout(() => {
          entry.target.classList.add('animated')
        }, parseInt(delay))
        
        // Only animate once
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  })
  
  animatedElements.forEach(el => {
    observer.observe(el)
  })
  
  // Trigger hero animations immediately if visible
  setTimeout(() => {
    const heroElements = document.querySelectorAll('.hero [data-animate]')
    heroElements.forEach(el => {
      const delay = el.getAttribute('data-animate-delay') || 0
      setTimeout(() => {
        el.classList.add('animated')
      }, parseInt(delay))
    })
  }, 300)
}

// ============================================================
// 7. COUNTER ANIMATIONS
// ============================================================
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat__number--counter[data-target]')
  if (counters.length === 0) return
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })
  
  counters.forEach(counter => observer.observe(counter))
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'))
  const duration = parseInt(element.getAttribute('data-duration')) || 2000
  const startTime = performance.now()
  
  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(eased * target)
    
    element.textContent = current.toLocaleString()
    
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      element.textContent = target.toLocaleString()
    }
  }
  
  requestAnimationFrame(update)
}

// ============================================================
// 8. TILT EFFECT ON CARDS
// ============================================================
function initTiltEffect() {
  const cards = document.querySelectorAll('.tilt-effect')
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = ((y - centerY) / centerY) * -8
      const rotateY = ((x - centerX) / centerX) * 8
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)'
    })
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease'
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    })
  })
}

// ============================================================
// 9. MODAL SYSTEM
// ============================================================
function initModalSystem() {
  const modal = document.getElementById('loginModal')
  if (!modal) return
  
  const closeBtn = document.getElementById('closeModal')
  const loginForm = document.getElementById('loginForm')
  const googleBtn = document.getElementById('googleSignIn')
  
  // Close button
  closeBtn?.addEventListener('click', closeLoginModal)
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLoginModal()
    }
  })
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeLoginModal()
    }
  })
  
  // Google sign-in
  googleBtn?.addEventListener('click', handleGoogleSignIn)
  
  // Email/password form
  loginForm?.addEventListener('submit', handleEmailSignIn)
  
  // Expose to global scope for other buttons
  window.openLoginModal = openLoginModal
  window.closeLoginModal = closeLoginModal
}

function openLoginModal() {
  const modal = document.getElementById('loginModal')
  if (modal) {
    modal.classList.add('show')
    document.body.style.overflow = 'hidden'
    
    // Focus first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input[type="email"]')
      firstInput?.focus()
    }, 400)
  }
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal')
  if (modal) {
    modal.classList.remove('show')
    document.body.style.overflow = ''
  }
}

// ============================================================
// 10. FIREBASE AUTHENTICATION
// ============================================================
function initFirebaseAuth() {
  // Attach click handlers to all CTA buttons
  const ctaButtons = [
    document.getElementById('ctaBtn'),
    document.getElementById('heroCta'),
    document.getElementById('footerCta'),
    document.getElementById('loginNavBtn')
  ]
  
  ctaButtons.forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault()
      
      // Check if already logged in
      const user = localStorage.getItem('user')
      if (user) {
        window.location.href = '/src/pages/editor.html'
      } else {
        openLoginModal()
      }
    })
  })
  
  // Watch demo button
  document.getElementById('watchDemo')?.addEventListener('click', () => {
    // Scroll to features or show demo video
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  })
  
  // Auth state observer
  onAuthStateChanged(auth, (user) => {
    const loginNavBtn = document.getElementById('loginNavBtn')
    
    if (user) {
      // User is signed in
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Creator',
        email: user.email,
        photo: user.photoURL
      }))
      
      // Update nav button
      if (loginNavBtn) {
        loginNavBtn.innerHTML = `
          <svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>${user.displayName?.split(' ')[0] || 'Account'}</span>
        `
        loginNavBtn.onclick = () => window.location.href = '/src/pages/editor.html'
      }
    } else {
      // User is signed out
      localStorage.removeItem('user')
      
      if (loginNavBtn) {
        loginNavBtn.innerHTML = `
          <svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          <span>Sign In</span>
        `
        loginNavBtn.onclick = openLoginModal
      }
    }
  })
}

// ---- Google Sign-In Handler ----
async function handleGoogleSignIn(e) {
  e?.preventDefault()
  
  const btn = document.getElementById('googleSignIn')
  const originalHTML = btn?.innerHTML
  
  if (btn) {
    btn.innerHTML = '<span class="loading-spinner"></span> Connecting...'
    btn.disabled = true
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider)
    console.log('✅ Google sign-in successful:', result.user.displayName)
    
    localStorage.setItem('user', JSON.stringify({
      uid: result.user.uid,
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL
    }))
    
    closeLoginModal()
    
    // Show success toast
    showToast('Welcome, ' + result.user.displayName?.split(' ')[0] + '! 🎉')
    
    // Redirect after short delay
    setTimeout(() => {
      window.location.href = '/src/pages/editor.html'
    }, 800)
  } catch (error) {
    console.error('❌ Google sign-in error:', error)
    
    if (error.code === 'auth/popup-closed-by-user') {
      // User closed popup — no need to show error
    } else if (error.code === 'auth/cancelled-popup-request') {
      // Multiple popup requests
    } else {
      showToast('Sign-in failed. Please try again.', 'error')
    }
    
    if (btn) {
      btn.innerHTML = originalHTML
      btn.disabled = false
    }
  }
}

// ---- Email/Password Sign-In Handler ----
async function handleEmailSignIn(e) {
  e.preventDefault()
  
  const email = e.target.querySelector('input[type="email"]')?.value
  const password = e.target.querySelector('input[type="password"]')?.value
  const submitBtn = e.target.querySelector('button[type="submit"]')
  
  if (!email || !password) {
    showToast('Please fill in all fields.', 'error')
    return
  }
  
  const originalHTML = submitBtn?.innerHTML
  
  if (submitBtn) {
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Signing in...'
    submitBtn.disabled = true
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    console.log('✅ Email sign-in successful:', result.user.email)
    
    localStorage.setItem('user', JSON.stringify({
      uid: result.user.uid,
      name: result.user.displayName || email.split('@')[0],
      email: result.user.email,
      photo: result.user.photoURL
    }))
    
    closeLoginModal()
    showToast('Welcome back! 🎉')
    
    setTimeout(() => {
      window.location.href = '/src/pages/editor.html'
    }, 800)
  } catch (error) {
    console.error('❌ Email sign-in error:', error)
    
    let message = 'Sign-in failed. Please try again.'
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email. Please sign up first.'
        break
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.'
        break
      case 'auth/invalid-email':
        message = 'Invalid email address.'
        break
      case 'auth/invalid-credential':
        message = 'Invalid credentials. Please check your email and password.'
        break
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later.'
        break
    }
    
    showToast(message, 'error')
    
    if (submitBtn) {
      submitBtn.innerHTML = originalHTML
      submitBtn.disabled = false
    }
  }
}

// ============================================================
// 11. TOAST NOTIFICATION SYSTEM
// ============================================================
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast')
  existing?.remove()
  
  const toast = document.createElement('div')
  toast.classList.add('toast', `toast--${type}`)
  toast.textContent = message
  
  // Style the toast
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    padding: 14px 28px;
    background: ${type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(16,185,129,0.95)'};
    color: white;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 100px;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    backdrop-filter: blur(20px);
    animation: toastSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `
  
  document.body.appendChild(toast)
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'toastSlideDown 0.3s ease-in forwards'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// Add toast animations to stylesheet dynamically
const toastStyles = document.createElement('style')
toastStyles.textContent = `
  @keyframes toastSlideUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes toastSlideDown {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
  }
  .loading-spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 6px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(toastStyles)

// ============================================================
// 12. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href')
      if (targetId === '#') return
      
      const target = document.querySelector(targetId)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
}

// ============================================================
// 13. PARALLAX EFFECT ON BACKGROUND ORBS
// ============================================================
function initParallaxEffect() {
  const orbs = document.querySelectorAll('.bg-orb')
  if (orbs.length === 0) return
  
  document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) - 0.5
    const mouseY = (e.clientY / window.innerHeight) - 0.5
    
    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 30
      const x = mouseX * speed
      const y = mouseY * speed
      
      // Apply gentle parallax
      const currentTransform = getComputedStyle(orb).transform
      orb.style.transform = `translate(${x}px, ${y}px)`
    })
  })
}

// ============================================================
// 14. KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
  // Ctrl+K or Cmd+K — open editor
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    const user = localStorage.getItem('user')
    if (user) {
      window.location.href = '/src/pages/editor.html'
    } else {
      openLoginModal()
    }
  }
  
  // Escape — close modal
  if (e.key === 'Escape') {
    closeLoginModal()
  }
})

// ============================================================
// 15. PERFORMANCE OPTIMIZATION
// ============================================================
// Debounce scroll events
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Reduce animations on low-power devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--duration-fast', '0ms')
  document.documentElement.style.setProperty('--duration-normal', '0ms')
  document.documentElement.style.setProperty('--duration-slow', '0ms')
  document.documentElement.style.setProperty('--duration-slower', '0ms')
}

// ============================================================
// 16. EXPORT FOR GLOBAL ACCESS
// ============================================================
window.Imperion = {
  openLoginModal,
  closeLoginModal,
  showToast,
  version: '3.0.0'
}

console.log('%c✨ Imperion %cv' + window.Imperion.version + ' %cReady', 
  'font-weight:bold;color:#a855f7;', 
  'color:#94a3b8;', 
  'color:#10b981;'
)
console.log('%c💡 Tip: Press Ctrl+K to open the editor', 'color:#64748b;font-style:italic;')