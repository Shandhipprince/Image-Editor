/**
 * ============================================================
 * IMPERION GALLERY — Complete Interactive Logic
 * Filtering, Likes, Lightbox, Masonry Layout
 * ============================================================
 */

// ============================================================
// GALLERY DATA — Extended collection with more metadata
// ============================================================
const galleryData = [
    { 
        id: 1, 
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', 
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        title: 'Mountain Majesty', 
        author: 'Elena Torres', 
        avatar: 'ET', 
        category: 'landscape', 
        tags: ['nature', 'mountains', 'sunset'],
        likes: 234, 
        liked: false,
        downloads: 56,
        dateAdded: '2025-05-01',
        description: 'A breathtaking mountain landscape enhanced with Imperion\'s AI sky replacement and color grading tools.',
        featured: true
    },
    { 
        id: 2, 
        src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 
        thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
        title: 'Urban Portrait', 
        author: 'Marcus Chen', 
        avatar: 'MC', 
        category: 'portrait', 
        tags: ['portrait', 'urban', 'street'],
        likes: 189, 
        liked: false,
        downloads: 42,
        dateAdded: '2025-04-28',
        description: 'Street photography enhanced with Imperion\'s AI background blur and tone mapping.',
        featured: false
    },
    { 
        id: 3, 
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500', 
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=350',
        title: 'Abstract Dreams', 
        author: 'Aiko Nakamura', 
        avatar: 'AN', 
        category: 'abstract', 
        tags: ['abstract', 'colorful', 'gradient'],
        likes: 456, 
        liked: true,
        downloads: 89,
        dateAdded: '2025-05-10',
        description: 'Created using Imperion\'s AI generation and style transfer tools.',
        featured: true
    },
    { 
        id: 4, 
        src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=550', 
        thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=380',
        title: 'Gradient Flow', 
        author: 'Sofia Ruiz', 
        avatar: 'SR', 
        category: 'abstract', 
        tags: ['gradient', 'flow', 'colorful'],
        likes: 312, 
        liked: false,
        downloads: 67,
        dateAdded: '2025-04-15',
        description: 'Fluid gradients created with Imperion\'s advanced color manipulation.',
        featured: false
    },
    { 
        id: 5, 
        src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=650', 
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=420',
        title: 'Valley View', 
        author: 'James Wilson', 
        avatar: 'JW', 
        category: 'landscape', 
        tags: ['valley', 'nature', 'green'],
        likes: 567, 
        liked: false,
        downloads: 112,
        dateAdded: '2025-05-05',
        description: 'Enhanced with Imperion\'s HDR processing and detail sharpening.',
        featured: true
    },
    { 
        id: 6, 
        src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=350', 
        thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=250',
        title: 'Studio Light', 
        author: 'Priya Sharma', 
        avatar: 'PS', 
        category: 'portrait', 
        tags: ['studio', 'lighting', 'professional'],
        likes: 145, 
        liked: false,
        downloads: 33,
        dateAdded: '2025-03-20',
        description: 'Professional studio portrait with AI-powered skin retouching.',
        featured: false
    },
    { 
        id: 7, 
        src: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=480', 
        thumbnail: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=340',
        title: 'Neon Nights', 
        author: 'Kai Zhang', 
        avatar: 'KZ', 
        category: 'cyberpunk', 
        tags: ['neon', 'night', 'cyberpunk'],
        likes: 891, 
        liked: true,
        downloads: 178,
        dateAdded: '2025-05-08',
        description: 'Cyberpunk aesthetic created with Imperion\'s style transfer and neon effects.',
        featured: true
    },
    { 
        id: 8, 
        src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=520', 
        thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=360',
        title: 'Cosmic Wave', 
        author: 'Luna Park', 
        avatar: 'LP', 
        category: 'abstract', 
        tags: ['cosmic', 'wave', 'space'],
        likes: 234, 
        liked: false,
        downloads: 45,
        dateAdded: '2025-04-22',
        description: 'Inspired by cosmic phenomena, built with Imperion\'s fractal and wave tools.',
        featured: false
    },
    { 
        id: 9, 
        src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=580', 
        thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
        title: 'Ocean Horizon', 
        author: 'Carlos Mendez', 
        avatar: 'CM', 
        category: 'landscape', 
        tags: ['ocean', 'sunset', 'horizon'],
        likes: 678, 
        liked: false,
        downloads: 134,
        dateAdded: '2025-05-12',
        description: 'Dramatic ocean sunset with Imperion\'s sky enhancement and water reflection tools.',
        featured: true
    },
    { 
        id: 10, 
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=380', 
        thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=280',
        title: 'Golden Hour', 
        author: 'Emma Stone', 
        avatar: 'ES', 
        category: 'portrait', 
        tags: ['golden', 'hour', 'warm'],
        likes: 432, 
        liked: true,
        downloads: 87,
        dateAdded: '2025-05-03',
        description: 'Golden hour portrait with Imperion\'s warmth and glow filters.',
        featured: false
    },
    { 
        id: 11, 
        src: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500', 
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=350',
        title: 'Digital Samurai', 
        author: 'Takeshi Yamamoto', 
        avatar: 'TY', 
        category: 'anime', 
        tags: ['anime', 'samurai', 'digital'],
        likes: 1023, 
        liked: false,
        downloads: 256,
        dateAdded: '2025-05-15',
        description: 'AI-generated anime character with Imperion\'s style transfer from traditional art.',
        featured: true
    },
    { 
        id: 12, 
        src: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=450', 
        thumbnail: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=320',
        title: 'Retro Future', 
        author: 'Nina Petrova', 
        avatar: 'NP', 
        category: 'cyberpunk', 
        tags: ['retro', 'future', 'synthwave'],
        likes: 567, 
        liked: true,
        downloads: 98,
        dateAdded: '2025-04-30',
        description: 'Synthwave aesthetic achieved with Imperion\'s retro filter pack and glow effects.',
        featured: false
    },
    { 
        id: 13, 
        src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=420', 
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300',
        title: 'Sepia Memories', 
        author: 'Ahmed Hassan', 
        avatar: 'AH', 
        category: 'vintage', 
        tags: ['sepia', 'vintage', 'memory'],
        likes: 189, 
        liked: false,
        downloads: 28,
        dateAdded: '2025-03-15',
        description: 'Classic sepia-toned photograph enhanced with Imperion\'s vintage presets.',
        featured: false
    },
    { 
        id: 14, 
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=280',
        title: 'Forest Path', 
        author: 'Yuki Tanaka', 
        avatar: 'YT', 
        category: 'landscape', 
        tags: ['forest', 'path', 'green'],
        likes: 345, 
        liked: false,
        downloads: 72,
        dateAdded: '2025-04-18',
        description: 'Enchanted forest scene with Imperion\'s light ray and fog effects.',
        featured: false
    },
    { 
        id: 15, 
        src: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=550', 
        thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=380',
        title: 'Starry Night AI', 
        author: 'AI Generator', 
        avatar: 'AI', 
        category: 'ai-generated', 
        tags: ['ai', 'starry', 'night'],
        likes: 1567, 
        liked: true,
        downloads: 345,
        dateAdded: '2025-05-18',
        description: 'Fully AI-generated artwork inspired by Van Gogh, created with Imperion\'s text-to-image engine.',
        featured: true
    },
    { 
        id: 16, 
        src: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=480', 
        thumbnail: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=340',
        title: 'Cyber City', 
        author: 'Rex Matrix', 
        avatar: 'RM', 
        category: 'cyberpunk', 
        tags: ['cyber', 'city', 'future'],
        likes: 789, 
        liked: false,
        downloads: 156,
        dateAdded: '2025-05-20',
        description: 'Futuristic cityscape with Imperion\'s cyberpunk filter suite.',
        featured: true
    },
    { 
        id: 17, 
        src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500', 
        thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=350',
        title: 'Color Burst', 
        author: 'Mia Garcia', 
        avatar: 'MG', 
        category: 'abstract', 
        tags: ['color', 'burst', 'vibrant'],
        likes: 234, 
        liked: false,
        downloads: 41,
        dateAdded: '2025-04-25',
        description: 'Explosion of colors using Imperion\'s particle and dispersion effects.',
        featured: false
    },
    { 
        id: 18, 
        src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=360', 
        thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=260',
        title: 'City Portrait', 
        author: 'David Kim', 
        avatar: 'DK', 
        category: 'portrait', 
        tags: ['city', 'portrait', 'urban'],
        likes: 456, 
        liked: true,
        downloads: 92,
        dateAdded: '2025-05-06',
        description: 'Urban fashion portrait with Imperion\'s color grading and texture overlays.',
        featured: false
    },
    { 
        id: 19, 
        src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600', 
        thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=420',
        title: 'Coastal Dawn', 
        author: 'Anna Lindberg', 
        avatar: 'AL', 
        category: 'landscape', 
        tags: ['coastal', 'dawn', 'beach'],
        likes: 321, 
        liked: false,
        downloads: 64,
        dateAdded: '2025-05-02',
        description: 'Peaceful coastal sunrise enhanced with Imperion\'s golden hour presets.',
        featured: false
    },
    { 
        id: 20, 
        src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500', 
        thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=350',
        title: 'AI Dreamscape', 
        author: 'AI Generator', 
        avatar: 'AI', 
        category: 'ai-generated', 
        tags: ['ai', 'dream', 'surreal'],
        likes: 2134, 
        liked: true,
        downloads: 489,
        dateAdded: '2025-05-22',
        description: 'Surreal dreamscape generated entirely with Imperion\'s AI — from text prompt to final render.',
        featured: true
    },
    { 
        id: 21, 
        src: 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=440', 
        thumbnail: 'https://images.unsplash.com/photo-1552083375-1447ce886485?w=310',
        title: 'Vintage Car', 
        author: 'Robert Klein', 
        avatar: 'RK', 
        category: 'vintage', 
        tags: ['car', 'vintage', 'classic'],
        likes: 167, 
        liked: false,
        downloads: 24,
        dateAdded: '2025-02-28',
        description: 'Classic automobile with Imperion\'s vintage film grain and color fading.',
        featured: false
    },
    { 
        id: 22, 
        src: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=520', 
        thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=360',
        title: 'Anime Girl', 
        author: 'Hana Yoshida', 
        avatar: 'HY', 
        category: 'anime', 
        tags: ['anime', 'girl', 'illustration'],
        likes: 892, 
        liked: false,
        downloads: 203,
        dateAdded: '2025-05-14',
        description: 'Anime-style illustration created using Imperion\'s AI art tools and manga filters.',
        featured: true
    },
    { 
        id: 23, 
        src: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=460', 
        thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=330',
        title: 'Liquid Art', 
        author: 'Sara Connor', 
        avatar: 'SC', 
        category: 'abstract', 
        tags: ['liquid', 'art', 'fluid'],
        likes: 198, 
        liked: false,
        downloads: 36,
        dateAdded: '2025-04-10',
        description: 'Fluid art simulation with Imperion\'s liquify and marbling effects.',
        featured: false
    },
    { 
        id: 24, 
        src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=390', 
        thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=280',
        title: 'Night Portrait', 
        author: 'Alex Turner', 
        avatar: 'AT', 
        category: 'portrait', 
        tags: ['night', 'portrait', 'moody'],
        likes: 543, 
        liked: true,
        downloads: 108,
        dateAdded: '2025-05-09',
        description: 'Moody nighttime portrait with Imperion\'s low-light enhancement and noise reduction.',
        featured: true
    }
];

// ============================================================
// DOM ELEMENTS
// ============================================================
const galleryGrid = document.getElementById('galleryGrid');
const filterBar = document.getElementById('filterBar');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxAuthor = document.getElementById('lightboxAuthor');
const lightboxDescription = document.getElementById('lightboxDescription');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxLike = document.getElementById('lightboxLike');
const lightboxDownload = document.getElementById('lightboxDownload');
const toastContainer = document.getElementById('toastContainer');
const searchInput = document.getElementById('gallerySearch');
const sortSelect = document.getElementById('sortSelect');

// ============================================================
// STATE
// ============================================================
let currentFilter = 'all';
let currentSort = 'popular';
let currentSearch = '';
let currentLightboxIndex = 0;
let filteredData = [...galleryData];
let likesMap = JSON.parse(localStorage.getItem('imperion_likes') || '{}');

// Restore likes from localStorage
galleryData.forEach(item => {
    if (likesMap[item.id]) {
        item.liked = true;
        item.likes = Math.max(item.likes, likesMap[item.id]);
    }
});

// ============================================================
// CUSTOM CURSOR
// ============================================================
function initCursor() {
    const cursor = document.getElementById('customCursor');
    const cursorDot = cursor?.querySelector('.cursor-dot');
    const cursorRing = cursor?.querySelector('.cursor-ring');
    
    if (!cursor || !cursorDot || !cursorRing || 'ontouchstart' in window) {
        if (cursor) cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
        return;
    }

    let mx = 0, my = 0, rx = 0, ry = 0;
    
    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top = my + 'px';
    });

    function animateCursor() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top = ry + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveSelectors = 'a, button, .gallery-item, .filter-chip, .lightbox__nav, .gallery-item__like-btn';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        el.addEventListener('mousedown', () => cursor.classList.add('click'));
        el.addEventListener('mouseup', () => cursor.classList.remove('click'));
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
}

// ============================================================
// RENDER GALLERY
// ============================================================
function renderGallery(data) {
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    if (data.length === 0) {
        galleryGrid.innerHTML = `
            <div style="text-align:center;padding:80px 20px;grid-column:1/-1;">
                <div style="font-size:3rem;margin-bottom:16px;">🔍</div>
                <h3 style="font-size:1.3rem;margin-bottom:8px;color:var(--gallery-text);">No results found</h3>
                <p style="color:var(--gallery-text-secondary);">Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }

    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'gallery-item';
        card.setAttribute('data-index', index);
        card.setAttribute('data-id', item.id);
        
        if (item.featured) {
            card.style.border = '1px solid rgba(99,102,241,0.3)';
        }
        
        card.innerHTML = `
            <img class="gallery-item__image" 
                 src="${item.thumbnail || item.src}" 
                 alt="${item.title}" 
                 loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500'">
            ${item.featured ? '<span class="gallery-item__featured-badge">Featured</span>' : ''}
            <button class="gallery-item__like-btn ${item.liked ? 'liked' : ''}" data-id="${item.id}" aria-label="${item.liked ? 'Unlike' : 'Like'}">
                <svg viewBox="0 0 24 24" fill="${item.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
            <div class="gallery-item__overlay">
                <h3 class="gallery-item__title">${item.title}</h3>
                <div class="gallery-item__author">
                    <span class="gallery-item__author-avatar" style="background:${getAvatarColor(item.avatar)}">${item.avatar}</span>
                    ${item.author}
                </div>
                <div class="gallery-item__stats">
                    <span class="gallery-item__stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        ${formatNumber(item.likes)}
                    </span>
                    <span class="gallery-item__stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        ${formatNumber(item.downloads)}
                    </span>
                </div>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.gallery-item__like-btn')) {
                openLightbox(index);
            }
        });

        galleryGrid.appendChild(card);
    });

    // Attach like button handlers
    document.querySelectorAll('.gallery-item__like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            toggleLike(id, btn);
        });
    });
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function getAvatarColor(str) {
    const colors = [
        '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4',
        '#8b5cf6', '#ef4444', '#f472b6', '#34d399', '#fbbf24',
        '#22d3ee', '#a855f7', '#14b8a6', '#e11d48', '#0ea5e9'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ============================================================
// LIKE TOGGLE
// ============================================================
function toggleLike(id, btn) {
    const item = galleryData.find(i => i.id === id);
    if (!item) return;

    item.liked = !item.liked;
    item.likes += item.liked ? 1 : -1;

    // Save to localStorage
    likesMap[id] = item.liked ? item.likes : 0;
    localStorage.setItem('imperion_likes', JSON.stringify(likesMap));

    // Update button
    if (btn) {
        btn.classList.toggle('liked', item.liked);
        btn.querySelector('svg').setAttribute('fill', item.liked ? 'currentColor' : 'none');
    }

    showToast(
        item.liked ? '❤️ Added to favorites!' : 'Removed from favorites',
        item.liked ? 'success' : 'info'
    );
}

// ============================================================
// LIGHTBOX
// ============================================================
function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const item = filteredData[currentLightboxIndex];
    if (!item) return;

    lightboxImage.src = item.src;
    lightboxTitle.textContent = item.title;
    lightboxAuthor.textContent = `by ${item.author}`;
    if (lightboxDescription) {
        lightboxDescription.textContent = item.description || '';
    }

    const likeSvg = lightboxLike?.querySelector('svg');
    if (likeSvg) {
        likeSvg.setAttribute('fill', item.liked ? 'currentColor' : 'none');
    }

    if (lightboxPrev) lightboxPrev.style.opacity = currentLightboxIndex > 0 ? '1' : '0.3';
    if (lightboxNext) lightboxNext.style.opacity = currentLightboxIndex < filteredData.length - 1 ? '1' : '0.3';
}

// Lightbox event listeners
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

lightboxPrev?.addEventListener('click', () => {
    if (currentLightboxIndex > 0) {
        currentLightboxIndex--;
        updateLightbox();
    }
});

lightboxNext?.addEventListener('click', () => {
    if (currentLightboxIndex < filteredData.length - 1) {
        currentLightboxIndex++;
        updateLightbox();
    }
});

lightboxLike?.addEventListener('click', () => {
    const item = filteredData[currentLightboxIndex];
    if (item) {
        toggleLike(item.id);
        updateLightbox();
        renderGallery(filteredData);
    }
});

lightboxDownload?.addEventListener('click', () => {
    const item = filteredData[currentLightboxIndex];
    if (item) {
        const link = document.createElement('a');
        link.href = item.src;
        link.download = item.title.replace(/\s+/g, '-').toLowerCase() + '.jpg';
        link.click();
        showToast('📥 Downloading image...', 'info');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentLightboxIndex > 0) {
        currentLightboxIndex--;
        updateLightbox();
    }
    if (e.key === 'ArrowRight' && currentLightboxIndex < filteredData.length - 1) {
        currentLightboxIndex++;
        updateLightbox();
    }
});

// ============================================================
// FILTERING & SORTING
// ============================================================
function applyFilters() {
    filteredData = galleryData.filter(item => {
        // Category filter
        if (currentFilter !== 'all' && item.category !== currentFilter) return false;
        
        // Search filter
        if (currentSearch && !item.title.toLowerCase().includes(currentSearch.toLowerCase()) &&
            !item.author.toLowerCase().includes(currentSearch.toLowerCase()) &&
            !item.tags.some(tag => tag.toLowerCase().includes(currentSearch.toLowerCase()))) {
            return false;
        }
        
        return true;
    });

    // Sort
    switch (currentSort) {
        case 'popular':
            filteredData.sort((a, b) => b.likes - a.likes);
            break;
        case 'recent':
            filteredData.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'downloads':
            filteredData.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'title':
            filteredData.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }

    currentLightboxIndex = 0;
    renderGallery(filteredData);
}

// Filter chips
filterBar?.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;

    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentFilter = chip.getAttribute('data-filter');
    applyFilters();
});

// Search
searchInput?.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    applyFilters();
});

// Sort
sortSelect?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFilters();
});

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ============================================================
// NAV SCROLL
// ============================================================
window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
});

// ============================================================
// MASONRY LAYOUT REFRESH
// ============================================================
function refreshMasonry() {
    // Force reflow for masonry columns
    if (galleryGrid) {
        galleryGrid.style.display = 'none';
        galleryGrid.offsetHeight;
        galleryGrid.style.display = '';
    }
}

window.addEventListener('resize', refreshMasonry);

// ============================================================
// INITIALIZATION
// ============================================================
function init() {
    initCursor();
    applyFilters();
    
    // Log stats
    const totalLikes = galleryData.reduce((sum, item) => sum + item.likes, 0);
    const featuredCount = galleryData.filter(item => item.featured).length;
    
    console.log('🖼️  Imperion Gallery initialized');
    console.log(`   📸 ${galleryData.length} images loaded`);
    console.log(`   ⭐ ${featuredCount} featured works`);
    console.log(`   ❤️ ${formatNumber(totalLikes)} total community likes`);
    console.log('   🔍 Filter by category, search, or sort by popularity');
    console.log('   💡 Click any image to open the lightbox viewer');
}

// Start the gallery
document.addEventListener('DOMContentLoaded', init);