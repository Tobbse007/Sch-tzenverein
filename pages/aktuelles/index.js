// Aktuelles Seite - JavaScript
// Erweitert die base template functionality

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    console.log('📰 Aktuelles JavaScript loaded successfully!');
    
    // ========== Active Menu Highlighting ==========
    function initActiveMenuHighlighting() {
        // Find all "Aktuelles" navigation links
        const aktuellesLinks = document.querySelectorAll('a[href*="aktuelles"]');
        
        aktuellesLinks.forEach(link => {
            // Check if this is the current page
            const href = link.getAttribute('href');
            if (href && (href.includes('index.html') || href.endsWith('aktuelles'))) {
                // Add active styling for desktop navigation
                if (link.closest('.hidden.lg\\:flex')) {
                    link.classList.add('text-green-700', 'font-bold');
                    link.classList.remove('hover:text-green-700');
                }
                
                // Add active styling for mobile navigation
                if (link.closest('#mobile-menu')) {
                    link.classList.add('text-green-700', 'font-bold');
                }
            }
        });
        
        console.log('✅ Active menu highlighting initialized');
    }
    
    // Initialize active menu highlighting immediately
    initActiveMenuHighlighting();

    // ========== News Filter Functionality ==========
    function initNewsFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const newsCards = document.querySelectorAll('.news-card');
        
        if (filterButtons.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter news cards
                newsCards.forEach(card => {
                    const tags = card.dataset.tags?.split(',') || [];
                    
                    if (filter === 'all' || tags.includes(filter)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.6s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                console.log(`🔍 Filtered news by: ${filter}`);
            });
        });
    }
    
    // ========== Newsletter Signup ==========
    function initNewsletterSignup() {
        const newsletterForm = document.querySelector('.newsletter-form');
        const newsletterInput = document.querySelector('.newsletter-input');
        const newsletterButton = document.querySelector('.newsletter-button');
        
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterInput.value.trim();
            
            if (!email) {
                showNotification('Bitte geben Sie Ihre E-Mail-Adresse ein.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }
            
            // Simulate newsletter signup
            newsletterButton.textContent = 'Wird angemeldet...';
            newsletterButton.disabled = true;
            
            setTimeout(() => {
                showNotification('Erfolgreich für den Newsletter angemeldet!', 'success');
                newsletterInput.value = '';
                newsletterButton.textContent = 'Anmelden';
                newsletterButton.disabled = false;
            }, 1500);
            
            console.log('📧 Newsletter signup attempted for:', email);
        });
    }
    
    // ========== Load More Functionality ==========
    function initLoadMore() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        const newsGrid = document.querySelector('.news-grid');
        
        if (!loadMoreBtn) return;
        
        let page = 1;
        const itemsPerPage = 6;
        
        loadMoreBtn.addEventListener('click', function() {
            this.textContent = 'Wird geladen...';
            this.disabled = true;
            
            // Simulate loading more news
            setTimeout(() => {
                const mockNews = generateMockNews(itemsPerPage);
                mockNews.forEach(newsItem => {
                    const newsCard = createNewsCard(newsItem);
                    newsGrid.appendChild(newsCard);
                });
                
                page++;
                this.textContent = 'Weitere Artikel laden';
                this.disabled = false;
                
                // Hide load more button after 3 pages
                if (page > 3) {
                    this.style.display = 'none';
                    showNotification('Alle verfügbaren Artikel geladen.', 'info');
                }
                
                console.log(`📄 Loaded page ${page} of news articles`);
            }, 1000);
        });
    }
    
    // ========== News Card Animations ==========
    function initNewsCardAnimations() {
        const newsCards = document.querySelectorAll('.news-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        newsCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    // ========== Search Functionality ==========
    function initNewsSearch() {
        const searchInput = document.querySelector('.news-search-input');
        
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.toLowerCase().trim();
            
            searchTimeout = setTimeout(() => {
                searchNews(query);
            }, 300);
        });
    }
    
    function searchNews(query) {
        const newsCards = document.querySelectorAll('.news-card');
        
        newsCards.forEach(card => {
            const title = card.querySelector('.news-card-title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.news-card-excerpt')?.textContent.toLowerCase() || '';
            const tags = card.dataset.tags?.toLowerCase() || '';
            
            const matches = title.includes(query) || excerpt.includes(query) || tags.includes(query);
            
            if (query === '' || matches) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
        
        console.log(`🔍 Searched news for: "${query}"`);
    }    // ========== Read More Functionality - Desktop und Mobile ==========
    function initReadMore() {
        const articles = document.querySelectorAll('.news-articles article');
        
        articles.forEach((article, index) => {
            const proseContainer = article.querySelector('.prose');
            if (!proseContainer) return;
            
            // Wrap alle Paragraphen in einen Container
            const paragraphs = proseContainer.querySelectorAll('p');
            if (paragraphs.length === 0) return;
            
            // Erstelle Container für den Text
            const textContainer = document.createElement('div');
            textContainer.className = 'article-text collapsed';
            
            // Verschiebe alle Paragraphen in den Container
            paragraphs.forEach(p => {
                textContainer.appendChild(p.cloneNode(true));
            });
            
            // Ersetze die originalen Paragraphen
            paragraphs.forEach(p => p.remove());
            proseContainer.appendChild(textContainer);
            
            // Prüfe ob der Text lang genug ist für Read-More
            const isMobile = window.innerWidth <= 768;
            const textHeight = textContainer.scrollHeight;
            const maxHeight = isMobile ? 120 : 500; // Mobile: 120px, Desktop: 500px
            
            // Nur Read-More anzeigen wenn Text tatsächlich gekürzt wird
            if (textHeight > maxHeight) {
                // Erstelle Read More Link (kein Button)
                const readMoreLink = document.createElement('a');
                readMoreLink.className = 'read-more-link';
                readMoreLink.href = '#';
                readMoreLink.innerHTML = `
                    <span class="read-more-text">mehr anzeigen</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                `;
                
                // Füge Link nach dem Text-Container ein
                proseContainer.appendChild(readMoreLink);
                
                // Link Event Listener
                readMoreLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    const isCollapsed = textContainer.classList.contains('collapsed');
                    
                    if (isCollapsed) {
                        // Erweitern
                        textContainer.classList.remove('collapsed');
                        readMoreLink.classList.add('expanded');
                        readMoreLink.querySelector('.read-more-text').textContent = 'weniger anzeigen';
                        
                        // Smooth scroll zum Artikel
                        article.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start',
                            inline: 'nearest'
                        });
                    } else {
                        // Kollabieren
                        textContainer.classList.add('collapsed');
                        readMoreLink.classList.remove('expanded');
                        readMoreLink.querySelector('.read-more-text').textContent = 'mehr anzeigen';
                        
                        // Scroll zum Anfang des Artikels
                        article.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start',
                            inline: 'nearest'
                        });
                    }
                    
                    console.log(`📖 Article ${index + 1} ${isCollapsed ? 'expanded' : 'collapsed'}`);
                });
            } else {
                // Text ist kurz genug - entferne collapsed Klasse
                textContainer.classList.remove('collapsed');
            }
        });
        
        const deviceType = window.innerWidth <= 768 ? 'Mobile' : 'Desktop';
        console.log(`📚 Initialized ${deviceType} read-more for ${articles.length} articles`);
    }
    
    // Window resize handler - Re-init bei Bildschirmgrößen-Änderung
    window.addEventListener('resize', function() {
        // Entferne bestehende Read-More Elemente
        document.querySelectorAll('.read-more-link').forEach(link => link.remove());
        document.querySelectorAll('.article-text').forEach(container => {
            const parent = container.parentNode;
            container.querySelectorAll('p').forEach(p => {
                parent.insertBefore(p, container);
            });
            container.remove();
        });
        
        // Re-init Read-More nach kurzer Verzögerung
        setTimeout(() => {
            initReadMore();
        }, 100);
    });

    // ========== Utility Functions ==========
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });
        
        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    function generateMockNews(count) {
        const mockTitles = [
            'Erfolgreiche Teilnahme am Bezirkspokal',
            'Neue Trainingszeiten ab März',
            'Jahreshauptversammlung 2025',
            'Gastronomie-Erweiterung geplant',
            'Jugendförderung im Fokus',
            'Modernisierung der Schießanlage'
        ];
        
        const mockExcerpts = [
            'Unser Verein konnte beim diesjährigen Bezirkspokal hervorragende Ergebnisse erzielen...',
            'Ab dem kommenden Monat gelten neue Trainingszeiten für alle Disziplinen...',
            'Die diesjährige Jahreshauptversammlung findet am 15. März statt...',
            'Wir planen eine Erweiterung unserer Gastronomie um weitere Sitzplätze...',
            'Neue Initiative zur Förderung des Nachwuchses im Schießsport...',
            'Investitionen in moderne Technik für unsere Schießanlage geplant...'
        ];
        
        const mockTags = ['vereinsleben', 'wettkampf', 'training', 'gastronomie', 'jugend', 'modernisierung'];
        
        const news = [];
        for (let i = 0; i < count; i++) {
            news.push({
                title: mockTitles[i % mockTitles.length],
                excerpt: mockExcerpts[i % mockExcerpts.length],
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE'),
                tags: [mockTags[Math.floor(Math.random() * mockTags.length)]],
                image: '../../Bilder/Schützenverein Logo.jpeg'
            });
        }
        return news;
    }
    
    function createNewsCard(newsItem) {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.dataset.tags = newsItem.tags.join(',');
        
        card.innerHTML = `
            <img src="${newsItem.image}" alt="${newsItem.title}" class="news-card-image">
            <div class="news-card-content">
                <div class="news-card-date">${newsItem.date}</div>
                <h3 class="news-card-title">${newsItem.title}</h3>
                <p class="news-card-excerpt">${newsItem.excerpt}</p>
                <div class="news-card-tags">
                    ${newsItem.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
                </div>
                <a href="#" class="news-read-more">
                    Weiterlesen →
                </a>
            </div>
        `;
        
        return card;
    }
    
    // ========== Social Media Sharing ==========
    function initSocialSharing() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.dataset.platform;
                const url = window.location.href;
                const title = document.title;
                
                let shareUrl;
                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }
    
    // ========== Seiten-spezifische Initialisierung ==========
    function initPageSpecificFeatures() {
        // Highlight current page in navigation
        const currentPageLink = document.querySelector('nav a[href*="aktuelles"]');
        if (currentPageLink) {
            currentPageLink.classList.add('active');
        }
        
        // Add smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // ========== Error Handling ==========
    function setupErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('❌ JavaScript error on Aktuelles page:', e.error);
        });
        
        window.addEventListener('unhandledrejection', function(e) {
            console.error('❌ Unhandled promise rejection on Aktuelles page:', e.reason);
        });
    }
    
    // ========== Initialisierung aller Funktionen ==========
    try {
        initNewsFilters();
        initNewsletterSignup();
        initLoadMore();
        initNewsCardAnimations();
        initNewsSearch();
        initSocialSharing();
        initPageSpecificFeatures();
        setupErrorHandling();
        initReadMore();
        
        console.log('✅ All Aktuelles page features initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing Aktuelles page features:', error);
    }
});

// ========== Export für Wiederverwendung ==========
window.AktuellesPage = {
    showNotification: function(message, type) {
        // Re-export notification function for external use
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        }
    }
};
