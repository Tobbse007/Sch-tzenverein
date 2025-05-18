// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Mobile dropdown functionality
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    mobileDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('button');
        const content = dropdown.querySelector('.mobile-dropdown-content');
        
        button.addEventListener('click', () => {
            content.classList.toggle('hidden');
            
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
});
