// Gastronomie Seite - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    console.log('🚀 Gastronomie JavaScript loaded successfully!');
    
    // ========== Galerie Lightbox ==========
    function initGalleryLightbox() {
        const galleryImages = document.querySelectorAll('.gastro-gallery img');
        
        if (galleryImages.length === 0) return;
        
        // Erstelle Lightbox Element
        const lightbox = createLightboxElement();
        document.body.appendChild(lightbox);
        
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(img, index, galleryImages));
        });
    }
    
    function createLightboxElement() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-nav">
                    <button class="lightbox-prev">&#10094;</button>
                    <button class="lightbox-next">&#10095;</button>
                </div>
            </div>
        `;
        
        // Lightbox Styles
        lightbox.style.cssText = `
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
        `;
        
        return lightbox;
    }
    
    function openLightbox(img, index, allImages) {
        const lightbox = document.querySelector('.lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Navigation setup
        setupLightboxNavigation(index, allImages);
    }
    
    function setupLightboxNavigation(currentIndex, allImages) {
        const lightbox = document.querySelector('.lightbox');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const lightboxImg = lightbox.querySelector('.lightbox-image');
        
        let currentIdx = currentIndex;
        
        // Close lightbox
        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        closeBtn.onclick = closeLightbox;
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };
        
        // Navigation
        prevBtn.onclick = () => {
            currentIdx = (currentIdx - 1 + allImages.length) % allImages.length;
            lightboxImg.src = allImages[currentIdx].src;
        };
        
        nextBtn.onclick = () => {
            currentIdx = (currentIdx + 1) % allImages.length;
            lightboxImg.src = allImages[currentIdx].src;
        };
        
        // Keyboard navigation
        document.onkeydown = (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        };
    }
    
    // ========== Menü Filter ==========
    function initMenuFilter() {
        const filterButtons = document.querySelectorAll('.menu-filter-btn');
        const menuItems = document.querySelectorAll('.menu-item');
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter menu items
                menuItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'flex';
                        item.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // ========== Reservierung Modal ==========
    function initReservationModal() {
        const reservationBtns = document.querySelectorAll('.reservation-button');
        
        if (reservationBtns.length === 0) return;
        
        reservationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openReservationModal();
            });
        });
    }
    
    function openReservationModal() {
        // Einfache Reservierung - könnte erweitert werden
        const phone = '06897 123456'; // Telefonnummer des Vereins
        const message = encodeURIComponent('Hallo, ich möchte gerne einen Tisch in der Gastronomie reservieren.');
        
        // WhatsApp Link (falls gewünscht) oder Telefon
        if (confirm('Möchten Sie telefonisch reservieren?\n\nTelefon: ' + phone)) {
            window.open('tel:' + phone);
        }
    }
    
    // ========== Öffnungszeiten Highlight ==========
    function highlightCurrentDay() {
        const today = new Date().getDay(); // 0 = Sonntag, 1 = Montag, etc.
        const daysMap = {
            0: 'sonntag',
            1: 'montag',
            2: 'dienstag',
            3: 'mittwoch',
            4: 'donnerstag',
            5: 'freitag',
            6: 'samstag'
        };
        
        const currentDayElement = document.querySelector(`[data-day="${daysMap[today]}"]`);
        if (currentDayElement) {
            currentDayElement.classList.add('current-day');
            currentDayElement.style.backgroundColor = '#f0f9ff';
            currentDayElement.style.fontWeight = 'bold';
        }
    }
    
    // ========== Scroll Animations ==========
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.menu-category, .feature-card, .hours-section');
        
        if (animatedElements.length === 0) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Initialer Zustand
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // ========== Image Lazy Loading ==========
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ========== Initialization ==========
    try {
        initGalleryLightbox();
        initMenuFilter();
        initReservationModal();
        highlightCurrentDay();
        initScrollAnimations();
        initLazyLoading();
        
        console.log('✅ Gastronomie Seite vollständig initialisiert');
    } catch (error) {
        console.error('❌ Fehler bei der Initialisierung der Gastronomie Seite:', error);
    }
});

// ========== CSS Animations ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .lightbox-content {
        position: relative;
        margin: auto;
        display: block;
        width: 90%;
        max-width: 800px;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
    }
    
    .lightbox-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
    }
    
    .lightbox-nav button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.8);
        border: none;
        padding: 10px 15px;
        cursor: pointer;
        font-size: 18px;
        border-radius: 4px;
    }
    
    .lightbox-prev { left: -50px; }
    .lightbox-next { right: -50px; }
`;
document.head.appendChild(style);
