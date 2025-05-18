// Optimiertes JavaScript für Schützenverein Tell Webseite
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ========== Mobile Menu Handling ==========
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    // Mobile menu toggle mit optimierter Animation
    mobileMenuButton.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('open');
        
        // Toggle Button und ARIA state
        this.classList.toggle('active');
        this.setAttribute('aria-expanded', !isOpen);
        
        // Toggle mobile menu mit Animation
        if (isOpen) {
            mobileMenu.classList.remove('open');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 500); // Match transition duration from CSS
        } else {
            mobileMenu.classList.remove('hidden');
            // Delay für DOM update
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    mobileMenu.classList.add('open');
                });
            });
        }
    });
}

// Fenster-Größenänderung behandeln
const handleResize = () => {
    if (window.innerWidth >= 1024 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('open');
        mobileMenu.classList.add('hidden');
        if (mobileMenuButton) {
            mobileMenuButton.classList.remove('active');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    }
};

window.addEventListener('resize', handleResize);

// ========== Mobile Dropdown Handling ==========
const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
mobileDropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('button');
    const content = dropdown.querySelector('.mobile-dropdown-content');
    
    if (button && content) {
        button.addEventListener('click', () => {
            const isOpen = !content.classList.contains('hidden');
            
            // Update ARIA attributes
            button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
            
            // Toggle content visibility mit Animation
            content.classList.toggle('hidden');
            
            // Mikro-Timeout für Animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    content.classList.toggle('open');
                });
            });
            
            // Toggle arrow direction
            const arrow = button.querySelector('svg');
            if (arrow) {
                arrow.classList.toggle('rotate-180');
            }
        });
    }
});

// Mobile menu Links behandeln
if (mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 500);
            
            if (mobileMenuButton) {
                mobileMenuButton.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
            
            // Reset dropdowns
            mobileDropdowns.forEach(dropdown => {
                const content = dropdown.querySelector('.mobile-dropdown-content');
                const button = dropdown.querySelector('button');
                if (content) {
                    content.classList.add('hidden');
                    content.classList.remove('open');
                }
                if (button) {
                    button.setAttribute('aria-expanded', 'false');
                    const arrow = button.querySelector('svg');
                    if (arrow) {
                        arrow.classList.remove('rotate-180');
                    }
                }
            });
        });
    });
}

// ========== Desktop Dropdown Handling ==========
const navDropdowns = document.querySelectorAll('.nav-dropdown');

// Globaler Klick-Handler zum Schließen der Dropdowns
document.addEventListener('click', (e) => {
    const isDropdownClick = e.target.closest('.nav-dropdown');
    if (!isDropdownClick) {
        // Alle Dropdowns schließen
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
    }, 150); // Debounce delay
});

// Setup individual dropdowns
navDropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('.dropdown-button');
    const menu = dropdown.querySelector('.dropdown-content');
    
    if (button && menu) {
        // Click handling
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Close all other dropdowns
            navDropdowns.forEach(otherDropdown => {
                const otherButton = otherDropdown.querySelector('.dropdown-button');
                if (otherButton && otherButton !== button) {
                    otherButton.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current dropdown
            button.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        });
        
        // Keyboard accessibility
        setupKeyboardNavigation(button, menu);
        
        // Prevent menu clicks from bubbling
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
});

// ========== Navigation Active State ==========
function updateActiveNavItem(targetId) {
    // Clear all active states first
    document.querySelectorAll('nav a, .dropdown-button').forEach(item => {
        item.classList.remove('active');
    });
    
    // Check if we have a hash target
    if (targetId) {
        // For regular links
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href') === '#' + targetId) {
                link.classList.add('active');
            }
        });
        
        // For dropdown items
        document.querySelectorAll('.dropdown-content a').forEach(link => {
            if (link.getAttribute('href') === '#' + targetId) {
                const parentDropdown = link.closest('.nav-dropdown');
                if (parentDropdown) {
                    const dropdownToggle = parentDropdown.querySelector('.dropdown-button');
                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                    }
                }
            }
        });
    } else {
        // If no targetId (homepage or initial load), activate home
        const homeLink = document.querySelector('nav a[href="#"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}

// Set initial active state based on URL hash
const initialHash = window.location.hash.substring(1) || '';
updateActiveNavItem(initialHash);

// Update active state when clicking links
document.querySelectorAll('nav a, .dropdown-content a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            const targetId = href.substring(1);
            updateActiveNavItem(targetId);
        }
    });
});

// Hashchange event
window.addEventListener('hashchange', function() {
    const newHash = window.location.hash.substring(1);
    updateActiveNavItem(newHash);
});

// ========== Keyboard Navigation Helpers ==========
function setupKeyboardNavigation(button, menu) {
    // Set up ARIA attributes
    button.setAttribute('aria-haspopup', 'true');
    
    // Generate unique ID for menu
    const menuId = `menu-${Math.random().toString(36).slice(2, 11)}`;
    menu.id = menuId;
    button.setAttribute('aria-controls', menuId);
    
    // Get all menu items
    const menuItems = menu.querySelectorAll('a');
    
    // Button keyboard events
    button.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Enter':
            case ' ': // Space
                e.preventDefault();
                button.setAttribute('aria-expanded', 'true');
                if (menuItems.length > 0) {
                    menuItems[0].focus();
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                button.setAttribute('aria-expanded', 'true');
                if (menuItems.length > 0) {
                    menuItems[0].focus();
                }
                break;
                
            case 'Escape':
                button.setAttribute('aria-expanded', 'false');
                break;
        }
    });
    
    // Menu item keyboard navigation
    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    button.setAttribute('aria-expanded', 'false');
                    button.focus();
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    if (index < menuItems.length - 1) {
                        menuItems[index + 1].focus();
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (index > 0) {
                        menuItems[index - 1].focus();
                    } else {
                        button.setAttribute('aria-expanded', 'false');
                        button.focus();
                    }
                    break;
                    
                case 'Tab':
                    // If it's the last item and tabbing forward, close dropdown
                    if (!e.shiftKey && index === menuItems.length - 1) {
                        setTimeout(() => {
                            button.setAttribute('aria-expanded', 'false');
                    }, 0);
                    } 
                    // If it's the first item and tabbing backward, close dropdown
                    else if (e.shiftKey && index === 0) {
                        setTimeout(() => {
                            button.setAttribute('aria-expanded', 'false');
                    }, 0);
                    }
                    break;
            }
        });
    });
}

// ========== Form Validation ==========
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Check required fields
        [name, email, message].forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
            } else {
                field.classList.remove('border-red-500');
            }
        });
        
        // Validate email format
        if (email.value && !isValidEmail(email.value)) {
            isValid = false;
            email.classList.add('border-red-500');
        }
        
        // Form submission (placeholder for future implementation)
        if (isValid) {
            // Here you would normally send the data to your backend
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

});
