class HomepageNewsManager {
    constructor() {
        // Verwende einen relativen Pfad wie in strapi-api.js
        this.apiUrl = '/api';
        this.newsContainer = document.querySelector('#aktuelles .grid');
        this.populateImages = true;
        console.log('🏠 HomepageNewsManager initialized');
        this.init();
    }
    
    async init() {
        try {
            await this.loadLatestNews();
        } catch (error) {
            console.error('❌ Fehler beim Laden der Homepage News:', error);
            // Fallback: Statische Inhalte anzeigen
            this.renderFallbackNews();
            console.log('📋 Fallback: Statische Inhalte werden verwendet');
        }
    }

    async loadLatestNews() {
        try {
            console.log('🔄 Loading latest news from:', `${this.apiUrl}/blogposts`);
            // Verwende dieselbe API-Struktur wie BlogpostManager
            const response = await fetch(`${this.apiUrl}/blogposts?populate=*&sort=publishedDate:desc&pagination[limit]=3`);
            
            if (!response.ok) {
                console.error(`❌ API-Fehler: HTTP ${response.status} beim Laden der News`);
                console.error(`📌 URL: ${this.apiUrl}/blogposts?populate=*&sort=publishedDate:desc&pagination[limit]=3`);
                console.error(`📌 Hinweis: Überprüfen Sie, ob die API-URL '${this.apiUrl}' korrekt ist und der Server läuft.`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📊 Homepage news data loaded:', data);
            
            // Handle both old and new Strapi response format
            const blogposts = data.data || data;
            
            if (blogposts && blogposts.length > 0) {
                // Log image information for debugging
                if (blogposts[0].attributes && blogposts[0].attributes.image) {
                    console.log('🔍 Beispiel-Bildstruktur:', JSON.stringify(blogposts[0].attributes.image, null, 2));
                } else if (blogposts[0].image) {
                    console.log('🔍 Beispiel-Bildstruktur:', JSON.stringify(blogposts[0].image, null, 2));
                }
                
                this.renderNews(blogposts);
                console.log(`✅ ${blogposts.length} dynamische News-Artikel erfolgreich geladen`);
            } else {
                console.log('📝 Keine dynamischen News verfügbar - statische Inhalte bleiben');
                console.warn('⚠️ API-Antwort enthält keine Blogposts. Überprüfen Sie das Datenformat und die API-Konfiguration.');
            }
        } catch (error) {
            console.error('❌ Fehler beim Abrufen der Blogposts:', error);
            console.error('📌 Prüfen Sie die Netzwerkkonsole auf weitere Details.');
            console.error('📌 Falls die Seite auf einem anderen Ursprung als Strapi läuft, könnte es CORS-Probleme geben.');
            throw error;
        }
    }

    renderNews(blogposts) {
        if (!this.newsContainer) {
            console.warn('News Container nicht gefunden');
            return;
        }

        const newsHTML = blogposts.map(blogpost => this.createNewsCard(blogpost)).join('');
        this.newsContainer.innerHTML = newsHTML;
    }

    createNewsCard(blogpost) {
        // Handle both attribute-based and direct property access (wie im BlogpostManager)
        let title, content, excerpt, publishedDate, category, image;
        
        try {
            if (blogpost.attributes) {
                // New Strapi v4+ format
                ({ title, content, excerpt, publishedDate, category, image } = blogpost.attributes);
                console.log('🔄 Strapi v4+ Format erkannt für Artikel');
            } else {
                // Direct properties or old format
                ({ title, content, excerpt, publishedDate, category, image } = blogpost);
                console.log('🔄 Direktes Eigenschaftenformat erkannt für Artikel');
            }
            
            // Geben Warnung aus, wenn wichtige Daten fehlen
            if (!title) console.warn('⚠️ Artikel ohne Titel gefunden!');
            if (!content && !excerpt) console.warn('⚠️ Artikel ohne Inhalt und Zusammenfassung gefunden:', title);
            
            console.log('📝 Creating homepage news card for:', title || 'Unbenannter Artikel');
        } catch (error) {
            // Fehlerbehandlung hinzugefügt
            console.error('❌ Fehler bei der Verarbeitung des Blogposts:', error);
            console.error('📌 Problematischer Blogpost:', JSON.stringify(blogpost, null, 2));
            title = 'Titel nicht verfügbar';
            content = 'Inhalt konnte nicht geladen werden.';
            excerpt = null;
            publishedDate = new Date().toISOString();
            image = null;
        }
        
        // Prüfe ob Bild vorhanden ist
        const hasImage = this.hasValidImage(image);
        const imageUrl = hasImage ? this.getImageUrl(image) : null;
        
        const formattedDate = this.formatDate(publishedDate);

        // Alle Karten haben dieselbe Grundstruktur
        const cardClasses = "bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg";
        const contentClasses = "p-6";

        // Erstelle Content basierend auf Bild-Verfügbarkeit
        let displayContent, extendedContent;
        if (hasImage) {
            // Mit Bild: Nur Excerpt oder kurzer Content (50 Wörter)
            displayContent = excerpt || this.createExcerpt(content, 50);
            extendedContent = '';
        } else {
            // Ohne Bild: Excerpt als Haupttext + mehr Content unten (7 Zeilen)
            displayContent = excerpt || this.createExcerpt(content, 60);
            extendedContent = this.createExtendedContent(excerpt, content);
        }

        // Layout unterscheidet sich je nach Bild-Verfügbarkeit
        if (hasImage) {
            // Mit Bild: Standard Layout
            return `
                <div class="${cardClasses}">
                    <div class="h-48 overflow-hidden">
                        <img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                             onerror="this.style.display='none'; this.parentElement.style.display='none';">
                    </div>
                    <div class="${contentClasses}">
                        <span class="text-sm text-green-700 font-medium">${formattedDate}</span>
                        <h3 class="text-xl font-semibold mt-2 mb-3">${title}</h3>
                        <div class="text-gray-700 mb-4 text-base leading-relaxed">${displayContent}</div>
                        <a href="pages/aktuelles/index.html" class="text-green-700 font-medium hover:text-green-800 transition-colors flex items-center text-sm">
                            Mehr anzeigen
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            `;        } else {            // Ohne Bild: Titel oben, kompakter Content unten zum Füllen (6 Zeilen)
            return `
                <div class="${cardClasses} min-h-[400px] flex flex-col">
                    <div class="${contentClasses} flex-1 flex flex-col">
                        <div>
                            <span class="text-sm text-green-700 font-medium">${formattedDate}</span>
                            <h3 class="text-xl font-semibold mt-2 mb-3">${title}</h3>
                            <div class="text-gray-700 mb-4 text-base leading-relaxed">${displayContent}</div>
                        </div>
                        <div class="w-8 h-1 bg-green-700 my-4"></div>
                        <div class="flex-1 text-gray-600 text-sm leading-relaxed mb-4">
                            ${extendedContent}
                        </div>
                        <a href="pages/aktuelles/index.html" class="text-green-700 font-medium hover:text-green-800 transition-colors flex items-center text-sm mt-auto">
                            Mehr anzeigen
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
        }
    }    hasValidImage(imageData) {
        if (!imageData || !this.populateImages) {
            console.log('📷 No image data or image population disabled');
            return false;
        }

        // Strapi v5 format: imageData.url directly
        if (imageData.url && typeof imageData.url === 'string') {
            console.log('✅ Found Strapi v5 image:', imageData.url);
            return true;
        }
        
        // Strapi v4 format: image.data.attributes.url
        if (imageData.data && imageData.data.attributes && imageData.data.attributes.url) {
            console.log('✅ Found Strapi v4 image:', imageData.data.attributes.url);
            return true;
        }
        
        console.log('📷 Image data structure not recognized:', JSON.stringify(imageData, null, 2));
        return false;
    }

    createExcerpt(content, maxWords) {
        if (!content) return 'Inhalt nicht verfügbar.';
        
        // HTML-Tags entfernen
        const textContent = content.replace(/<[^>]*>/g, '');
        
        const words = textContent.split(' ');
        if (words.length <= maxWords) {
            return textContent;
        }
        
        return words.slice(0, maxWords).join(' ') + '...';
    }    createExtendedContent(excerpt, content) {
        // Für Karten ohne Bild: Nur etwa 6 Zeilen Text (ca. 50-60 Wörter)
        let extendedText = '';
        
        if (content) {
            // Entferne HTML-Tags vom Content
            const cleanContent = content.replace(/<[^>]*>/g, '');
            
            if (excerpt) {
                // Finde Text nach dem Excerpt
                const excerptEnd = cleanContent.toLowerCase().indexOf(excerpt.toLowerCase());
                if (excerptEnd !== -1) {
                    // Nehme Text nach dem Excerpt (begrenzt auf 6 Zeilen)
                    const additionalContent = cleanContent.substring(excerptEnd + excerpt.length).trim();
                    extendedText = this.createExcerpt(additionalContent, 50);
                } else {
                    // Fallback: Nehme Anfang des Contents
                    extendedText = this.createExcerpt(cleanContent, 50);
                }
            } else {
                // Kein Excerpt: Nehme begrenzten Content (6 Zeilen)
                extendedText = this.createExcerpt(cleanContent, 60);
            }
        } else {
            extendedText = 'Weitere Informationen zu diesem Artikel folgen in Kürze. Besuchen Sie unsere Aktuelles-Seite für mehr Details.';
        }
        
        return extendedText;
    }    getImageUrl(imageData) {
        if (!imageData || !this.populateImages) {
            console.warn('⚠️ Kein Bilddatenobjekt vorhanden oder Bilder deaktiviert');
            return null;
        }
        
        try {
            // Strapi v5 format: imageData ist ein Objekt mit url-Property
            if (imageData.url && typeof imageData.url === 'string') {
                // Falls es schon eine vollständige URL ist, belassen wir es dabei
                if (imageData.url.startsWith('http')) {
                    console.log('✅ Using absolute Strapi v5 image URL:', imageData.url);
                    return imageData.url;
                }
                
                // Wir verwenden eine absolute URL mit dem Strapi-Server
                const strapiBaseUrl = 'http://217.154.226.43:1337';
                const absoluteUrl = imageData.url.startsWith('/') 
                    ? `${strapiBaseUrl}${imageData.url}`
                    : `${strapiBaseUrl}/${imageData.url}`;
                    
                console.log('✅ Using absolute Strapi v5 image URL:', absoluteUrl);
                
                return absoluteUrl;
            }
            
            // Strapi v4 format: image.data.attributes.url
            if (imageData.data && imageData.data.attributes && imageData.data.attributes.url) {
                // Falls es schon eine vollständige URL ist, belassen wir es dabei
                if (imageData.data.attributes.url.startsWith('http')) {
                    console.log('✅ Using absolute Strapi v4 image URL:', imageData.data.attributes.url);
                    return imageData.data.attributes.url;
                }
                
                // Wir verwenden eine absolute URL mit dem Strapi-Server
                const strapiBaseUrl = 'http://217.154.226.43:1337';
                const absoluteUrl = imageData.data.attributes.url.startsWith('/') 
                    ? `${strapiBaseUrl}${imageData.data.attributes.url}`
                    : `${strapiBaseUrl}/${imageData.data.attributes.url}`;
                    
                console.log('✅ Using absolute Strapi v4 image URL:', absoluteUrl);
                
                return absoluteUrl;
            }

            // Direkter URL String (für Fallback)
            if (typeof imageData === 'string') {
                // Falls es eine absolute URL ist
                if (imageData.startsWith('http')) {
                    console.log('✅ Using absolute fallback image URL:', imageData);
                    return imageData;
                }
                
                // Bei Fallback-Bildern: Unterscheiden zwischen Strapi-Bildern und lokalen Bildern
                console.log('✅ Processing fallback image path:', imageData);
                
                // Für lokale Frontend-Bilder (meist in Fallback-News verwendet)
                if (imageData.includes('/Bilder/')) {
                    console.log('✅ Using local frontend image path:', imageData);
                    return imageData;
                }
                
                // Für Strapi-Bilder (aus der API)
                const strapiBaseUrl = 'http://217.154.226.43:1337';
                const absoluteUrl = imageData.startsWith('/') 
                    ? `${strapiBaseUrl}${imageData}`
                    : `${strapiBaseUrl}/${imageData}`;
                    
                console.log('✅ Using absolute Strapi fallback image URL:', absoluteUrl);
                return absoluteUrl;
            }
            
            // Unbekanntes Bildformat - geben wir detaillierte Logs aus
            console.error('❌ Unbekanntes Bildformat:', typeof imageData);
            console.error('� Bilddatenstruktur:', JSON.stringify(imageData, null, 2));
            console.warn('📌 Tipp: Stellen Sie sicher, dass das CMS die Bilder im erwarteten Format zurückgibt.');
            return null;
        } catch (error) {
            console.error('❌ Fehler bei der Verarbeitung des Bildpfads:', error);
            console.error('📌 Bilddaten:', JSON.stringify(imageData, null, 2));
            console.warn('📌 Tipp: Überprüfen Sie die Konsole auf JS-Fehler bei der Bildverarbeitung.');
            return null;
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'Unbekanntes Datum';
        
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        return date.toLocaleDateString('de-DE', options);
    }

    renderFallbackNews() {
        if (!this.newsContainer) {
            console.warn('News Container nicht gefunden');
            return;
        }

        const fallbackNews = [
            {
                title: "Ortspokal 2024",
                excerpt: "Herzlichen Glückwunsch an alle Gewinner des Ortspokals 2024! Eine großartige Leistung unseres Teams.",
                publishedDate: "2025-05-15",
                image: { url: "/Bilder/Schützenverein ortspokal gewinner 2024.jpg" }
            },
            {
                title: "Wambefeschd 2022",
                excerpt: "Nach zweijähriger Pause eröffneten unsere Salutschützen das Wambefeschd 2022 und feierten gemeinsam im Anschluss.",
                publishedDate: "2022-08-20",
                image: { url: "/Bilder/Schützenverein am Schießen 2.jpg" }
            },
            {
                title: "Neue Ausrüstung eingetroffen",
                excerpt: "Wir freuen uns, die Ankunft neuer Trainingsgeräte und Ausrüstung für unseren Verein bekannt zu geben.",
                publishedDate: "2025-04-10",
                image: { url: "/Bilder/Schützenverein Luftdruckhalle.jpeg" }
            }
        ];

        const newsHTML = fallbackNews.map(newsItem => this.createNewsCard(newsItem)).join('');
        this.newsContainer.innerHTML = newsHTML;
        console.log('✅ Fallback News erfolgreich geladen');
    }
}

// Homepage News Manager initialisieren, wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new HomepageNewsManager();
});
