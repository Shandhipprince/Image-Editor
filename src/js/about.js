/**
 * ============================================================
 * IMPERION ABOUT PAGE — Interactive Logic
 * Scroll animations, team interactions, timeline reveal
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('📖 Imperion About page initialized');

    // ============================================================
    // CUSTOM CURSOR
    // ============================================================
    const cursor = document.getElementById('customCursor');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorRing = cursor?.querySelector('.cursor-ring');

    if (cursor && cursorDot && cursorRing && !('ontouchstart' in window)) {
        let mx = 0, my = 0, rx = 0, ry = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            cursorDot.style.left = mx + 'px';
            cursorDot.style.top = my + 'px';
        });
        (function anim() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            cursorRing.style.left = rx + 'px';
            cursorRing.style.top = ry + 'px';
            requestAnimationFrame(anim);
        })();
        document.querySelectorAll('a, button, .team-card, .value-card, .timeline-item__content').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    } else if (cursor) {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // ============================================================
    // NAVBAR SCROLL
    // ============================================================
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // ============================================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================================
    const revealElements = document.querySelectorAll(
        '.timeline-item__content, .team-card, .value-card, .hero-stat'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`;
        observer.observe(el);
        
        // Trigger after a short delay for above-the-fold elements
        setTimeout(() => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        }, 300 + index * 80);
    });

    // ============================================================
    // COUNTER ANIMATION FOR STATS
    // ============================================================
    const statNumbers = document.querySelectorAll('.hero-stat__number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const match = text.match(/([\d.]+)([KMB+]?\+?)/);
                
                if (match) {
                    const target = parseFloat(match[1]);
                    const suffix = match[2] || '';
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    function update(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = (eased * target);
                        
                        if (suffix.includes('K')) {
                            el.textContent = current.toFixed(1) + 'K+';
                        } else if (suffix.includes('M')) {
                            el.textContent = current.toFixed(1) + 'M+';
                        } else if (suffix.includes('+')) {
                            el.textContent = Math.floor(current) + '+';
                        } else if (text.includes('/')) {
                            el.textContent = '24/7';
                        } else {
                            el.textContent = Math.floor(current) + suffix;
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            el.textContent = text;
                        }
                    }
                    
                    requestAnimationFrame(update);
                }
                
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ============================================================
    // TEAM CARD INTERACTIONS
    // ============================================================
    document.querySelectorAll('.team-card__social').forEach(social => {
        social.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = social.getAttribute('title') || 'social';
            showToast(`Connecting to ${platform}... 🌐`, 'info');
        });
    });

    // ============================================================
    // TOAST SYSTEM
    // ============================================================
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(16px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    }

    // ============================================================
    // PARALLAX ON ORBS
    // ============================================================
    document.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.about-bg__orb');
        if (orbs.length === 0) return;
        
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 25;
            orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        });
    });

    // ============================================================
    // FUN FACTS ROTATOR
    // ============================================================
    const funFacts = [
        '💡 Imperion processes over 100,000 images daily',
        '🎨 The name "Imperion" means "command" or "empire"',
        '🚀 Our AI models train on 10M+ artistic images',
        '💜 The accent purple was chosen by community vote',
        '🌍 Creators from 140+ countries use Imperion',
        '⚡ Average editing session saves 45 minutes vs traditional tools'
    ];

    let factIndex = 0;
    setInterval(() => {
        factIndex = (factIndex + 1) % funFacts.length;
        // Display could be added to a fun facts section if present
    }, 8000);

    console.log('✅ About page ready — Team of 6, 6 milestones, 6 values');
    console.log('👤 Featured: Shandhip Prince — Founder & CEO');
    console.log(`💡 Fun fact: ${funFacts[0]}`);
});