// KOMPLETT ÜBERARBEITETE VERSION - Spezifisch auf große Footer-Boxen ausgerichtet
// Diese Version richtet sich NUR auf die Haupt-Container-Boxen im Footer, nicht auf alle divs

document.addEventListener('DOMContentLoaded', function() {
    console.log('[FOOTER-FIX] Optimierte Footer-Animationen werden geladen (nur Hauptboxen)...');
    
    // NUR die großen Hauptboxen im Footer selektieren
    const footerMainBoxes = document.querySelectorAll(`
        .footer-container .grid > div.bg-gray-100.rounded-lg.shadow-md,
        .footer-container .grid > div.bg-green-700.rounded-lg.shadow-md,
        .footer-container .grid > .bg-gray-100.rounded-lg.shadow-md
    `);
    
    console.log(`[FOOTER-FIX] ${footerMainBoxes.length} Hauptboxen im Footer gefunden`);
    
    // Alle vorhandenen inline-styles von den Hauptboxen entfernen
    footerMainBoxes.forEach(box => box.removeAttribute('style'));
    
    // Spezielle Behandlung für den Kontaktblock im Footer
    const contactBlock = document.querySelector('.footer-container .bg-gray-100.rounded-lg.shadow-md.p-3.md\\:col-span-8.flex.flex-col');
    
    if (contactBlock) {
        console.log('[FOOTER-FIX] Kontaktblock gefunden - optimiere für einheitliches Hovern');
        
        // Alle Kinder-Elemente davor bewahren, eigene Hover-Effekte zu haben
        const childElements = contactBlock.querySelectorAll('*');
        childElements.forEach(el => {
            el.style.pointerEvents = 'none'; // Verhindert, dass das Element Mausevents abfängt
        });
        
        // Kontaktblock selbst sollte Mausevents verarbeiten
        contactBlock.style.pointerEvents = 'auto';
    }
    
    // Verzögerung um sicherzustellen, dass alle anderen Skripte geladen wurden
    setTimeout(() => {
        footerMainBoxes.forEach(box => {
            // GPU-beschleunigte Transformation für optimale Performance
            box.style.transform = 'translate3d(0, 0, 0)';
            box.style.backfaceVisibility = 'hidden';
            box.style.willChange = 'transform, box-shadow';
            
            // Exakt die gleiche Transition wie auf der Startseite
            box.style.transitionProperty = 'transform, box-shadow';
            box.style.transitionDuration = '300ms';
            box.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Schatten im Normalzustand
            box.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
            
            // Hover-Effekte über JavaScript anwenden
            box.addEventListener('mouseenter', () => {
                requestAnimationFrame(() => {
                    box.style.transform = 'translateY(-0.5rem)';
                    box.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
                    
                    // Ring-Effekt hinzufügen wenn nötig
                    if (box.classList.contains('hover:ring-1')) {
                        box.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05), 0 0 0 1px rgba(16, 185, 129, 0.15)';
                    }
                });
            });
            
            box.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    box.style.transform = 'translateY(0)';
                    box.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                });
            });
        });
        
        console.log('[FOOTER-FIX] Footer-Hauptboxen erfolgreich optimiert!');
    }, 50); // Kleine Verzögerung für bessere Stabilität
});
