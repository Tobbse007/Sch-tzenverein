/**
 * Zentrale API-Funktionen für die Schützenverein-Website
 * Lädt dynamische Daten von Strapi CMS
 */

// Strapi API Base URL
const STRAPI_API_BASE = '/api';


/**
 * Hilfsfunktion für API-Aufrufe
 */
async function fetchFromStrapi(endpoint) {
    try {
        const response = await fetch(`${STRAPI_API_BASE}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.data;
        } else {
            console.error(`API Fehler für ${endpoint}:`, response.status);
            return null;
        }
    } catch (error) {
        console.error(`Netzwerk-Fehler für ${endpoint}:`, error);
        return null;
    }
}

/**
 * Lade Trainingszeiten von der API
 */
async function loadTrainingszeiten() {
    console.log('Lade Trainingszeiten von der API...');
    return await fetchFromStrapi('trainingszeiten');
}

/**
 * Lade Mitgliedschaftspreise von der API
 */
async function loadMitgliedschaftspreise() {
    console.log('Lade Mitgliedschaftspreise von der API...');
    return await fetchFromStrapi('mitgliedschaftspreise');
}

/**
 * Lade Gastschützenpreise von der API
 */
async function loadGastschuetzenpreise() {
    console.log('Lade Gastschützenpreise von der API...');
    return await fetchFromStrapi('gastschuetzenpreise');
}

/**
 * Lade Gastronomie-Öffnungszeiten von der API
 */
async function loadGastronomieOeffnungszeiten() {
    console.log('Lade Gastronomie-Öffnungszeiten von der API...');
    return await fetchFromStrapi('gastronomie-oeffnungszeiten');
}

/**
 * Hilfsfunktionen für Trainingszeiten
 */
const TrainingUtils = {
    /**
     * Formatiere Zeit von "HH:MM:SS.sss" zu "HH:MM"
     */
    formatTime(timeString) {
        if (!timeString) return '';
        const time = timeString.split(':');
        return `${time[0]}:${time[1]}`;
    },
    
    /**
     * Übersetze Wochentag von API-Format zu deutschem Namen
     */
    translateWochentag(wochentag) {
        const days = {
            'montag': 'Montag',
            'dienstag': 'Dienstag',
            'mittwoch': 'Mittwoch',
            'donnerstag': 'Donnerstag',
            'freitag': 'Freitag',
            'samstag': 'Samstag',
            'sonntag': 'Sonntag'
        };
        return days[wochentag.toLowerCase()] || wochentag;
    },
    
    /**
     * Erstelle Zeit-Text basierend auf Start- und Endzeit
     */
    createTimeText(startzeit, endzeit) {
        const start = this.formatTime(startzeit);
        const end = this.formatTime(endzeit);
        
        if (start && end) {
            return `${start} - ${end} Uhr`;
        } else if (start) {
            return `ab ${start} Uhr`;
        } else {
            return 'Zeit nach Vereinbarung';
        }
    },
      /**
     * Generiere Fallback-Trainingszeiten
     */
    getFallbackTrainingszeiten() {
        return [
            {
                wochentag: 'dienstag',
                startzeit: '17:00:00',
                endzeit: '20:00:00',
                beschreibung: 'Jugendtraining & Freies Training'
            },
            {
                wochentag: 'freitag',
                startzeit: '17:00:00',
                endzeit: '20:00:00',
                beschreibung: 'Freies Training'
            }
        ];
    }
};

/**
 * Hilfsfunktionen für Gastronomie-Öffnungszeiten
 */
const GastronomieUtils = {
    /**
     * Übersetze Wochentag von API-Format zu deutschem Namen
     */
    translateWochentag(wochentag) {
        const days = {
            'montag': 'Montag',
            'dienstag': 'Dienstag',
            'mittwoch': 'Mittwoch',
            'donnerstag': 'Donnerstag',
            'freitag': 'Freitag',
            'samstag': 'Samstag',
            'sonntag': 'Sonntag'
        };
        return days[wochentag.toLowerCase()] || wochentag;
    },
    
    /**
     * Formatiere Zeit von "HH:MM:SS.sss" zu "HH:MM"
     */
    formatTime(timeString) {
        if (!timeString) return '';
        const time = timeString.split(':');
        return `${time[0]}:${time[1]}`;
    },
    
    /**
     * Erstelle Zeitspanne-Text
     */
    createTimeRange(oeffnungszeit, schließzeit) {
        const start = this.formatTime(oeffnungszeit);
        const end = this.formatTime(schließzeit);
        
        if (start && end) {
            return `${start} - ${end} Uhr`;
        } else if (start) {
            return `ab ${start} Uhr`;
        } else {
            return 'Nach Vereinbarung';
        }
    },
    
    /**
     * Erstelle Wochentag-Bereich Text
     */
    createDayRange(vonWochentag, bisWochentag) {
        const von = this.translateWochentag(vonWochentag);
        const bis = this.translateWochentag(bisWochentag);
        
        if (von === bis) {
            return von;
        } else {
            return `${von} - ${bis}`;
        }
    },
    
    /**
     * Generiere Fallback-Öffnungszeiten
     */
    getFallbackOeffnungszeiten() {
        return [
            {
                von_wochentag: 'donnerstag',
                bis_wochentag: 'sonntag',
                oeffnungszeit: '17:00:00',
                schließzeit: '22:00:00',
                beschreibung: 'Reguläre Öffnungszeiten',
                ist_aktiv: true
            },
            {
                von_wochentag: 'montag',
                bis_wochentag: 'mittwoch',
                oeffnungszeit: '00:00:00',
                schließzeit: '00:00:00',
                beschreibung: 'Nur nach Vereinbarung',
                ist_aktiv: true
            }
        ];
    }
};

/**
 * Rendere Trainingszeiten für die Startseite (vereinfachtes Format)
 */
async function renderTrainingszeiten_Homepage(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID "${containerId}" nicht gefunden`);
        return;
    }
    
    let trainingszeiten = await loadTrainingszeiten();
    
    // Fallback verwenden, wenn API nicht verfügbar
    if (!trainingszeiten || trainingszeiten.length === 0) {
        console.log('Verwende Fallback-Trainingszeiten für Homepage');
        trainingszeiten = TrainingUtils.getFallbackTrainingszeiten();
    }
    
    // Container leeren
    container.innerHTML = '';
    
    // Trainingszeiten rendern
    trainingszeiten.forEach(training => {
        const wochentag = TrainingUtils.translateWochentag(training.wochentag);
        const zeitText = TrainingUtils.createTimeText(training.startzeit, training.endzeit);
        const beschreibung = training.beschreibung || 'Training';
        
        const trainingHTML = `
            <div class="border-l-4 border-green-600 pl-4 py-2">
                <h4 class="text-xl font-medium text-green-700">${wochentag}</h4>
                <p class="text-gray-700 mb-1">${zeitText}</p>
                <p class="text-gray-600 text-sm">${beschreibung}</p>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', trainingHTML);
    });
    
    console.log(`Trainingszeiten für Homepage gerendert: ${trainingszeiten.length} Termine`);
}

/**
 * Rendere Trainingszeiten für die Kontaktseite (Listenformat)
 */
async function renderTrainingszeiten_Kontakt(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID "${containerId}" nicht gefunden`);
        return;
    }
    
    // Sofort statische Daten laden als Fallback
    const fallbackTrainingszeiten = TrainingUtils.getFallbackTrainingszeiten();
    renderTrainingszeiten_Kontakt_Static(container, fallbackTrainingszeiten);
    
    try {
        // Versuche API-Daten zu laden
        let trainingszeiten = await loadTrainingszeiten();
        
        if (trainingszeiten && trainingszeiten.length > 0) {
            console.log('✅ API-Daten für Kontaktseite geladen, aktualisiere Anzeige');
            renderTrainingszeiten_Kontakt_Static(container, trainingszeiten);
        }
    } catch (error) {
        console.log('⚠️ API nicht verfügbar, verwende Fallback-Trainingszeiten für Kontaktseite');
    }
}

function renderTrainingszeiten_Kontakt_Static(container, trainingszeiten) {
    // Container leeren
    container.innerHTML = '';
    
    // Trainingszeiten rendern
    trainingszeiten.forEach((training) => {
        const wochentag = TrainingUtils.translateWochentag(training.wochentag);
        const zeitText = TrainingUtils.createTimeText(training.startzeit, training.endzeit);
        
        const trainingHTML = `
            <div class="flex justify-between items-center">
                <span class="font-medium">${wochentag}:</span>
                <span class="text-blue-600 font-semibold">${zeitText}</span>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', trainingHTML);
    });
    
    console.log(`✅ Trainingszeiten für Kontaktseite gerendert: ${trainingszeiten.length} Termine`);
}

/**
 * Rendere Trainingszeiten für Footer (einfaches Format)
 */
async function renderTrainingszeiten_Footer(containerId) {
    console.log(`🔄 renderTrainingszeiten_Footer gestartet für Container: ${containerId}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Container mit ID "${containerId}" nicht gefunden`);
        return;
    }
    
    console.log(`✅ Footer Container gefunden:`, container);
    
    // Sofort statische Daten laden als Fallback
    console.log('⚡ Lade sofort Fallback-Trainingszeiten für Footer...');
    const fallbackTrainingszeiten = TrainingUtils.getFallbackTrainingszeiten();
    renderTrainingszeiten_Footer_Static(container, fallbackTrainingszeiten);
    
    try {
        // Versuche API-Daten zu laden
        let trainingszeiten = await loadTrainingszeiten();
        console.log(`📡 Footer API-Antwort erhalten:`, trainingszeiten);
        
        if (trainingszeiten && trainingszeiten.length > 0) {
            console.log('✅ API-Daten verfügbar für Footer, ersetze Fallback-Daten');
            renderTrainingszeiten_Footer_Static(container, trainingszeiten);
        } else {
            console.log('⚠️ Keine API-Daten für Footer, behalte Fallback-Daten');
        }
    } catch (error) {
        console.error('❌ Fehler beim Laden der Footer API-Daten:', error);
        console.log('⚠️ Behalte Footer Fallback-Daten');
    }
}

function renderTrainingszeiten_Footer_Static(container, trainingszeiten) {
    // Container leeren
    container.innerHTML = '';
    console.log(`🧹 Footer Container geleert`);
    
    // Trainingszeiten rendern
    trainingszeiten.forEach((training, index) => {
        const wochentag = TrainingUtils.translateWochentag(training.wochentag);
        const zeitText = TrainingUtils.createTimeText(training.startzeit, training.endzeit);
        
        console.log(`🎨 Rendere Footer Training ${index + 1}: ${wochentag} ${zeitText}`);
        
        const trainingHTML = `
            <p>${wochentag}: ${zeitText}</p>
        `;
        
        container.insertAdjacentHTML('beforeend', trainingHTML);
        console.log(`✅ Footer Training ${index + 1} hinzugefügt`);
    });
      console.log(`Trainingszeiten für Footer gerendert: ${trainingszeiten.length} Termine`);
}

/**
 * Rendere Gastronomie-Öffnungszeiten
 */
async function renderGastronomieOeffnungszeiten(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID "${containerId}" nicht gefunden`);
        return;
    }
    
    let oeffnungszeiten = await loadGastronomieOeffnungszeiten();
    
    // Fallback verwenden, wenn API nicht verfügbar
    if (!oeffnungszeiten || oeffnungszeiten.length === 0) {
        console.log('Verwende Fallback-Öffnungszeiten für Gastronomie');
        oeffnungszeiten = GastronomieUtils.getFallbackOeffnungszeiten();
    }
    
    // Container leeren
    container.innerHTML = '';
    
    // Nur aktive Öffnungszeiten anzeigen, sortiert nach sortierung
    const aktiveOeffnungszeiten = oeffnungszeiten
        .filter(zeit => zeit.ist_aktiv !== false)
        .sort((a, b) => (a.sortierung || 1) - (b.sortierung || 1));
    
    // Öffnungszeiten rendern
    aktiveOeffnungszeiten.forEach(zeit => {
        const tageBereich = GastronomieUtils.createDayRange(zeit.von_wochentag, zeit.bis_wochentag);
        const zeitBereich = GastronomieUtils.createTimeRange(zeit.oeffnungszeit, zeit.schließzeit);
        const beschreibung = zeit.beschreibung || '';
        
        const zeitHTML = `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <div>
                    <span class="font-medium text-gray-800">${tageBereich}:</span>
                    ${beschreibung ? `<div class="text-sm text-gray-600">${beschreibung}</div>` : ''}
                </div>
                <span class="text-green-600 font-semibold">${zeitBereich}</span>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', zeitHTML);
    });
    
    console.log(`Gastronomie-Öffnungszeiten gerendert: ${aktiveOeffnungszeiten.length} Zeiten`);
}

/**
 * Rendere Gastronomie-Öffnungszeiten für Footer (einfaches Format)
 */
async function renderGastronomieOeffnungszeiten_Footer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID "${containerId}" nicht gefunden`);
        return;
    }
    
    let oeffnungszeiten = await loadGastronomieOeffnungszeiten();
    
    // Fallback verwenden, wenn API nicht verfügbar
    if (!oeffnungszeiten || oeffnungszeiten.length === 0) {
        console.log('Verwende Fallback-Öffnungszeiten für Footer');
        oeffnungszeiten = GastronomieUtils.getFallbackOeffnungszeiten();
    }
    
    // Container leeren
    container.innerHTML = '';
    
    // Nur aktive Öffnungszeiten anzeigen
    const aktiveOeffnungszeiten = oeffnungszeiten
        .filter(zeit => zeit.ist_aktiv !== false)
        .sort((a, b) => (a.sortierung || 1) - (b.sortierung || 1));
    
    // Öffnungszeiten rendern
    aktiveOeffnungszeiten.forEach(zeit => {
        const tageBereich = GastronomieUtils.createDayRange(zeit.von_wochentag, zeit.bis_wochentag);
        const zeitBereich = GastronomieUtils.createTimeRange(zeit.oeffnungszeit, zeit.schließzeit);
        
        const zeitHTML = `
            <p>${tageBereich}: ${zeitBereich}</p>
        `;
        
        container.insertAdjacentHTML('beforeend', zeitHTML);
    });
    
    console.log(`Gastronomie-Öffnungszeiten für Footer gerendert: ${aktiveOeffnungszeiten.length} Zeiten`);
}

/**
 * Rendere Preise für die Startseite
 */
async function renderPreise_Homepage() {
    console.log('Lade Preise für die Startseite...');
    
    // Lade beide Preistypen
    const mitgliedschaftspreise = await loadMitgliedschaftspreise();
    const gastschuetzenpreise = await loadGastschuetzenpreise();
    
    // Aktualisiere Mitgliedschaftspreise
    if (mitgliedschaftspreise && mitgliedschaftspreise.length > 0) {
        mitgliedschaftspreise.forEach(preisItem => {
            updateHomepagePrice(preisItem.bezeichnung, preisItem.preis);
        });
    } else {
        console.log('Keine Mitgliedschaftspreise von API erhalten, verwende statische Werte');
    }
    
    // Aktualisiere Gastschützenpreise
    if (gastschuetzenpreise && gastschuetzenpreise.length > 0) {
        gastschuetzenpreise.forEach(preisItem => {
            updateHomepageGuestPrice(preisItem.kategorie, preisItem.preis);
        });
    } else {
        console.log('Keine Gastschützenpreise von API erhalten, verwende statische Werte');
    }
}

/**
 * Hilfsfunktion: Mitgliedschaftspreis auf der Homepage aktualisieren
 */
function updateHomepagePrice(bezeichnung, preis) {
    let selector = '';
    
    switch(bezeichnung) {
        case 'jahresbeitrag_einzel':
            selector = '[data-price="jahresbeitrag-einzel"]';
            break;
        case 'jahresbeitrag_familie':
            selector = '[data-price="jahresbeitrag-familie"]';
            break;
        case 'jahresbeitrag_jugend':
            selector = '[data-price="jahresbeitrag-jugend"]';
            break;
        case 'aufnahmegebuehr':
            selector = '[data-price="aufnahmegebuehr"]';
            break;
    }
    
    if (selector) {
        const priceElement = document.querySelector(selector);
        if (priceElement) {
            priceElement.textContent = `${preis.toFixed(2)} €`;
            console.log(`Homepage-Preis aktualisiert: ${bezeichnung} = ${preis}€`);
        }
    }
}

/**
 * Hilfsfunktion: Gastschützenpreis auf der Homepage aktualisieren
 */
function updateHomepageGuestPrice(kategorie, preis) {
    let selector = '';
    
    switch(kategorie) {
        case 'luftdruck':
            selector = '[data-price="gast-luftdruck"]';
            break;
        case 'kk_schuetze_grundpreis':
            selector = '[data-price="gast-kk"]';
            break;
        case 'gk_schuetze_grundpreis':
            selector = '[data-price="gast-gk"]';
            break;
    }
    
    if (selector) {
        const priceElement = document.querySelector(selector);
        if (priceElement) {
            priceElement.textContent = `${preis.toFixed(2)} €`;
            console.log(`Homepage-Gastpreis aktualisiert: ${kategorie} = ${preis}€`);
        }
    }
}

// Export für Node.js, falls benötigt
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadTrainingszeiten,
        loadMitgliedschaftspreise,
        loadGastschuetzenpreise,
        loadGastronomieOeffnungszeiten,
        TrainingUtils,
        GastronomieUtils,        renderTrainingszeiten_Homepage,
        renderTrainingszeiten_Kontakt,
        renderTrainingszeiten_Footer,
        renderTrainingszeiten_KontaktHomepage,
        renderPreise_Homepage,
        renderGastronomieOeffnungszeiten,
        renderGastronomieOeffnungszeiten_Footer,
        renderGastronomieOeffnungszeiten_Homepage
    };
}

/**
 * Rendere Trainingszeiten für Homepage Kontakt-Section (Grid-Format)
 */
async function renderTrainingszeiten_KontaktHomepage(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID "${containerId}" nicht gefunden`);
        return;
    }
    
    let trainingszeiten = await loadTrainingszeiten();
    
    // Fallback verwenden, wenn API nicht verfügbar
    if (!trainingszeiten || trainingszeiten.length === 0) {
        console.log('Verwende Fallback-Trainingszeiten für Homepage Kontakt-Section');
        trainingszeiten = TrainingUtils.getFallbackTrainingszeiten();
    }
    
    // Container leeren
    container.innerHTML = '';
    
    // Trainingszeiten rendern im Grid-Format
    trainingszeiten.forEach(training => {
        const wochentag = TrainingUtils.translateWochentag(training.wochentag);
        const zeitText = TrainingUtils.createTimeText(training.startzeit, training.endzeit);
        const beschreibung = training.beschreibung || 'Training';
        
        const trainingHTML = `
            <div class="bg-gray-50 p-3 rounded hover:bg-gray-100 transition-colors">
                <p class="font-medium text-green-700 text-lg">${wochentag}</p>
                <p class="text-gray-700">${zeitText}</p>
                <p class="text-sm text-gray-500">${beschreibung}</p>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', trainingHTML);
    });
    
    console.log(`Trainingszeiten für Homepage Kontakt-Section gerendert: ${trainingszeiten.length} Termine`);
}

/**
 * Rendere Gastronomie-Öffnungszeiten für Homepage (einfaches Format)
 */
async function renderGastronomieOeffnungszeiten_Homepage(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID "${containerId}" nicht gefunden`);
        return;
    }
    
    let oeffnungszeiten = await loadGastronomieOeffnungszeiten();
    
    // Fallback verwenden, wenn API nicht verfügbar
    if (!oeffnungszeiten || oeffnungszeiten.length === 0) {
        console.log('Verwende Fallback-Öffnungszeiten für Homepage');
        oeffnungszeiten = GastronomieUtils.getFallbackOeffnungszeiten();
    }
    
    // Container leeren
    container.innerHTML = '';
    
    // Nur aktive Öffnungszeiten anzeigen
    const aktiveOeffnungszeiten = oeffnungszeiten
        .filter(zeit => zeit.ist_aktiv !== false)
        .sort((a, b) => (a.sortierung || 1) - (b.sortierung || 1));
    
    // Öffnungszeiten als einfachen Text rendern
    let zeitTexte = [];
    aktiveOeffnungszeiten.forEach(zeit => {
        const tageBereich = GastronomieUtils.createDayRange(zeit.von_wochentag, zeit.bis_wochentag);
        const zeitBereich = GastronomieUtils.createTimeRange(zeit.oeffnungszeit, zeit.schließzeit);
        zeitTexte.push(`${tageBereich}: ${zeitBereich}`);
    });
    
    if (zeitTexte.length > 0) {
        container.innerHTML = zeitTexte.join('<br>');
    } else {
        container.innerHTML = 'Montag bis Samstag: 17:00 - 23:00 Uhr<br>Sonn- und Feiertags geschlossen';
    }
    
    console.log(`Gastronomie-Öffnungszeiten für Homepage gerendert: ${aktiveOeffnungszeiten.length} Zeiten`);
}

/**
 * Rendere Öffnungszeiten für Homepage Footer (kombiniert Trainingszeiten + Gastronomie)
 */
async function renderOeffnungszeitenFooter(containerId) {
    console.log('🔄 renderOeffnungszeitenFooter wird ausgeführt für Container:', containerId);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container mit ID "${containerId}" nicht gefunden`);
        return;
    }

    let trainingszeiten = await loadTrainingszeiten();
    let gastronomieOeffnungszeiten = await loadGastronomieOeffnungszeiten();

    // Fallbacks verwenden wenn APIs nicht verfügbar
    if (!trainingszeiten || trainingszeiten.length === 0) {
        console.log('Verwende Fallback-Trainingszeiten für Footer');
        trainingszeiten = TrainingUtils.getFallbackTrainingszeiten();
    }

    if (!gastronomieOeffnungszeiten || gastronomieOeffnungszeiten.length === 0) {
        console.log('Verwende Fallback-Gastronomie-Öffnungszeiten für Footer');
        gastronomieOeffnungszeiten = GastronomieUtils.getFallbackOeffnungszeiten();
    }    // Container leeren
    container.innerHTML = '';
    console.log('📝 Container geleert, verfügbare Trainingszeiten:', trainingszeiten.length);

    // Trainingszeiten rendern (maximal erste 2 Blöcke)
    const maxTrainingszeiten = Math.min(trainingszeiten.length, 2);
    for (let i = 0; i < maxTrainingszeiten; i++) {
        const training = trainingszeiten[i];
        const wochentag = TrainingUtils.translateWochentag(training.wochentag);
        const zeitText = TrainingUtils.createTimeText(training.startzeit, training.endzeit);
        const beschreibung = training.beschreibung || 'Training';

        const trainingHTML = `
            <div class="bg-white p-2 rounded-md shadow-sm">
                <p class="font-medium text-green-700 text-sm">${wochentag}: ${zeitText}</p>
                <p class="text-xs text-gray-500">${beschreibung}</p>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', trainingHTML);
        console.log(`✅ Trainingszeit ${i+1} hinzugefügt: ${wochentag} ${zeitText}`);
    }    // Gastronomie-Öffnungszeiten als letzter Block
    const aktiveOeffnungszeiten = gastronomieOeffnungszeiten
        .filter(zeit => zeit.ist_aktiv !== false)
        .sort((a, b) => (a.sortierung || 1) - (b.sortierung || 1));

    console.log('🍽️ Gastronomie-Öffnungszeiten verarbeitet:', aktiveOeffnungszeiten.length);

    if (aktiveOeffnungszeiten.length > 0) {
        // Erstelle kompakte Gastronomie-Zeitangabe
        let gastroZeiten = [];
        aktiveOeffnungszeiten.forEach(zeit => {
            const tageBereich = GastronomieUtils.createDayRange(zeit.von_wochentag, zeit.bis_wochentag);
            const zeitBereich = GastronomieUtils.createTimeRange(zeit.oeffnungszeit, zeit.schließzeit);
            gastroZeiten.push(`${tageBereich}: ${zeitBereich}`);
        });

        const gastronomieHTML = `
            <div class="bg-white p-2 rounded-md shadow-sm bg-green-50">
                <p class="font-medium text-green-800 text-sm">Gastronomie</p>
                <div class="text-xs text-gray-600">${gastroZeiten.join('<br>')}</div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', gastronomieHTML);
        console.log('✅ Gastronomie-Block hinzugefügt:', gastroZeiten.join(', '));
    } else {
        console.log('⚠️ Keine aktiven Gastronomie-Öffnungszeiten gefunden');
    }

    console.log(`🎯 Footer-Öffnungszeiten komplett gerendert: ${maxTrainingszeiten} Trainingszeiten, ${aktiveOeffnungszeiten.length} Gastronomie-Zeiten`);
}
