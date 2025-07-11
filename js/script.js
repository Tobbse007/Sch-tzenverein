// Optimiertes JavaScript für Schützenverein Tell Webseite
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    console.log('🚀 JavaScript loaded successfully!');
    
    // ========== Mobile Menu Handling ==========
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    console.log('🔍 Searching for mobile menu elements...');
    console.log('Mobile Menu Button found:', !!mobileMenuButton);
    console.log('Mobile Menu found:', !!mobileMenu);

    if (mobileMenuButton && mobileMenu) {
        console.log('✅ Both mobile menu elements found! Setting up click handler...');          mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔥 HAMBURGER MENU CLICKED!');
            
            const isOpen = mobileMenu.classList.contains('open');
            console.log('Current state:', isOpen ? 'OPEN' : 'CLOSED');
            
            if (isOpen) {
                // Menu schließen mit schnell→langsam Animation (ease-in)
                console.log('Closing menu with ease-in animation...');
                mobileMenu.classList.remove('opening');
                mobileMenu.classList.add('closing');
                mobileMenu.classList.remove('open');
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                
                // Nach Animation verstecken und Klassen zurücksetzen
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('closing');
                }, 300); // Wartet auf CSS-Transition
            } else {
                // Menu öffnen mit langsam→schnell Animation (ease-out)
                console.log('Opening menu with ease-out animation...');
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.remove('closing');
                mobileMenu.classList.add('opening');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                // Animation triggern nach DOM-Update
                requestAnimationFrame(() => {
                    mobileMenu.classList.add('open');
                });
            }
        });
        
        console.log('✅ Click handler attached successfully!');
    } else {
        console.error('❌ Mobile menu elements not found!');
        if (!mobileMenuButton) console.error('Missing: mobile-menu-button');
        if (!mobileMenu) console.error('Missing: mobile-menu');
    }

    // ========== Mobile Dropdown Handling ==========
    function initMobileDropdowns() {
        console.log('Initializing mobile dropdowns...');
        
        const mobileDropdownButtons = document.querySelectorAll('.mobile-dropdown-button');
        console.log('Found mobile dropdown buttons:', mobileDropdownButtons.length);
        
        mobileDropdownButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = this.closest('.mobile-dropdown');
                const content = dropdown.querySelector('.mobile-dropdown-content');
                
                if (!content) return;
                
                const isOpen = content.classList.contains('open');
                
                // Alle anderen Dropdowns schließen
                document.querySelectorAll('.mobile-dropdown-content').forEach(otherContent => {
                    if (otherContent !== content && otherContent.classList.contains('open')) {
                        otherContent.classList.remove('open');
                        const otherDropdown = otherContent.closest('.mobile-dropdown');
                        const otherButton = otherDropdown.querySelector('.mobile-dropdown-button');
                        if (otherButton) {
                            otherButton.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Aktuelles Dropdown togglen
                if (isOpen) {
                    content.classList.remove('open');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    content.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }
    
    // Initialize dropdowns
    initMobileDropdowns();

    // Mobile menu Links behandeln
    if (mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a:not(.mobile-dropdown-button)');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
                
                if (mobileMenuButton) {
                    mobileMenuButton.classList.remove('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
                
                // Reset mobile dropdowns when mobile menu closes
                document.querySelectorAll('.mobile-dropdown-content').forEach(content => {
                    content.classList.remove('open');
                    const dropdown = content.closest('.mobile-dropdown');
                    const button = dropdown.querySelector('.mobile-dropdown-button');
                    if (button) {
                        button.setAttribute('aria-expanded', 'false');
                    }
                });
            });
        });
    }

    // ========== Window Resize Handler ==========
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('open');
                mobileMenu.classList.add('hidden');
            }
            if (mobileMenuButton) {
                mobileMenuButton.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ========== Back to Top Button ==========
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible', 'translate-y-4');
                backToTopButton.classList.add('opacity-100', 'visible', 'translate-y-0');
            } else {
                backToTopButton.classList.remove('opacity-100', 'visible', 'translate-y-0');
                backToTopButton.classList.add('opacity-0', 'invisible', 'translate-y-4');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});  // Ende von DOMContentLoaded

// ========== Desktop Dropdown Handling ==========
const navDropdowns = document.querySelectorAll('.nav-dropdown');

document.addEventListener('click', (e) => {
    const isDropdownClick = e.target.closest('.nav-dropdown');
    if (!isDropdownClick) {
        navDropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.dropdown-button');
            if (button) {
                button.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// Close dropdowns when scrolling
let scrollTimer;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        navDropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.dropdown-button');
            if (button) {
                button.setAttribute('aria-expanded', 'false');
            }
        });
    }, 100);
});

// ========== Navigation Dropdown Handling ==========
navDropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('.dropdown-button');
    
    if (button) {
        // Hover Event für Desktop
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                button.setAttribute('aria-expanded', 'true');
            }
        });

        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                button.setAttribute('aria-expanded', 'false');
            }
        });

        // Click Event für Touch-Geräte
        button.addEventListener('click', (e) => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                e.preventDefault();
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', !isExpanded);
            }
        });
    }
});

// ========== Contact Form Handling ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Wird gesendet...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = 'Gesendet ✓';
            submitBtn.style.backgroundColor = '#22c55e';
            
            // Hide error message if it exists
            const errorMsg = document.getElementById('error-message');
            if (errorMsg) {
                errorMsg.classList.add('hidden');
            }
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    });
}
