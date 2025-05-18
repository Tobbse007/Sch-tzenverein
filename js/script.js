// Optimiertes JavaScript für Schützenverein Tell Webseite
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Back to Top Button Funktionalität
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        // Button anfänglich verstecken
        backToTopButton.classList.remove('visible');
        
        // Scroll-Event-Listener hinzufügen
        window.addEventListener('scroll', function() {
            // Button anzeigen, wenn der Benutzer 300px nach unten gescrollt hat
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Klick-Event für den Button
        backToTopButton.addEventListener('click', function() {
            // Sanft nach oben scrollen
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
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

// ========== Contact Form Validation ==========
    const initFormValidation = () => {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            // Add validation to contact form
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                const name = this.querySelector('#name');
                const email = this.querySelector('#email');
                const message = this.querySelector('#message');
                const privacy = this.querySelector('#privacy');
                
                // Reset previous error states
                document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));
                
                // Name validation
                if (!name.value.trim()) {
                    document.querySelector('[for="name"]').nextElementSibling.nextElementSibling.classList.remove('hidden');
                    isValid = false;
                    name.focus();
                }
                
                // Email validation
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email.value.trim())) {
                    document.querySelector('[for="email"]').nextElementSibling.nextElementSibling.classList.remove('hidden');
                    if (isValid) {
                        email.focus();
                        isValid = false;
                    }
                }
                
                // Message validation
                if (!message.value.trim()) {
                    document.querySelector('[for="message"]').nextElementSibling.nextElementSibling.classList.remove('hidden');
                    if (isValid) {
                        message.focus();
                        isValid = false;
                    }
                }
                
                // Privacy validation
                if (!privacy.checked) {
                    document.getElementById('privacy-error').classList.remove('hidden');
                    if (isValid) {
                        privacy.focus();
                        isValid = false;
                    }
                }
                
                // If all validations pass
                if (isValid) {
                    // Hide any previous messages
                    document.getElementById('form-success').classList.add('hidden');
                    document.getElementById('form-error').classList.add('hidden');
                    
                    // Simulate form submission (replace with actual backend submission)
                    const formData = new FormData(contactForm);
                    
                    // Show loading state
                    const submitButton = contactForm.querySelector('button[type="submit"]');
                    const originalButtonText = submitButton.innerHTML;
                    submitButton.disabled = true;
                    submitButton.innerHTML = `<span class="inline-block animate-spin mr-2">⟳</span> Wird gesendet...`;
                    
                    // Simulate API call
                    setTimeout(() => {
                        // Success
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                        document.getElementById('form-success').classList.remove('hidden');
                        
                        // Reset form
                        contactForm.reset();
                        
                        // Scroll success message into view
                        document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 1500);
                }
            });
            
            // Input focus behavior
            const inputs = contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                // Clear error on input
                input.addEventListener('input', function() {
                    const errorMessage = this.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.classList.add('hidden');
                    }
                    
                    // Special case for privacy checkbox
                    if (this.id === 'privacy' && this.checked) {
                        document.getElementById('privacy-error').classList.add('hidden');
                    }
                });
                
                // Add focus highlight
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.classList.remove('focused');
                });
            });
        }
    };
    
    // Initialize form validation
    initFormValidation();
    
    // ========== Lazy Loading Images ==========
    // Using Intersection Observer for better performance
    const lazyLoadImages = () => {
        // Check if browser supports Intersection Observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            img.src = src;
                            img.addEventListener('load', () => {
                                img.classList.add('loaded');
                                // Add small delay to smooth transition
                                setTimeout(() => {
                                    const placeholder = img.nextElementSibling;
                                    if (placeholder && placeholder.classList.contains('image-placeholder')) {
                                        placeholder.style.opacity = '0';
                                    }
                                }, 100);
                            });
                            
                            // Stop observing this image
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px', // Start loading when images come within 50px of viewport
                threshold: 0.1 // Trigger when 10% of image is visible
            });
            
            // Observe all lazy images
            document.querySelectorAll('img.lazy-image').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            // Simple scroll-based loading
            const lazyLoad = () => {
                const lazyImages = document.querySelectorAll('img.lazy-image:not(.loaded)');
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(img => {
                    if (img.offsetTop < window.innerHeight + scrollTop + 300) {
                        const src = img.dataset.src;
                        if (src) {
                            img.src = src;
                            img.addEventListener('load', () => {
                                img.classList.add('loaded');
                                const placeholder = img.nextElementSibling;
                                if (placeholder && placeholder.classList.contains('image-placeholder')) {
                                    placeholder.style.opacity = '0';
                                }
                            });
                        }
                    }
                });
                
                // If all images have been loaded, stop listening
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationchange', lazyLoad);
                }
            };
            
            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationchange', lazyLoad);
            
            // Initial load
            lazyLoad();
        }
    };
    
    // Initialize lazy loading
    lazyLoadImages();
      // We've simplified the design, so we don't need scroll animations anymore
      // Initialize animations and functionality
});
