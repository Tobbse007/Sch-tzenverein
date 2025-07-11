// Verbesserungen für mobile Navbar
document.addEventListener('DOMContentLoaded', function() {
    // Funktion zur Anpassung der Navbar in der mobilen Ansicht
    function optimizeMobileNavbar() {
        const navbarMain = document.querySelector('.navbar-main');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const logoContainer = navbarMain.querySelector('.flex.items-center');
        
        // Nur für mobile Ansicht
        if (window.innerWidth < 1024) {
            // Sicherstellen, dass das Layout optimal ist
            navbarMain.style.width = '100%';
            navbarMain.style.display = 'flex';
            navbarMain.style.justifyContent = 'space-between';
            navbarMain.style.alignItems = 'center';
            
            // Entfernen von unnötigen Abständen
            if (mobileMenuButton) {
                mobileMenuButton.style.marginRight = '0';
            }
            
            // Optimiere Logo-Container
            if (logoContainer) {
                logoContainer.style.flexShrink = '1';
            }
        } else {
            // Reset für Desktop-Ansicht
            navbarMain.style = '';
            if (mobileMenuButton) mobileMenuButton.style = '';
            if (logoContainer) logoContainer.style = '';
        }
    }
    
    // Initial ausführen
    optimizeMobileNavbar();
    
    // Bei Größenänderung des Fensters erneut ausführen
    window.addEventListener('resize', optimizeMobileNavbar);
});
