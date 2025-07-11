// Globale Verbesserungen für mobile Navbar auf allen Seiten
document.addEventListener('DOMContentLoaded', function() {
    // Funktion zur perfekten Zentrierung der Navbar in der mobilen Ansicht
    function optimizeMobileNavbar() {
        const navbarMain = document.querySelector('.navbar-main');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const logoContainer = navbarMain?.querySelector('.flex.items-center');
        const mobileMenu = document.getElementById('mobile-menu');
        const navbarContainer = document.querySelector('.navbar-container');
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        const logoImage = navbarMain?.querySelector('.w-12.h-12');
        const siteTitle = navbarMain?.querySelector('a.text-xl');
        
        // Nur für mobile Ansicht
        if (window.innerWidth < 1024) {
            // Sicherstellen, dass das Layout optimal ist
            if (navbarMain) {
                navbarMain.style.display = 'flex';
                navbarMain.style.alignItems = 'center';
                navbarMain.style.justifyContent = 'space-between';
                navbarMain.style.gap = '0.5rem';
                navbarMain.style.minHeight = '3rem';
                navbarMain.style.padding = '0';
                navbarMain.style.margin = '0';
            }
            
            // Optimierung des Hamburger-Menüs
            if (mobileMenuButton) {
                mobileMenuButton.style.margin = '0';
                mobileMenuButton.style.display = 'flex';
                mobileMenuButton.style.alignItems = 'center';
            }
            
            // Optimierung des Logo-Containers
            if (logoContainer) {
                logoContainer.style.display = 'flex';
                logoContainer.style.alignItems = 'center';
                logoContainer.style.margin = '0';
                logoContainer.style.padding = '0';
                logoContainer.style.height = '100%';
            }
            
            // Logo-Bild optimieren
            if (logoImage) {
                logoImage.style.width = '2.75rem';
                logoImage.style.height = '2.75rem';
                logoImage.style.marginRight = '0.5rem';
            }
            
            // Titeltext optimieren
            if (siteTitle) {
                siteTitle.style.fontSize = '1.1rem';
                siteTitle.style.lineHeight = '1.3';
            }
            
            // Navbar-Container optimieren
            if (navbarContainer) {
                navbarContainer.style.padding = '0.4rem 0.75rem';
                navbarContainer.style.margin = '0 auto';
                navbarContainer.style.minHeight = 'auto';
            }
            
            // Mobile Menu optimieren
            if (mobileMenu) {
                mobileMenu.style.marginTop = '0.25rem';
                mobileMenu.style.marginBottom = '0';
                mobileMenu.style.padding = '0';
            }
            
            // Mobile Dropdown-Menüs optimieren
            mobileDropdowns.forEach(dropdown => {
                dropdown.style.marginBottom = '0';
                
                const dropdownContent = dropdown.querySelector('.mobile-dropdown-content');
                if (dropdownContent) {
                    dropdownContent.style.padding = '0';
                    dropdownContent.style.margin = '0';
                }
                
                const button = dropdown.querySelector('button');
                if (button) {
                    button.style.padding = '0.7rem 0.75rem';
                    button.style.marginBottom = '0.5rem';
                    button.style.minHeight = '45px';
                    button.style.fontSize = '1.05rem';
                    button.style.fontWeight = '500';
                    
                    // Aktiver Button bekommt stärkere Hervorhebung
                    if (button.classList.contains('text-green-700') || button.classList.contains('font-bold')) {
                        button.style.fontSize = '1.1rem';
                        button.style.fontWeight = '700';
                        button.style.color = '#15803d'; // Primärgrün (entspricht Tailwind green-700)
                    }
                }
                
                const items = dropdown.querySelectorAll('.mobile-dropdown-item');
                items.forEach(item => {
                    item.style.padding = '0.7rem 0.75rem';
                    item.style.marginBottom = '0.5rem';
                    item.style.minHeight = '45px';
                    item.style.fontSize = '1.05rem';
                    item.style.fontWeight = '500';
                });
            });
            
            // Alle Menüeinträge optimieren
            const menuItems = document.querySelectorAll('.mobile-menu-item');
            menuItems.forEach(item => {
                item.style.padding = '0.7rem 0.75rem';
                item.style.marginBottom = '0.5rem';
                item.style.minHeight = '45px';
                item.style.fontSize = '1.05rem';
                item.style.fontWeight = '500';
                
                // Aktiver Menüpunkt bekommt noch stärkere Hervorhebung
                if (item.classList.contains('text-green-700') || item.classList.contains('font-bold')) {
                    item.style.fontSize = '1.1rem';
                    item.style.fontWeight = '700';
                    item.style.color = '#15803d'; // Primärgrün (entspricht Tailwind green-700)
                }
                
                // Kontakt-Button speziell formatieren
                if (item.classList.contains('contact-button')) {
                    item.style.fontSize = '1.05rem';
                    item.style.fontWeight = '600';
                    item.style.padding = '0.8rem 0.75rem';
                    item.style.marginTop = '0.75rem';
                }
            });
            
            // Kontakt-Button-Container optimieren
            const contactBtnContainer = document.querySelector('#mobile-menu .flex-1.flex.items-center.justify-center');
            if (contactBtnContainer) {
                contactBtnContainer.style.padding = '0.25rem 0';
                contactBtnContainer.style.minHeight = 'auto';
            }
        } else {
            // Reset für Desktop-Ansicht - alle angewendeten Inline-Styles entfernen
            const elementsToReset = [
                navbarMain, mobileMenuButton, logoContainer, mobileMenu, 
                navbarContainer, logoImage, siteTitle
            ];
            
            elementsToReset.forEach(el => {
                if (el) el.removeAttribute('style');
            });
            
            // Reset für alle Dropdown-Elemente
            mobileDropdowns.forEach(dropdown => {
                dropdown.removeAttribute('style');
                
                const elements = dropdown.querySelectorAll('*');
                elements.forEach(el => el.removeAttribute('style'));
            });
            
            // Reset für alle Menüeinträge
            const menuItems = document.querySelectorAll('.mobile-menu-item');
            menuItems.forEach(item => {
                item.removeAttribute('style');
            });
        }
    }
    
    // Zusätzliche Funktion, um sicherzustellen, dass der aktuelle Menüpunkt grün ist
    function ensureActiveMenuItemIsGreen() {
        // Ermitteln der aktuellen Seite aus dem Pfad
        const currentPath = window.location.pathname;
        
        // Alle mobilen Menüpunkte durchgehen
        const allMenuItems = document.querySelectorAll('.mobile-menu-item, .mobile-dropdown-button, .mobile-dropdown-item');
        
        allMenuItems.forEach(item => {
            // Prüfen, ob dieser Menüpunkt zur aktuellen Seite passt
            if (item.href && item.href.includes(currentPath)) {
                // Fett und grün machen
                item.style.fontWeight = '700';
                item.style.color = '#15803d'; // Primärgrün (entspricht Tailwind green-700)
                
                // Klasse für CSS-Styling hinzufügen
                item.classList.add('text-green-700');
                item.classList.add('font-bold');
                
                // Wenn es ein Dropdown-Button ist, auch das SVG-Icon grün machen
                const icon = item.querySelector('svg');
                if (icon) {
                    icon.style.color = '#15803d';
                }
                
                // Wenn es ein Dropdown-Item ist, den übergeordneten Button auch markieren
                if (item.classList.contains('mobile-dropdown-item')) {
                    const parentDropdown = item.closest('.mobile-dropdown');
                    if (parentDropdown) {
                        const dropdownButton = parentDropdown.querySelector('button');
                        if (dropdownButton) {
                            dropdownButton.style.color = '#15803d';
                            dropdownButton.classList.add('text-green-700');
                            
                            // Auch das Icon im Button grün machen
                            const btnIcon = dropdownButton.querySelector('svg');
                            if (btnIcon) {
                                btnIcon.style.color = '#15803d';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Initial ausführen
    optimizeMobileNavbar();
    ensureActiveMenuItemIsGreen();
    
    // Bei Größenänderung des Fensters erneut ausführen
    window.addEventListener('resize', function() {
        optimizeMobileNavbar();
    });
    
    // Bei Klick auf Hamburger-Menü optimieren
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            // Kurze Verzögerung für Animation
            setTimeout(optimizeMobileNavbar, 50);
            setTimeout(ensureActiveMenuItemIsGreen, 50);
        });
    }
    
    // Bei Klick auf Dropdown-Buttons optimieren
    const dropdownButtons = document.querySelectorAll('.mobile-dropdown-button');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Kurze Verzögerung für Animation
            setTimeout(optimizeMobileNavbar, 50);
            setTimeout(ensureActiveMenuItemIsGreen, 50);
        });
    });
});
