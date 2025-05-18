// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle with improved animation
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            // Add a small delay to allow the hidden class to be processed first
            setTimeout(() => {
                mobileMenu.classList.toggle('open');
            }, 10);
        });
    }

    // Mobile dropdown functionality with animations
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    mobileDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('button');
        const content = dropdown.querySelector('.mobile-dropdown-content');
        
        button.addEventListener('click', () => {
            content.classList.toggle('hidden');
            // Add a small delay before applying open class
            setTimeout(() => {
                content.classList.toggle('open');
            }, 10);
            
            // Toggle arrow direction
            const arrow = button.querySelector('svg');
            arrow.classList.toggle('rotate-180');
        });
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            
            // Reset all dropdowns when closing the menu
            mobileDropdowns.forEach(dropdown => {
                const content = dropdown.querySelector('.mobile-dropdown-content');
                content.classList.add('hidden');
            });
        });
    });

    // Desktop dropdown functionality - Fixed version
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Track if dropdown is actively toggled by click
        dropdown.isToggled = false;
        
        // Click handler for dropdown button
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle the active state
            dropdown.isToggled = !dropdown.isToggled;
            
            // Close all other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.isToggled = false;
                    otherDropdown.classList.remove('active-dropdown');
                    otherDropdown.querySelector('svg').classList.remove('rotate-180');
                }
            });
            
            // Update current dropdown
            if (dropdown.isToggled) {
                dropdown.classList.add('active-dropdown');
                dropdown.querySelector('svg').classList.add('rotate-180');
            } else {
                dropdown.classList.remove('active-dropdown');
                dropdown.querySelector('svg').classList.remove('rotate-180');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.isToggled = false;
            dropdown.classList.remove('active-dropdown');
            dropdown.querySelector('svg').classList.remove('rotate-180');
        });
    });

    // Close dropdowns on scroll
    window.addEventListener('scroll', function() {
        dropdowns.forEach(dropdown => {
            dropdown.isToggled = false;
            dropdown.classList.remove('active-dropdown');
            dropdown.querySelector('svg').classList.remove('rotate-180');
        });
    });

    // Stop propagation for click events inside dropdown menu
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Handle active navigation states based on current URL
    function updateActiveNavItem(targetId) {
        // Clear all active states first
        document.querySelectorAll('nav a, .dropdown-toggle').forEach(item => {
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
            
            // For dropdown items - activate the parent dropdown
            document.querySelectorAll('.dropdown-menu a').forEach(link => {
                if (link.getAttribute('href') === '#' + targetId) {
                    const parentDropdown = link.closest('.dropdown');
                    if (parentDropdown) {
                        const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
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
    
    // Set initial active state based on current URL hash
    const initialHash = window.location.hash.substring(1) || '';
    updateActiveNavItem(initialHash);
    
    // Update active state when clicking a nav link
    document.querySelectorAll('nav a, .dropdown-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                updateActiveNavItem(targetId);
            }
        });
    });
    
    // Update when hash changes
    window.addEventListener('hashchange', function() {
        const newHash = window.location.hash.substring(1);
        updateActiveNavItem(newHash);
    });
    
    // Keyboard Navigation for Accessibility
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        // Add ARIA attributes
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        
        const dropdown = toggle.closest('.dropdown');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Add unique IDs for ARIA relationships
        const menuId = 'dropdown-' + Math.random().toString(36).substr(2, 9);
        menu.id = menuId;
        toggle.setAttribute('aria-controls', menuId);
        
        toggle.addEventListener('keydown', function(e) {
            // Open dropdown on Enter or Space
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dropdown.classList.add('active-dropdown');
                toggle.setAttribute('aria-expanded', 'true');
                
                // Focus first menu item
                const firstItem = menu.querySelector('a');
                if (firstItem) firstItem.focus();
            }
            
            // Open dropdown and move to first item on Arrow Down
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                dropdown.classList.add('active-dropdown');
                toggle.setAttribute('aria-expanded', 'true');
                
                // Focus first menu item
                const firstItem = menu.querySelector('a');
                if (firstItem) firstItem.focus();
            }
        });
        
        // Handle keyboard navigation within dropdown menu
        const menuItems = menu.querySelectorAll('a');
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', function(e) {
                // Close on Escape
                if (e.key === 'Escape') {
                    dropdown.classList.remove('active-dropdown');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
                
                // Navigate items with arrow keys
                if (e.key === 'ArrowDown' && index < menuItems.length - 1) {
                    e.preventDefault();
                    menuItems[index + 1].focus();
                }
                
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (index > 0) {
                        menuItems[index - 1].focus();
                    } else {
                        toggle.focus();
                        dropdown.classList.remove('active-dropdown');
                        toggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
    });

    // Close dropdown when focus leaves
    document.addEventListener('focusin', function(e) {
        dropdownToggles.forEach(toggle => {
            const dropdown = toggle.closest('.dropdown');
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active-dropdown');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
});
