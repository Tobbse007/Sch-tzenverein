/**
 * Slideshow mit Fade-Effekt für Footer-Bilder
 * Wechselt automatisch durch Bilder mit sanftem Überblendeffekt
 */
document.addEventListener('DOMContentLoaded', function() {
    initFooterSlideshows();
});

/**
 * Initialisiert die Slideshow-Funktion für alle Container mit der Klasse 'slideshow-container'
 */
function initFooterSlideshows() {
    // Liste aller Bilder, die in der Slideshow angezeigt werden sollen
    const allImages = [
        "Schützenverein Gastronomie Terasse 2.jpg",
        "Schützenverein Gastronomie Innen2.jpg",
        "Schützenverein Außenbereich eingang.jpg",
        "Schützenverein mehrere Leute auf der Terasse.jpeg",
        "Schützenverein mehrere Leute auf der Terasse2.jpeg",
        "Schützenverein ortspokal gewinner 2024.jpg",
        "Schützenverein Ortspokal 2024 1.jpg",
        "Vereinsleben1.png",
        "Junge schützen.jpg",
        "Paar schützen.jpg"
    ];

    // Finde alle Slideshow-Container auf der Seite
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    
    slideshowContainers.forEach(container => {
        // Finde das Bilder-Container-Element
        let imageContainer = container.querySelector('.slideshow-images');
        
        // Wenn keine Bilder-Container gefunden wurde, erstelle einen
        if (!imageContainer) {
            imageContainer = document.createElement('div');
            imageContainer.className = 'slideshow-images';
            container.appendChild(imageContainer);
        } else {
            // Entferne alle vorhandenen Bilder
            imageContainer.innerHTML = '';
        }
        
        // Bestimme den relativen Pfad zu den Bildern (basierend auf der aktuellen Seite)
        let basePath = '';
        if (window.location.pathname.includes('/pages/')) {
            basePath = '../../Bilder/';
        } else {
            basePath = 'Bilder/';
        }

        // Füge alle Bilder zum Container hinzu
        allImages.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = basePath + imageSrc;
            img.alt = "Schützenverein Impression";
            img.className = "slideshow-image w-full h-full object-cover";
            img.style.minHeight = "200px";
            
            // Das erste Bild soll aktiv sein
            if (index === 0) {
                img.classList.add('active');
            }
            
            imageContainer.appendChild(img);
        });
        
        // Starte die Slideshow
        const images = imageContainer.querySelectorAll('.slideshow-image');
        if (images.length > 1) {
            startSlideshow(images);
        }
    });
}

/**
 * Startet die Bildwechsel-Animation für die übergebenen Bilder
 * @param {NodeList} images - Die Bilder der Slideshow
 */
function startSlideshow(images) {
    let currentIndex = 0;
    
    // Erste Bild sollte bereits aktiv sein (durch die HTML-Klasse 'active')
      // Wechsle regelmäßig das Bild
    setInterval(() => {
        // Entferne die 'active' Klasse vom aktuellen Bild
        images[currentIndex].classList.remove('active');
        
        // Erhöhe den Index und setze ihn zurück, wenn wir am Ende angekommen sind
        currentIndex = (currentIndex + 1) % images.length;
        
        // Füge die 'active' Klasse zum nächsten Bild hinzu
        images[currentIndex].classList.add('active');
    }, 10000); // Wechsle alle 10 Sekunden
}
