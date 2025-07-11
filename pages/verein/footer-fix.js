// footer-fix.js - Verbessert Footer-Hover-Effekte

document.addEventListener('DOMContentLoaded', function() {
    console.log('[FOOTER-FIX] Script für verbesserte Footer-Animationen geladen');
    
    // Footer-Elemente selektieren
    const footerBoxes = document.querySelectorAll('.footer-container > div > div > div');
    
    // Für jede Box
    footerBoxes.forEach(box => {
        // Stellt sicher, dass transform-Werte korrekt initialisiert sind
        box.style.transform = 'translate3d(0, 0, 0)';
        box.style.willChange = 'transform, box-shadow';
        box.style.transition = 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Event-Listeners für Hover hinzufügen
        box.addEventListener('mouseenter', function() {
            if (box.classList.contains('hover:-translate-y-2')) {
                box.style.transform = 'translate3d(0, -0.5rem, 0)';
            }
        });
        
        box.addEventListener('mouseleave', function() {
            box.style.transform = 'translate3d(0, 0, 0)';
        });
    });
    
    console.log('[FOOTER-FIX] Footer-Animations-Verbesserungen angewendet auf', footerBoxes.length, 'Elemente');
});
