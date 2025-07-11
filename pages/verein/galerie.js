// Galerie JavaScript - Neue Version ohne "Alle Bilder"
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const categoryTitle = document.getElementById('current-category-title');
    const categoryDescription = document.getElementById('current-category-description');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentCategory = 'schiessen'; // Standardkategorie
    let currentImageIndex = 0;
    let currentImages = [];

    // Kategorie-Informationen
    const categoryInfo = {
        'schiessen': {
            title: 'Schießsport',
            description: 'Training, Wettkämpfe und verschiedene Schießdisziplinen'
        },
        'gastronomie': {
            title: 'Gastronomie',
            description: 'Unser gemütliches Vereinsheim mit Terrasse'
        },
        'vereinsleben': {
            title: 'Vereinsleben',
            description: 'Gemeinschaft, Events und besondere Momente'
        },
        'vorstand': {
            title: 'Vorstand',
            description: 'Unser engagiertes Führungsteam'
        }
    };

    // Funktion zum Anzeigen einer Kategorie
    function showCategory(category) {
        currentCategory = category;
        
        // Kategorie-Info aktualisieren
        if (categoryInfo[category]) {
            categoryTitle.textContent = categoryInfo[category].title;
            categoryDescription.textContent = categoryInfo[category].description;
        }

        // Alle Items verstecken
        galleryItems.forEach(item => {
            item.style.display = 'none';
            item.classList.remove('fade-in');
        });

        // Nur Items der gewählten Kategorie anzeigen
        const categoryItems = document.querySelectorAll(`[data-category="${category}"]`);
        setTimeout(() => {
            categoryItems.forEach((item, index) => {
                if (item.classList.contains('gallery-item')) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('fade-in');
                    }, index * 100); // Gestaffelte Animation
                }
            });
        }, 200);

        // Aktive Kategorie-Karte markieren
        categoryCards.forEach(card => {
            card.classList.remove('active');
        });
        const activeCard = document.querySelector(`[data-category="${category}"].category-card`);
        if (activeCard) {
            activeCard.classList.add('active');
        }
    }

    // Event Listener für Kategorie-Karten
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            showCategory(category);
        });
    });

    // Lightbox Funktionalität
    function openLightbox(imageSrc, title, description) {
        // Aktuelle Bilder der Kategorie sammeln
        currentImages = Array.from(document.querySelectorAll(`[data-category="${currentCategory}"] .gallery-image`))
            .map(img => ({
                src: img.src,
                title: img.parentElement.parentElement.querySelector('h3').textContent,
                description: img.parentElement.parentElement.querySelector('p').textContent
            }));

        // Index des aktuellen Bildes finden
        currentImageIndex = currentImages.findIndex(img => img.src === imageSrc);

        // Lightbox öffnen
        lightboxImage.src = imageSrc;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Navigation Buttons anzeigen/verstecken
        updateNavigationButtons();
    }

    function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function updateNavigationButtons() {
        lightboxPrev.style.display = currentImageIndex > 0 ? 'block' : 'none';
        lightboxNext.style.display = currentImageIndex < currentImages.length - 1 ? 'block' : 'none';
    }

    function showPreviousImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            const prevImage = currentImages[currentImageIndex];
            lightboxImage.src = prevImage.src;
            lightboxTitle.textContent = prevImage.title;
            lightboxDescription.textContent = prevImage.description;
            updateNavigationButtons();
        }
    }

    function showNextImage() {
        if (currentImageIndex < currentImages.length - 1) {
            currentImageIndex++;
            const nextImage = currentImages[currentImageIndex];
            lightboxImage.src = nextImage.src;
            lightboxTitle.textContent = nextImage.title;
            lightboxDescription.textContent = nextImage.description;
            updateNavigationButtons();
        }
    }

    // Event Listener für Lightbox
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPreviousImage);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

    // Lightbox schließen bei Klick auf Hintergrund
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Tastatur-Navigation für Lightbox
    document.addEventListener('keydown', function(e) {
        if (lightbox && !lightbox.classList.contains('hidden')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });

    // Event Listener für Galerie-Bilder
    document.querySelectorAll('.gallery-image').forEach(img => {
        img.addEventListener('click', function() {
            const galleryInfo = this.parentElement.parentElement.querySelector('.gallery-info');
            if (galleryInfo) {
                const title = galleryInfo.querySelector('h3').textContent;
                const description = galleryInfo.querySelector('p').textContent;
                openLightbox(this.src, title, description);
            }
        });
    });

    // Standardkategorie beim Laden anzeigen
    showCategory(currentCategory);

    // Smooth Scroll für bessere UX
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            setTimeout(() => {
                const galleryGrid = document.getElementById('gallery-grid');
                if (galleryGrid) {
                    galleryGrid.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        });
    });
});

// CSS-Klassen für Animationen
if (!document.querySelector('#gallery-animations')) {
    const style = document.createElement('style');
    style.id = 'gallery-animations';
    style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .gallery-item {
            opacity: 0;
            transform: translateY(20px);
        }
        
        .category-card.active {
            transform: scale(1.02);
            box-shadow: 0 8px 25px rgba(21, 128, 61, 0.3);
        }
    `;
    document.head.appendChild(style);
}
