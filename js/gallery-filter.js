/**
 * Gallery Category Filtering
 * Ermöglicht das Filtern der Bilder nach Kategorien
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gallery filter initialized');
    initGalleryFilter();
});

/**
 * Initialisiert die Filterung der Galerie nach Kategorien
 */
function initGalleryFilter() {
    // Finde alle Kategorie-Karten und Galerie-Items
    const categoryCards = document.querySelectorAll('.category-card');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const currentCategoryDescription = document.getElementById('current-category-description');
    
    // Kategorien-Beschreibungen für jede Kategorie
    const categoryDescriptions = {
        'schiessen': 'Training, Wettkämpfe und verschiedene Schießdisziplinen',
        'gastronomie': 'Unser gemütliches Vereinsheim und die Terrasse',
        'vereinsleben': 'Gemeinschaftsaktivitäten und Veranstaltungen',
        'vorstand': 'Das Team hinter dem Verein'
    };
    
    console.log('Found category cards:', categoryCards.length);
    console.log('Found gallery items:', galleryItems.length);
    
    // Setze die anfänglich aktive Kategorie
    let activeCategory = 'schiessen';
    
    // Initialisiere mit aktiver Kategorie aus HTML (falls vorhanden)
    categoryCards.forEach(card => {
        if (card.classList.contains('active')) {
            activeCategory = card.getAttribute('data-category');
        }
    });
    
    console.log('Initial active category:', activeCategory);
    
    // Setze den ersten Zustand der Galerie
    updateGallery();
    
    // Füge Event Listener zu den Kategorie-Karten hinzu
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Category clicked:', this.getAttribute('data-category'));
            
            // Deaktiviere alle Karten und aktiviere die angeklickte
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Setze die aktive Kategorie
            activeCategory = this.getAttribute('data-category');
            
            // Aktualisiere die Galerie
            updateGallery();
        });
    });
    
    /**
     * Aktualisiert die Anzeige der Galerie basierend auf der ausgewählten Kategorie
     */
    function updateGallery() {
        console.log('Updating gallery for category:', activeCategory);
        
        // Aktualisiere den Titel und die Beschreibung
        if (currentCategoryTitle) {
            // Erste Buchstabe groß schreiben
            const categoryName = activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
            currentCategoryTitle.textContent = categoryName;
        }
        
        if (currentCategoryDescription) {
            currentCategoryDescription.textContent = categoryDescriptions[activeCategory] || '';
        }
        
        // Zeige nur Bilder der ausgewählten Kategorie
        let visibleCount = 0;
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (itemCategory === activeCategory) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        console.log('Visible items:', visibleCount);
        
        // Aktualisiere die Bildanzahlen in den Kategorie-Karten
        updateImageCounts();
    }
    
    /**
     * Aktualisiert die Anzahl der Bilder für jede Kategorie
     */
    function updateImageCounts() {
        categoryCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const count = document.querySelectorAll(`.gallery-item[data-category="${category}"]`).length;
            
            const imageCountElement = card.querySelector('.image-count');
            if (imageCountElement) {
                imageCountElement.textContent = `${count} Bilder`;
            }
            
            console.log(`Category ${category} has ${count} images`);
        });
    }
}
