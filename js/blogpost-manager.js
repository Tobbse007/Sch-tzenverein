// Blogpost Manager - Behebt Bildgrößen und doppelte Read-More Buttons
// Diese Datei lädt dynamisch Blogposts von Strapi und zeigt sie auf der Aktuelles-Seite an
class BlogpostManager {
    constructor() {
        // Verwende einen relativen Pfad für die API
        this.apiUrl = '/api';
        // URL für Bilder bleibt absolut für korrekte Anzeige
        this.imageBaseUrl = 'http://217.154.226.43:1337';
        this.blogpostsContainer = null;
        this.loadingIndicator = null;
        this.populateImages = true;
        this.init();
    }
    
    init() {
        console.log('🚀 BlogpostManager initialized');
        this.createLoadingIndicator();
        this.findContainer();
        this.loadBlogposts();
    }
    
    createLoadingIndicator() {
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'loading-indicator text-center py-12';
        this.loadingIndicator.innerHTML = `
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-green-600 bg-white transition ease-in-out duration-150">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Blogposts werden geladen...
            </div>
        `;
    }
    
    findContainer() {
        // Suche nach dem Container für dynamische Blogposts
        this.blogpostsContainer = document.querySelector('#dynamic-blogposts-container');
        if (!this.blogpostsContainer) {
            console.error('❌ Blogposts container (#dynamic-blogposts-container) not found');
            console.log('Available containers:', document.querySelectorAll('[id*="container"], [class*="container"], [class*="news"]'));
            return;
        }
        // Zeige Loading-Indikator
        this.blogpostsContainer.appendChild(this.loadingIndicator);
        console.log('✅ Container found and loading indicator added');
    }
    async loadBlogposts() {
        try {
            console.log('🔄 Loading blogposts from:', `${this.apiUrl}/blogposts`);
            const response = await fetch(`${this.apiUrl}/blogposts?populate=*&sort=publishedDate:desc`);
            if (!response.ok) {
                console.error(`❌ API-Fehler: HTTP ${response.status} beim Laden der Blogposts`);
                console.error(`📌 URL: ${this.apiUrl}/blogposts?populate=*&sort=publishedDate:desc`);
                console.error(`📌 Hinweis: Überprüfen Sie, ob die API-URL '${this.apiUrl}' korrekt ist und der Server läuft.`);
                console.error(`📌 Image Base URL: ${this.imageBaseUrl} wird für Bilder verwendet.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📊 Blogposts data loaded:', data);
            
            // Handle both old and new Strapi response format
            const blogposts = data.data || data;
            
            // Log image information for debugging
            if (blogposts && blogposts.length > 0) {
                if (blogposts[0].attributes && blogposts[0].attributes.image) {
                    console.log('🔍 Beispiel-Bildstruktur:', JSON.stringify(blogposts[0].attributes.image, null, 2));
                } else if (blogposts[0].image) {
                    console.log('🔍 Beispiel-Bildstruktur:', JSON.stringify(blogposts[0].image, null, 2));
                }
            }
            
            this.renderBlogposts(blogposts);
        } catch (error) {
            console.error('❌ Error loading blogposts:', error);
            console.error('📌 Prüfen Sie die Netzwerkkonsole auf weitere Details.');
            console.error('📌 Falls die Seite auf einem anderen Ursprung als Strapi läuft, könnte es CORS-Probleme geben.');
            this.showError();
        }
    }
    renderBlogposts(blogposts) {
        if (!blogposts || blogposts.length === 0) {
            this.showNoBlogposts();
            return;
        }
        // Entferne Loading-Indikator
        if (this.loadingIndicator) {
            this.loadingIndicator.remove();
        }
        // Entferne existierende statische Artikel
        const existingArticles = this.blogpostsContainer.querySelectorAll('article');
        existingArticles.forEach(article => article.remove());
        // Erstelle neue Artikel aus Strapi-Daten
        blogposts.forEach((blogpost, index) => {
            const article = this.createBlogpostElement(blogpost, index);
            this.blogpostsContainer.appendChild(article);
        });
        console.log(`✅ ${blogposts.length} blogposts rendered successfully`);
    }    createBlogpostElement(blogpost, index) {
        // Handle both attribute-based and direct property access
        let title, content, excerpt, publishedDate, category, image;
        
        try {
            if (blogpost.attributes) {
                // New Strapi v4+ format
                ({ title, content, excerpt, publishedDate, category, image } = blogpost.attributes);
                console.log('🔄 Strapi v4+ Format erkannt für Blogpost');
            } else {
                // Direct properties or old format
                ({ title, content, excerpt, publishedDate, category, image } = blogpost);
                console.log('🔄 Direktes Eigenschaftenformat erkannt für Blogpost');
            }
            
            // Geben Warnung aus, wenn wichtige Daten fehlen
            if (!title) console.warn('⚠️ Blogpost ohne Titel gefunden!');
            if (!content) console.warn('⚠️ Blogpost ohne Inhalt gefunden:', title);
            
            console.log('📝 Creating article for:', title || 'Unbenannter Artikel');
        } catch (error) {
            console.error('❌ Fehler bei der Verarbeitung des Blogposts:', error);
            console.error('📌 Problematischer Blogpost:', JSON.stringify(blogpost, null, 2));
            title = 'Titel nicht verfügbar';
            content = 'Inhalt konnte nicht geladen werden.';
            excerpt = null;
            publishedDate = new Date().toISOString();
            image = null;
        }
        
        // Erstelle eindeutige ID für jeden Artikel
        const uniqueId = blogpost.id || `article-${index}-${Date.now()}`;
        
        // Formatiere Datum
        const formattedDate = new Date(publishedDate).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        // Bestimme Hintergrundfarbe basierend auf Index
        const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';        // Erstelle robuste Bild-URL nur für Strapi-Bilder
        let imageUrl = null;
        let hasValidImage = false;
        
        if (image && this.populateImages) {
            // Strapi v5 format: image.url directly
            if (image.url && typeof image.url === 'string') {
                // Absolute URL für Bilder vom Strapi-Server
                if (image.url.startsWith('http')) {
                    imageUrl = image.url;
                } else {
                    // Füge die absolute Basis-URL hinzu
                    imageUrl = `${this.imageBaseUrl}${image.url.startsWith('/') ? image.url : '/' + image.url}`;
                }
                hasValidImage = true;
                console.log('✅ Using Strapi v5 image:', imageUrl);
            }
            // Strapi v4 format: image.data.attributes.url
            else if (image.data && image.data.attributes && image.data.attributes.url) {
                // Absolute URL für Bilder vom Strapi-Server
                if (image.data.attributes.url.startsWith('http')) {
                    imageUrl = image.data.attributes.url;
                } else {
                    // Füge die absolute Basis-URL hinzu
                    imageUrl = `${this.imageBaseUrl}${image.data.attributes.url.startsWith('/') ? image.data.attributes.url : '/' + image.data.attributes.url}`;
                }
                hasValidImage = true;
                console.log('✅ Using Strapi v4 image:', imageUrl);
            }
        }        // Erstelle Artikel-Element
        const article = document.createElement('article');
        article.className = `w-full ${bgClass} py-12 group`;
        
        // Bild-HTML nur wenn gültiges Bild vorhanden
        const imageHtml = hasValidImage ? `
                <div class="relative overflow-hidden rounded-2xl mb-8 shadow-xl">
                    <img src="${imageUrl}" alt="${title}" class="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                         onload="console.log('✅ Strapi image loaded:', this.src)"
                         onerror="console.log('❌ Strapi image failed:', this.src); this.style.display='none'; this.parentElement.style.display='none';">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>` : '';
        
        article.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-8">
                    <div class="flex items-center justify-center gap-4 mb-6">
                        <span class="text-gray-500 text-base">${formattedDate}</span>
                        ${category ? `<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">${category}</span>` : ''}
                    </div>
                    <h3 class="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 transition-colors leading-tight">
                        ${title}
                    </h3>
                </div>
                ${imageHtml}                <div class="max-w-none article-content" style="line-height: 1.4;">
                    ${excerpt ? `<p class="text-gray-700 text-2xl" style="margin-bottom: 12px; line-height: 1.4; font-weight: 500;">${excerpt}</p>` : ''}
                    ${excerpt ? `<hr style="border: none; border-top: 3px solid #15803d; margin: 16px 0; width: 80px;">` : ''}                    <div class="text-gray-600 text-lg content-wrapper" style="line-height: 1.4;">
                        ${this.formatContentWithReadMore(content, uniqueId)}
                    </div>
                </div>
            </div>
        `;
        return article;
    }    formatContentWithReadMore(content, articleId) {
        const formattedContent = this.formatContent(content);
        
        // Konfiguration für Read More
        const maxWordsDesktop = 100; // Maximale Anzahl Wörter für Desktop
        const maxWordsMobile = 50;   // Maximale Anzahl Wörter für Mobile (reduziert)
        
        // Prüfe ob Content zu lang ist
        const words = this.extractWords(formattedContent);
        const shouldTruncate = words.length > maxWordsDesktop;
        
        if (!shouldTruncate) {
            return formattedContent;
        }
        
        // Erstelle gekürzten Content
        const desktopPreview = this.createPreview(words, maxWordsDesktop);
        const mobilePreview = this.createPreview(words, maxWordsMobile);
        
        return `
            <!-- Desktop Preview -->
            <div class="hidden md:block">
                <div class="content-preview-${articleId}">
                    ${desktopPreview}
                </div>
                <div class="content-full-${articleId}" style="display: none;">
                    ${formattedContent}
                </div>
                <span class="read-more-link inline-flex items-center text-green-600 hover:text-green-700 cursor-pointer text-sm font-medium mt-2" 
                      onclick="window.blogpostManager.toggleReadMore('${articleId}', 'desktop')" 
                      data-article="${articleId}" 
                      data-device="desktop">
                    <span class="link-text">Weiterlesen</span>
                    <svg class="w-3 h-3 ml-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </span>
            </div>
            
            <!-- Mobile Preview -->
            <div class="block md:hidden">
                <div class="content-preview-mobile-${articleId}">
                    ${mobilePreview}
                </div>
                <div class="content-full-mobile-${articleId}" style="display: none;">
                    ${formattedContent}
                </div>
                <span class="read-more-link inline-flex items-center text-green-600 hover:text-green-700 cursor-pointer text-sm font-medium mt-2" 
                      onclick="window.blogpostManager.toggleReadMore('${articleId}', 'mobile')" 
                      data-article="${articleId}" 
                      data-device="mobile">
                    <span class="link-text">Weiterlesen</span>
                    <svg class="w-3 h-3 ml-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </span>
            </div>
        `;
    }
    
    extractWords(htmlContent) {
        // Entferne HTML-Tags und extrahiere Wörter
        const textContent = htmlContent.replace(/<[^>]*>/g, ' ');
        return textContent.split(/\s+/).filter(word => word.trim().length > 0);
    }
    
    createPreview(words, maxWords) {
        const previewWords = words.slice(0, maxWords);
        const previewText = previewWords.join(' ');
        
        // Füge die Wörter wieder in HTML-Struktur ein
        return `<p style="margin-bottom: 8px; line-height: 1.4;">${previewText}...</p>`;
    }
    
    getTextLength(htmlContent) {
        const textContent = htmlContent.replace(/<[^>]*>/g, '');
        return textContent.length;
    }
      toggleReadMore(articleId, device) {
        const prefix = device === 'mobile' ? 'mobile-' : '';
        const previewElement = document.querySelector(`.content-preview-${prefix}${articleId}`);
        const fullElement = document.querySelector(`.content-full-${prefix}${articleId}`);
        const link = document.querySelector(`[data-article="${articleId}"][data-device="${device}"]`);
        
        if (!previewElement || !fullElement || !link) {
            console.error('Read more elements not found:', { articleId, device });
            return;
        }
        
        const isExpanded = fullElement.style.display !== 'none';
        
        if (isExpanded) {
            // Zuklappen
            previewElement.style.display = 'block';
            fullElement.style.display = 'none';
            link.querySelector('.link-text').textContent = 'Weiterlesen';
            link.querySelector('svg').style.transform = 'rotate(0deg)';
        } else {
            // Aufklappen
            previewElement.style.display = 'none';
            fullElement.style.display = 'block';
            link.querySelector('.link-text').textContent = 'Weniger anzeigen';
            link.querySelector('svg').style.transform = 'rotate(180deg)';
            
            // Smooth scroll zum aufgeklappten Content
            setTimeout(() => {
                fullElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        }
    }

    formatContent(content) {
        // Einfache Formatierung für Rich Text Content
        if (!content) return '';
        
        // Falls es Rich Text ist, extrahiere den Text
        if (Array.isArray(content)) {            return content.map(block => {
                if (block.type === 'paragraph') {
                    const text = block.children.map(child => child.text).join('');
                    return `<p style="margin-bottom: 8px; line-height: 1.4;">${text}</p>`;
                }
                return '';
            }).join('');        }        // Falls es einfacher Text ist
        return content.split('\n').map(paragraph =>
            paragraph.trim() ? `<p style="margin-bottom: 8px; line-height: 1.4;">${paragraph}</p>` : ''
        ).join('');
    }
    showError() {
        if (this.loadingIndicator) {
            this.loadingIndicator.innerHTML = `
                <div class="text-center py-12">
                    <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-red-600 bg-red-50 border border-red-200">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                        </svg>
                        Fehler beim Laden der Blogposts. Bitte versuchen Sie es später erneut.
                    </div>
                </div>
            `;
        }
    }
    showNoBlogposts() {
        if (this.loadingIndicator) {
            this.loadingIndicator.innerHTML = `
                <div class="text-center py-12">
                    <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-600 bg-gray-50 border border-gray-200">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                        </svg>
                        Keine Blogposts verfügbar.
                    </div>
                </div>
            `;
        }
    }
}
// Initialisiere BlogpostManager, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    // Prüfe, ob wir auf der Aktuelles-Seite sind
    if (window.location.pathname.includes('aktuelles')) {
        console.log('🎯 Aktuelles page detected, initializing BlogpostManager');
        const blogpostManager = new BlogpostManager();
        // Stelle sicher, dass die Instanz global verfügbar ist für die Toggle-Funktion
        window.blogpostManager = blogpostManager;
    }
});
// Export für eventuelle weitere Verwendung
window.BlogpostManager = BlogpostManager;
