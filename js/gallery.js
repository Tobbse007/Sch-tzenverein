// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery variables
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Select gallery elements
    const gallery = document.querySelector('.gallery-wrapper');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const totalItems = galleryItems.length;
    const btnPrev = document.querySelector('.gallery-prev');
    const btnNext = document.querySelector('.gallery-next');
    
    // Lightbox elements
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
      // Calculate visible slides based on screen width
    function getVisibleSlides() {
        // Auf Bildschirmen über 1200px Breite immer genau 4 Bilder anzeigen
        if (window.innerWidth > 1200) return 4; // Large screens
        if (window.innerWidth > 768) return 3; // Medium screens
        if (window.innerWidth > 480) return 2; // Tablets
        return 1; // Smartphones
    }
      // Initialize gallery
    function initGallery() {
        // Prüfen der Gallery-Items und Fehlerkorrektur
        if (totalItems === 0) {
            console.error('Keine Bilder in der Galerie gefunden.');
            return;
        }
        
        // Starte mit versteckter Galerie, um Flackern zu vermeiden
        if (gallery) {
            gallery.style.opacity = '0';
            gallery.style.transition = 'opacity 0.3s ease';
        }
        
        // Stelle sicher, dass alle Bilder geladen sind
        let loadedImages = 0;
        const imagesToLoad = [];
        
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                imagesToLoad.push(img);
                
                if (img.complete && img.naturalWidth !== 0) {
                    loadedImages++;
                } else {
                    img.onload = () => {
                        loadedImages++;
                        if (loadedImages === imagesToLoad.length) {
                            // Alle Bilder sind geladen
                            setupGallery();
                        }
                    };
                    img.onerror = () => {
                        console.error(`Fehler beim Laden des Bildes: ${img.src}`);
                        // Versuche mit .jpg oder .jpeg Extension neu zu laden
                        if (!img.src.match(/\.(jpg|jpeg|png|gif)$/i)) {
                            const newSrc = img.src + '.jpeg';
                            console.log(`Versuche mit Dateierweiterung neu zu laden: ${newSrc}`);
                            img.src = newSrc;
                        } else {
                            loadedImages++;
                            if (loadedImages === imagesToLoad.length) {
                                setupGallery();
                            }
                        }
                    };
                }
            }
        });          // Für eine unendlich rotierende Galerie klonen wir die ersten und letzten Elemente
        // um einen nahtlosen Übergang zu ermöglichen
        if (gallery && totalItems > 0) {
            const visibleSlides = getVisibleSlides();
            // Verdoppele die Anzahl der Klone für größere Bildschirme, um weichere Übergänge zu garantieren
            const numClones = Math.max(visibleSlides, Math.min(totalItems, visibleSlides * 2));
            
            // Füge geklonte Elemente für unendliches Scrollen hinzu - Erste Elemente am Ende
            for (let i = 0; i < numClones; i++) {
                // Modulo-Operation stellt sicher, dass wir gültige Indizes verwenden, 
                // auch wenn mehr Klone als Elemente benötigt werden
                const originalIndex = i % totalItems;
                const clone = galleryItems[originalIndex].cloneNode(true);
                clone.classList.add('gallery-item-clone');
                gallery.appendChild(clone);
            }
            
            // Füge geklonte Elemente für unendliches Scrollen hinzu - Letzte Elemente am Anfang
            // Beginne vom Ende der Original-Elemente und nimm entsprechend viele
            const lastGroupItems = [];
            for (let i = 0; i < numClones; i++) {
                const originalIndex = (totalItems - 1 - i) % totalItems;
                lastGroupItems.push(galleryItems[originalIndex]);
            }
            
            // Füge die geklonten letzten Elemente am Anfang hinzu
            lastGroupItems.forEach(item => {
                const clone = item.cloneNode(true);
                clone.classList.add('gallery-item-preclone');
                gallery.insertBefore(clone, gallery.firstChild);
            });
        }
        
        // Falls keine Bilder zu laden sind oder alle bereits geladen sind
        if (loadedImages === imagesToLoad.length) {
            setupGallery();
        }
        
        // Sicherheits-Timeout - Galerie nach 3 Sekunden zeigen, auch wenn nicht alle Bilder geladen sind
        setTimeout(() => {
            if (gallery && gallery.style.opacity === '0') {
                console.log('Timeout: Galerie wird angezeigt, obwohl nicht alle Bilder geladen wurden.');
                setupGallery();
            }
        }, 3000);
    }
      // Galerie einrichten, nachdem Bilder geladen sind
    function setupGallery() {
        // Alle Bilder zunächst unsichtbar setzen
        galleryItems.forEach(item => {
            item.style.opacity = '0';
        });
        
        // Set initial position without animation
        updateGalleryPosition(false);
        
        // Zeige die Galerie, nachdem die Slides positioniert wurden
        if (gallery) {
            setTimeout(() => {
                gallery.style.opacity = '1';
                // Nur die aktuell sichtbaren Bilder einblenden
                updateImageOpacities();
            }, 50);
        }
        
        // Start automatic slideshow
        startSlideshow();
        
        // Add event listeners for controls
        if (btnPrev) btnPrev.addEventListener('click', prevSlide);
        if (btnNext) btnNext.addEventListener('click', nextSlide);
        
        // Add touch events for mobile swipe
        if (gallery) {
            gallery.addEventListener('touchstart', handleTouchStart);
            gallery.addEventListener('touchend', handleTouchEnd);
            gallery.addEventListener('touchmove', function(e) {
                // Verhindere vertikales Scrollen während des horizontalen Swipens
                if (Math.abs(touchStartX - e.changedTouches[0].screenX) > 10) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            // Aktualisiere die Opazitäten bei Scroll-Events und Animation-Ende
            gallery.addEventListener('transitionstart', updateImageOpacities);
            gallery.addEventListener('transitionend', updateImageOpacities);
        }
        
        // Add click events to gallery images
        galleryItems.forEach((item, index) => {
            const image = item.querySelector('.gallery-image');
            if (image) {
                image.addEventListener('click', () => openLightbox(index));
            }
        });
        
        // Add lightbox event listeners
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
        if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox('next'));
        
        // Add keyboard event listeners for lightbox navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Close lightbox when clicking outside the content
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
          // Update on window resize with debounce to prevent excessive calculations
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Berechne neue Position nach Größenänderung
                updateGalleryPosition(false);
                // Aktualisiere auch die Opazitäten der Bilder
                updateImageOpacities();
            }, 100);
        });
    }
    
    // Start automatic slideshow
    function startSlideshow() {
        // Clear any existing interval
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        
        // Set new interval - slides every 5 seconds
        slideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }    // Navigate to the previous slide
    function prevSlide() {
        if (isTransitioning) return;
        
        // Reset the slideshow timer when manually navigating
        resetSlideshow();
        
        const visibleSlides = getVisibleSlides();
        const currentGroupIndex = Math.floor(currentSlide / visibleSlides);
        const totalGroups = Math.ceil(totalItems / visibleSlides);
        
        // Berechne die vorherige Slide-Position
        if (currentSlide === 0) {
            isTransitioning = true;
            
            // Stelle sicher, dass letzte Bilder auch am Anfang kloniert werden
            let hasPreClones = gallery.querySelectorAll('.gallery-item-preclone').length > 0;
            
            if (!hasPreClones) {
                // Klone letzte Gruppe und füge sie vor dem ersten Element ein
                const lastGroupItems = Array.from(galleryItems).slice(-visibleSlides);
                lastGroupItems.reverse().forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.classList.add('gallery-item-preclone');
                    gallery.insertBefore(clone, gallery.firstChild);
                });
                
                // Nach dem Einfügen neuer Elemente am Anfang müssen wir den aktuellen Index anpassen
                currentSlide = visibleSlides;
                gallery.style.transition = 'none';
                updateGalleryPosition(false);
            }
            
            // Gehe einen Schritt nach links zu den geklonten letzten Elementen
            setTimeout(() => {
                gallery.style.transition = 'transform 0.8s ease';
                currentSlide = -visibleSlides;
                updateGalleryPosition(true);
                
                // Nach der Animation zurück zum echten Ende
                setTimeout(() => {
                    gallery.style.transition = 'none';
                    const lastGroupIndex = totalGroups - 1;
                    currentSlide = lastGroupIndex * visibleSlides;
                    updateGalleryPosition(false);
                    
                    // Wichtig: Warten bis DOM aktualisiert ist, bevor Stile angepasst werden
                    requestAnimationFrame(() => {
                        updateImageOpacities(); // Aktualisiere Opazitäten ohne Animation
                        
                        setTimeout(() => {
                            isTransitioning = false;
                            gallery.style.transition = 'transform 0.8s ease';
                        }, 50);
                    });
                }, 800);
            }, 20);
            
            return;
        } else {
            // Sonst exakt eine Gruppe zurück
            const prevGroupIndex = currentGroupIndex - 1;
            currentSlide = Math.max(0, prevGroupIndex * visibleSlides);
            // Update gallery position with animation
            updateGalleryPosition(true);
        }
        
        // Kontinuierlich Opazität während der Animation aktualisieren
        let startTime = Date.now();
        function updateDuringScroll() {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < 800) { // Während der gesamten Animations-Dauer
                updateImageOpacities();
                requestAnimationFrame(updateDuringScroll);
            } else {
                updateImageOpacities(); // Finale Aktualisierung
            }
        }
        requestAnimationFrame(updateDuringScroll);
    }// Navigate to the next slide
    function nextSlide() {
        if (isTransitioning || totalItems <= getVisibleSlides()) return;
        
        // Reset the slideshow timer when manually navigating
        resetSlideshow();
        
        const visibleSlides = getVisibleSlides();
        const totalGroups = Math.ceil(totalItems / visibleSlides);
        const lastGroupIndex = totalGroups - 1;
        const currentGroupIndex = Math.floor(currentSlide / visibleSlides);
        
        // Wenn wir am Ende sind, den ersten Slide direkt nach dem letzten positionieren
        if (currentGroupIndex >= lastGroupIndex) {
            // Wir sind am Ende der Galerie
            isTransitioning = true;
            
            // Stelle sicher, dass erste Bilder auch am Ende kloniert werden
            // um einen nahtlosen Übergang zu ermöglichen
            let hasClones = gallery.querySelectorAll('.gallery-item-clone').length > 0;
            
            if (!hasClones) {
                // Klone erste Gruppe und hänge sie an
                const firstGroupItems = Array.from(galleryItems).slice(0, visibleSlides);
                firstGroupItems.forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.classList.add('gallery-item-clone');
                    gallery.appendChild(clone);
                });
            }
            
            // Schiebe zu den geklonten ersten Elementen, die nach den letzten platziert sind
            currentSlide = totalItems;
            updateGalleryPosition(true);
            
            // Nach der Animation zurück zum echten Start ohne Animation
            setTimeout(() => {
                gallery.style.transition = 'none';
                currentSlide = 0;
                updateGalleryPosition(false);
                
                // Wichtig: Wir müssen warten, bis die Position aktualisiert ist,
                // bevor wir die Transition wieder aktivieren
                requestAnimationFrame(() => {
                    updateImageOpacities(); // Aktualisiere Opazitäten ohne Animation
                    
                    setTimeout(() => {
                        isTransitioning = false;
                        gallery.style.transition = 'transform 0.8s ease';
                    }, 50);
                });
            }, 800);
        } else {
            // Normal zur nächsten Gruppe
            currentSlide = (currentGroupIndex + 1) * visibleSlides;
            // Starte Animation für Position
            updateGalleryPosition(true);
        }
        
        // Kontinuierlich Opazität während der Animation aktualisieren
        let startTime = Date.now();
        function updateDuringScroll() {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < 800) { // Während der gesamten Animations-Dauer
                updateImageOpacities();
                requestAnimationFrame(updateDuringScroll);
            } else {
                updateImageOpacities(); // Finale Aktualisierung
            }
        }
        requestAnimationFrame(updateDuringScroll);
    }// Update the gallery position
    function updateGalleryPosition(animate = false) {
        if (!gallery) return;
        
        const visibleSlides = getVisibleSlides();
        const slideWidth = 100 / visibleSlides;
        
        // Prevent sliding if there are fewer or equal items than visible slides
        if (totalItems <= visibleSlides) {
            gallery.style.transform = 'translateX(0%)';
            return;
        }
        
        // Berechne den Offset auf Basis der aktuellen Position
        // Unterstützt auch negative Indizes für vorhergehende Slides
        let offset;
        
        if (currentSlide < 0) {
            // Wenn wir ins Negative scrollen (für nahtlosen Übergang vom ersten zum letzten Element)
            // Berechne die korrekte Position für die geklonten Elemente am Anfang
            const numPreClones = gallery.querySelectorAll('.gallery-item-preclone').length;
            // Stelle sicher, dass wir nicht zu weit zurückscrollen
            const safeSlide = Math.max(currentSlide, -numPreClones);
            const preCloneOffset = Math.floor(safeSlide / visibleSlides) * 100;
            offset = preCloneOffset;
        } else if (currentSlide >= totalItems) {
            // Wenn wir über das Ende hinaus scrollen (für nahtlosen Übergang vom letzten zum ersten Element)
            const numClones = gallery.querySelectorAll('.gallery-item-clone').length;
            const maxIndex = totalItems + numClones - visibleSlides;
            // Stelle sicher, dass wir nicht zu weit vorwärts scrollen
            const safeSlide = Math.min(currentSlide, maxIndex);
            const postCloneOffset = -(Math.floor(safeSlide / visibleSlides) * 100);
            offset = postCloneOffset;
        } else {
            // Normaler Fall innerhalb der Original-Elemente
            const groupIndex = Math.floor(currentSlide / visibleSlides);
            offset = -(groupIndex * 100);
        }
        
        // Set transition for animation
        if (animate) {
            isTransitioning = true;
            // Verwende eine etwas sanftere Beschleunigungskurve für weichere Übergänge
            gallery.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
            
            // Kontinuierliche Aktualisierungen während der Animation für gleichmäßigere Übergänge
            const startTime = performance.now();
            const animationDuration = 800;
            
            function updateDuringAnimation(timestamp) {
                const elapsed = timestamp - startTime;
                if (elapsed < animationDuration) {
                    updateImageOpacities();
                    requestAnimationFrame(updateDuringAnimation);
                } else {
                    // Finale Aktualisierung
                    updateImageOpacities();
                    isTransitioning = false;
                }
            }
            
            requestAnimationFrame(updateDuringAnimation);
        } else {
            gallery.style.transition = 'none';
            updateImageOpacities();
        }
        
        // Apply the transform
        gallery.style.transform = `translateX(${offset}%)`;
    }// Funktion zum Aktualisieren der Sichtbarkeit der Bilder
    function updateImageOpacities() {
        if (!gallery) return;
        
        const galleryRect = gallery.getBoundingClientRect();
        const containerCenter = galleryRect.left + (galleryRect.width / 2);
        const visibleWidth = galleryRect.width;
        const visibleLeft = containerCenter - (visibleWidth / 2);
        const visibleRight = containerCenter + (visibleWidth / 2);
        
        // Durchlaufe alle Bilder (inkl. geklonte Elemente) und bestimme ihre Sichtbarkeit
        const allItems = gallery.querySelectorAll('.gallery-item, .gallery-item-clone, .gallery-item-preclone');
        const visibleSlides = getVisibleSlides();
        const itemWidth = visibleWidth / visibleSlides;
        
        allItems.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            const itemMidpoint = itemRect.left + (itemRect.width / 2);
            
            // Bestimme, ob das Element am linken oder rechten Rand erscheint/verschwindet
            const isLeftEdge = itemRect.right < visibleLeft + itemWidth * 0.5;
            const isRightEdge = itemRect.left > visibleRight - itemWidth * 0.5;
            
            // Prüfe, ob das Element zumindest teilweise im sichtbaren Bereich ist
            const isPartiallyVisible = (
                (itemRect.left >= visibleLeft - itemRect.width && itemRect.left <= visibleRight) || 
                (itemRect.right >= visibleLeft && itemRect.right <= visibleRight + itemRect.width) ||
                (itemRect.left <= visibleLeft && itemRect.right >= visibleRight)
            );
            
            if (isPartiallyVisible) {
                // Berechne die Sichtbarkeit basierend auf der Position
                const distanceFromCenter = Math.abs(containerCenter - itemMidpoint);
                const maxDistance = visibleWidth / 2 + itemRect.width / 2;
                
                // Feinere Opazitätskontrolle:
                // - Volle Opazität im zentralen Bereich
                // - Gleichmäßiger Übergang zu den Rändern
                let opacity = 1.0;
                
                // Am Rand sanfter Übergang zur vollen Transparenz
                if (distanceFromCenter > visibleWidth * 0.25) {
                    // Berechne die Übergangszone 
                    const transitionZone = maxDistance - visibleWidth * 0.25;
                    const excessDistance = distanceFromCenter - visibleWidth * 0.25;
                    opacity = 1.0 - (excessDistance / transitionZone);
                }
                
                // Sicherstellen, dass die Opazität im gültigen Bereich ist
                opacity = Math.max(0, Math.min(1, opacity));
                
                // Besondere Behandlung für die Ränder für einen weicheren Übergang
                if (isLeftEdge || isRightEdge) {
                    opacity *= 0.7; // Zusätzliche Reduzierung am äußersten Rand
                }
                
                item.style.opacity = opacity.toString();
            } else {
                // Elemente außerhalb des sichtbaren Bereichs sind unsichtbar
                item.style.opacity = '0';
            }
        });
    }
    
    // Reset and restart the slideshow
    function resetSlideshow() {
        clearInterval(slideInterval);
        startSlideshow();
    }
    
    // Handle touch start
    function handleTouchStart(event) {
        touchStartX = event.changedTouches[0].screenX;
    }
    
    // Handle touch end
    function handleTouchEnd(event) {
        touchEndX = event.changedTouches[0].screenX;
        
        // Detect swipe direction
        if (touchEndX < touchStartX - 50) {
            nextSlide(); // Swipe left = next
        } else if (touchEndX > touchStartX + 50) {
            prevSlide(); // Swipe right = previous
        }
    }
    
    // Open the lightbox with the selected image
    function openLightbox(index) {
        if (!lightbox || !lightboxImage) return;
        
        // Set current index in lightbox
        lightbox.dataset.currentIndex = index;
        
        // Get the selected image and its information
        const selectedImage = galleryItems[index].querySelector('.gallery-image');
        const caption = galleryItems[index].querySelector('.gallery-caption');
        
        if (selectedImage) {
            // Set the lightbox image source
            lightboxImage.src = selectedImage.src;
            lightboxImage.alt = selectedImage.alt;
            
            // Set caption if available
            if (caption && lightboxCaption) {
                const captionTitle = caption.querySelector('h4');
                const captionText = caption.querySelector('p');
                
                let captionHTML = '';
                if (captionTitle) captionHTML += `<h3>${captionTitle.textContent}</h3>`;
                if (captionText) captionHTML += `<p>${captionText.textContent}</p>`;
                
                lightboxCaption.innerHTML = captionHTML;
            }
            
            // Show the lightbox
            lightbox.classList.add('active');
            
            // Disable body scroll
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close the lightbox
    function closeLightbox() {
        if (!lightbox) return;
        
        // Hide the lightbox
        lightbox.classList.remove('active');
        
        // Re-enable body scroll
        document.body.style.overflow = '';
    }
    
    // Navigate through images in the lightbox
    function navigateLightbox(direction) {
        if (!lightbox) return;
        
        // Get current index from lightbox data attribute
        let currentIndex = parseInt(lightbox.dataset.currentIndex || '0');
        
        // Calculate new index based on direction
        if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        } else {
            currentIndex = (currentIndex + 1) % totalItems;
        }
        
        // Open the new image
        openLightbox(currentIndex);
    }
    
    // Handle keyboard events
    function handleKeyDown(event) {
        // Only process if lightbox is active
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        switch (event.key) {
            case 'ArrowLeft':
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                navigateLightbox('next');
                break;
            case 'Escape':
                closeLightbox();
                break;
        }
    }
    
    // Initialize gallery if elements exist
    if (gallery && galleryItems.length > 0) {
        initGallery();
    }
});
