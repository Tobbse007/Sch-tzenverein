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

    // Desktop dropdown functionality - click to toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    let activeDropdown = null;

    // Function to close all dropdowns
    function closeAllDropdowns() {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (!dropdown.matches(':hover')) { // Don't close if hovering
                menu.classList.add('dropdown-hidden');
                
                const arrow = dropdown.querySelector('svg');
                arrow.classList.remove('rotate-180');
            }
        });
        activeDropdown = null;
    }

    // Toggle dropdown on button click
    dropdowns.forEach(dropdown => {
        const toggleButton = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Click event
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = menu.classList.contains('dropdown-hidden');
            
            if (isHidden) {
                // Close other open dropdowns first
                closeAllDropdowns();
                
                // Open this dropdown
                menu.classList.remove('dropdown-hidden');
                menu.classList.remove('opacity-0', 'invisible');
                menu.classList.add('opacity-100', 'visible');
                toggleButton.querySelector('svg').classList.add('rotate-180');
                activeDropdown = dropdown;
            } else {
                // Close this dropdown
                menu.classList.add('dropdown-hidden');
                menu.classList.remove('opacity-100', 'visible');
                menu.classList.add('opacity-0', 'invisible');
                toggleButton.querySelector('svg').classList.remove('rotate-180');
                activeDropdown = null;
            }
        });

        // Prevent clicks inside dropdown from closing it
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        closeAllDropdowns();
    });

    // Close dropdowns on scroll
    window.addEventListener('scroll', () => {
        closeAllDropdowns();
    });
});

// Add any additional JavaScript functionality here
