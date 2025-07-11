/**
 * Kontakt - Interactive JavaScript
 * Provides functionality for contact forms, team interactions, and communication features
 */

// Global variables
let contactData = {
    team: [],
    contactMethods: [],
    openingHours: {},
    formSubmissions: [],
    location: {}
};

let formValidator = {
    rules: {},
    errors: {},
    isValid: false
};

// Initialize page functionality
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeContactPage();
        loadContactData();
        setupEventListeners();
        animateElements();
        initializeContactForm();
        setupFormValidation();
        initializeMap();
    } catch (error) {
        console.error('Error initializing Contact page:', error);
        showNotification('Fehler beim Laden der Seite', 'error');
    }
});

/**
 * Initialize the main contact page functionality
 */
function initializeContactPage() {
    console.log('Initializing Contact page...');
    
    // Set up intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Observe all contact sections
    document.querySelectorAll('.contact-card, .contact-form-section, .location-info, .hours-card, .team-member').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Load contact data and information
 */
function loadContactData() {
    // Simulate loading contact data
    contactData.team = [
        {
            id: 'vorsitzender',
            name: 'Klaus Weber',
            position: '1. Vorsitzender',
            email: 'vorsitzender@schuetzenverein.de',
            phone: '+49 123 456-789',
            avatar: '👨‍💼',
            description: 'Verantwortlich für die Vereinsführung und strategische Entscheidungen',
            availability: 'Mo-Fr 18:00-20:00'
        },
        {
            id: 'stellvertreter',
            name: 'Maria Fischer',
            position: '2. Vorsitzende',
            email: 'stellvertreter@schuetzenverein.de',
            phone: '+49 123 456-790',
            avatar: '👩‍💼',
            description: 'Stellvertretung und Organisation von Veranstaltungen',
            availability: 'Di, Do 19:00-21:00'
        },
        {
            id: 'kassenwart',
            name: 'Heinrich Müller',
            position: 'Kassenwart',
            email: 'kasse@schuetzenverein.de',
            phone: '+49 123 456-791',
            avatar: '💰',
            description: 'Finanzverwaltung und Mitgliedsbeiträge',
            availability: 'Sa 10:00-12:00'
        },
        {
            id: 'sportleiter',
            name: 'Andrea Schmidt',
            position: 'Sportleiterin',
            email: 'sport@schuetzenverein.de',
            phone: '+49 123 456-792',
            avatar: '🏆',
            description: 'Training, Wettkämpfe und sportliche Aktivitäten',
            availability: 'Mo, Mi, Fr 17:00-19:00'
        },
        {
            id: 'jugendleiter',
            name: 'Thomas Wagner',
            position: 'Jugendleiter',
            email: 'jugend@schuetzenverein.de',
            phone: '+49 123 456-793',
            avatar: '👨‍👩‍👧‍👦',
            description: 'Jugendarbeit und Nachwuchsförderung',
            availability: 'Fr 16:00-18:00, Sa 09:00-12:00'
        },
        {
            id: 'schriftfuehrer',
            name: 'Petra Zimmermann',
            position: 'Schriftführerin',
            email: 'info@schuetzenverein.de',
            phone: '+49 123 456-794',
            avatar: '📝',
            description: 'Protokolle, Korrespondenz und Verwaltung',
            availability: 'Mo-Fr nach Vereinbarung'
        }
    ];
    
    contactData.contactMethods = [
        {
            type: 'phone',
            title: 'Telefon',
            icon: '📞',
            primary: '+49 123 456-789',
            secondary: 'Mo-Fr 18:00-20:00',
            action: 'tel:+491234567890'
        },
        {
            type: 'email',
            title: 'E-Mail',
            icon: '✉️',
            primary: 'info@schuetzenverein.de',
            secondary: 'Antwort binnen 24h',
            action: 'mailto:info@schuetzenverein.de'
        },
        {
            type: 'location',
            title: 'Vereinsheim',
            icon: '📍',
            primary: 'Musterstraße 123',
            secondary: '12345 Musterstadt',
            action: 'directions'
        },
        {
            type: 'whatsapp',
            title: 'WhatsApp',
            icon: '💬',
            primary: '+49 123 456-789',
            secondary: 'Schnelle Antworten',
            action: 'whatsapp'
        }
    ];
    
    contactData.openingHours = {
        'Vereinsheim': {
            'Montag': '18:00 - 22:00',
            'Dienstag': '18:00 - 22:00',
            'Mittwoch': '18:00 - 22:00',
            'Donnerstag': '18:00 - 22:00',
            'Freitag': '16:00 - 23:00',
            'Samstag': '10:00 - 23:00',
            'Sonntag': '10:00 - 18:00'
        },
        'Schießhalle': {
            'Montag': '17:00 - 21:00',
            'Dienstag': '17:00 - 21:00',
            'Mittwoch': '17:00 - 21:00',
            'Donnerstag': '17:00 - 21:00',
            'Freitag': '16:00 - 22:00',
            'Samstag': '09:00 - 18:00',
            'Sonntag': 'Geschlossen'
        },
        'Gaststätte': {
            'Montag': 'Geschlossen',
            'Dienstag': '18:00 - 22:00',
            'Mittwoch': '18:00 - 22:00',
            'Donnerstag': '18:00 - 22:00',
            'Freitag': '17:00 - 23:00',
            'Samstag': '12:00 - 23:00',
            'Sonntag': '11:00 - 18:00'
        }
    };
    
    contactData.location = {
        address: 'Musterstraße 123, 12345 Musterstadt',
        coordinates: { lat: 51.165691, lng: 10.451526 },
        description: 'Unser Vereinsheim befindet sich im Herzen von Musterstadt'
    };
    
    updateContactDisplay();
    updateTeamDisplay();
    updateHoursDisplay();
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Contact method interactions
    document.addEventListener('click', handleContactMethodClick);
    
    // Team member interactions
    document.addEventListener('click', handleTeamMemberClick);
    
    // Contact form submission
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
    
    // Form field validation
    document.addEventListener('input', handleFormFieldInput);
    document.addEventListener('blur', handleFormFieldBlur, true);
    
    // File upload handling
    const fileInput = document.querySelector('#file-upload');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Modal functionality
    document.addEventListener('click', handleModalClick);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Copy contact info functionality
    document.addEventListener('click', handleCopyClick);
}

/**
 * Handle contact method clicks
 */
function handleContactMethodClick(event) {
    const contactCard = event.target.closest('.contact-card');
    if (!contactCard) return;
    
    const methodType = contactCard.dataset.contactType;
    const actionBtn = event.target.closest('.kontakt-btn');
    
    if (actionBtn) {
        const action = actionBtn.dataset.action;
        executeContactAction(methodType, action);
    }
}

/**
 * Handle team member clicks
 */
function handleTeamMemberClick(event) {
    const teamMember = event.target.closest('.team-member');
    if (teamMember) {
        const memberId = teamMember.dataset.memberId;
        const member = contactData.team.find(m => m.id === memberId);
        
        if (member) {
            showTeamMemberDetails(member);
        }
    }
}

/**
 * Execute contact actions
 */
function executeContactAction(type, action) {
    switch (action) {
        case 'call':
            if (type === 'phone') {
                window.open('tel:+491234567890', '_self');
            }
            break;
        case 'email':
            window.open('mailto:info@schuetzenverein.de', '_self');
            break;
        case 'whatsapp':
            window.open('https://wa.me/491234567890', '_blank');
            break;
        case 'directions':
            showDirectionsModal();
            break;
        case 'copy':
            copyContactInfo(type);
            break;
        default:
            console.log('Unknown action:', action);
    }
}

/**
 * Update contact display
 */
function updateContactDisplay() {
    const contactContainer = document.querySelector('.contact-methods');
    if (!contactContainer) return;
    
    contactContainer.innerHTML = '';
    
    contactData.contactMethods.forEach(method => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-card';
        contactElement.dataset.contactType = method.type;
        
        contactElement.innerHTML = `
            <div class="contact-icon">${method.icon}</div>
            <h3>${method.title}</h3>
            <div class="contact-details">
                <div class="contact-detail">
                    <strong>${method.primary}</strong>
                </div>
                <div class="contact-detail">
                    <span>${method.secondary}</span>
                </div>
            </div>
            <div class="contact-actions">
                ${getContactActions(method.type)}
            </div>
        `;
        
        contactContainer.appendChild(contactElement);
    });
}

/**
 * Get action buttons for contact method
 */
function getContactActions(type) {
    const actions = {
        phone: `
            <button class="kontakt-btn small" data-action="call">Anrufen</button>
            <button class="kontakt-btn small secondary" data-action="copy">Kopieren</button>
        `,
        email: `
            <button class="kontakt-btn small" data-action="email">E-Mail senden</button>
            <button class="kontakt-btn small secondary" data-action="copy">Kopieren</button>
        `,
        location: `
            <button class="kontakt-btn small" data-action="directions">Route anzeigen</button>
            <button class="kontakt-btn small secondary" data-action="copy">Adresse kopieren</button>
        `,
        whatsapp: `
            <button class="kontakt-btn small" data-action="whatsapp">Chat öffnen</button>
            <button class="kontakt-btn small secondary" data-action="copy">Nummer kopieren</button>
        `
    };
    
    return actions[type] || '';
}

/**
 * Update team display
 */
function updateTeamDisplay() {
    const teamContainer = document.querySelector('.team-grid');
    if (!teamContainer) return;
    
    teamContainer.innerHTML = '';
    
    contactData.team.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'team-member';
        memberElement.dataset.memberId = member.id;
        
        memberElement.innerHTML = `
            <div class="member-avatar">${member.avatar}</div>
            <h3 class="member-name">${member.name}</h3>
            <p class="member-position">${member.position}</p>
            <div class="member-contact">
                <div>${member.email}</div>
                <div>${member.phone}</div>
            </div>
        `;
        
        teamContainer.appendChild(memberElement);
    });
}

/**
 * Update opening hours display
 */
function updateHoursDisplay() {
    const hoursContainer = document.querySelector('.hours-grid');
    if (!hoursContainer) return;
    
    hoursContainer.innerHTML = '';
    
    Object.entries(contactData.openingHours).forEach(([facility, hours]) => {
        const hoursElement = document.createElement('div');
        hoursElement.className = 'hours-card';
        
        hoursElement.innerHTML = `
            <h3>${facility}</h3>
            <ul class="hours-list">
                ${Object.entries(hours).map(([day, time]) => `
                    <li>
                        <span class="day">${day}</span>
                        <span class="time">${time}</span>
                    </li>
                `).join('')}
            </ul>
        `;
        
        hoursContainer.appendChild(hoursElement);
    });
}

/**
 * Initialize contact form
 */
function initializeContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;
    
    // Add subject options
    const subjectSelect = form.querySelector('#subject');
    if (subjectSelect) {
        const subjects = [
            'Allgemeine Anfrage',
            'Mitgliedschaft',
            'Training/Kurse',
            'Veranstaltungen',
            'Gaststätte/Vermietung',
            'Beschwerden/Anregungen',
            'Sonstiges'
        ];
        
        subjectSelect.innerHTML = '<option value="">Betreff wählen...</option>';
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
    }
    
    // Add priority options
    const prioritySelect = form.querySelector('#priority');
    if (prioritySelect) {
        const priorities = [
            { value: 'low', text: 'Niedrig' },
            { value: 'normal', text: 'Normal' },
            { value: 'high', text: 'Hoch' },
            { value: 'urgent', text: 'Dringend' }
        ];
        
        prioritySelect.innerHTML = '<option value="normal">Normal</option>';
        priorities.forEach(priority => {
            if (priority.value !== 'normal') {
                const option = document.createElement('option');
                option.value = priority.value;
                option.textContent = priority.text;
                prioritySelect.appendChild(option);
            }
        });
    }
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    formValidator.rules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-ZäöüÄÖÜß\s]+$/
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            required: false,
            pattern: /^[\+]?[0-9\s\-\(\)]+$/
        },
        subject: {
            required: true
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000
        }
    };
}

/**
 * Handle form field input
 */
function handleFormFieldInput(event) {
    const field = event.target;
    if (field.closest('#contact-form')) {
        validateField(field);
        updateSubmitButton();
    }
}

/**
 * Handle form field blur
 */
function handleFormFieldBlur(event) {
    const field = event.target;
    if (field.closest('#contact-form')) {
        validateField(field, true);
    }
}

/**
 * Validate individual form field
 */
function validateField(field, showError = false) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const rules = formValidator.rules[fieldName];
    
    if (!rules) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (rules.required && !fieldValue) {
        isValid = false;
        errorMessage = 'Dieses Feld ist erforderlich';
    }
    
    // Pattern validation
    if (isValid && fieldValue && rules.pattern && !rules.pattern.test(fieldValue)) {
        isValid = false;
        errorMessage = getPatternErrorMessage(fieldName);
    }
    
    // Length validation
    if (isValid && fieldValue) {
        if (rules.minLength && fieldValue.length < rules.minLength) {
            isValid = false;
            errorMessage = `Mindestens ${rules.minLength} Zeichen erforderlich`;
        }
        
        if (rules.maxLength && fieldValue.length > rules.maxLength) {
            isValid = false;
            errorMessage = `Maximal ${rules.maxLength} Zeichen erlaubt`;
        }
    }
    
    // Update field state
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (isValid) {
        formGroup.classList.remove('error');
        if (errorElement) errorElement.textContent = '';
        delete formValidator.errors[fieldName];
    } else if (showError) {
        formGroup.classList.add('error');
        if (errorElement) errorElement.textContent = errorMessage;
        formValidator.errors[fieldName] = errorMessage;
    }
    
    return isValid;
}

/**
 * Get pattern error message for field
 */
function getPatternErrorMessage(fieldName) {
    const messages = {
        name: 'Bitte geben Sie einen gültigen Namen ein',
        email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        phone: 'Bitte geben Sie eine gültige Telefonnummer ein'
    };
    
    return messages[fieldName] || 'Ungültiges Format';
}

/**
 * Update submit button state
 */
function updateSubmitButton() {
    const form = document.querySelector('#contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!submitBtn) return;
    
    // Check if all required fields are valid
    const requiredFields = form.querySelectorAll('[required]');
    let allValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            allValid = false;
        }
    });
    
    submitBtn.disabled = !allValid;
    formValidator.isValid = allValid;
}

/**
 * Handle contact form submission
 */
function handleContactFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Final validation
    let isValid = true;
    form.querySelectorAll('input, select, textarea').forEach(field => {
        if (!validateField(field, true)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Bitte korrigieren Sie die Fehler im Formular', 'warning');
        return;
    }
    
    const contactFormData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        priority: formData.get('priority'),
        message: formData.get('message'),
        attachment: formData.get('attachment')
    };
    
    // Show loading state
    showLoadingState(true);
    
    // Simulate form submission
    setTimeout(() => {
        if (submitContactForm(contactFormData)) {
            showSuccessMessage('Ihre Nachricht wurde erfolgreich gesendet!');
            form.reset();
            resetFormValidation();
        } else {
            showNotification('Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.', 'error');
        }
        showLoadingState(false);
    }, 2000);
}

/**
 * Submit contact form (simulate API call)
 */
function submitContactForm(data) {
    // Add to submissions array
    contactData.formSubmissions.push({
        id: Date.now(),
        ...data,
        submissionDate: new Date().toISOString(),
        status: 'received'
    });
    
    return true; // Simulate successful submission
}

/**
 * Show loading state
 */
function showLoadingState(show) {
    const spinner = document.querySelector('.loading-spinner');
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
    
    if (submitBtn) {
        submitBtn.disabled = show;
        submitBtn.textContent = show ? 'Wird gesendet...' : 'Nachricht senden';
    }
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    const successElement = document.querySelector('.success-message');
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        
        setTimeout(() => {
            successElement.classList.remove('show');
        }, 5000);
    } else {
        showNotification(message, 'success');
    }
}

/**
 * Reset form validation
 */
function resetFormValidation() {
    formValidator.errors = {};
    formValidator.isValid = false;
    
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
    });
    
    document.querySelectorAll('.error-message').forEach(element => {
        element.textContent = '';
    });
}

/**
 * Handle file upload
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    const label = document.querySelector('.file-upload-label');
    
    if (file) {
        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
        
        if (file.size > maxSize) {
            showNotification('Datei ist zu groß. Maximal 5MB erlaubt.', 'warning');
            event.target.value = '';
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showNotification('Dateityp nicht erlaubt. Nur Bilder, PDF und Textdateien.', 'warning');
            event.target.value = '';
            return;
        }
        
        // Update label
        if (label) {
            label.innerHTML = `
                <div class="file-upload-icon">📎</div>
                <div>Datei ausgewählt: ${file.name}</div>
                <div style="font-size: 0.8rem; opacity: 0.7;">${(file.size / 1024).toFixed(1)} KB</div>
            `;
        }
        
        showNotification('Datei erfolgreich ausgewählt', 'success');
    }
}

/**
 * Show team member details
 */
function showTeamMemberDetails(member) {
    const modal = createModal('member-modal', `
        <div class="modal-header">
            <h3>${member.avatar} ${member.name}</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="member-details-modal">
                <div class="detail-section">
                    <h4>Position</h4>
                    <p>${member.position}</p>
                </div>
                <div class="detail-section">
                    <h4>Beschreibung</h4>
                    <p>${member.description}</p>
                </div>
                <div class="detail-section">
                    <h4>Kontakt</h4>
                    <div class="contact-info">
                        <div class="contact-item">
                            <strong>E-Mail:</strong> 
                            <a href="mailto:${member.email}">${member.email}</a>
                        </div>
                        <div class="contact-item">
                            <strong>Telefon:</strong> 
                            <a href="tel:${member.phone.replace(/\s/g, '')}">${member.phone}</a>
                        </div>
                    </div>
                </div>
                <div class="detail-section">
                    <h4>Verfügbarkeit</h4>
                    <p>${member.availability}</p>
                </div>
                <div class="modal-actions">
                    <button class="kontakt-btn" onclick="contactMember('${member.id}', 'email')">
                        E-Mail senden
                    </button>
                    <button class="kontakt-btn secondary" onclick="contactMember('${member.id}', 'phone')">
                        Anrufen
                    </button>
                </div>
            </div>
        </div>
    `);
    
    showModal(modal);
}

/**
 * Contact team member
 */
function contactMember(memberId, method) {
    const member = contactData.team.find(m => m.id === memberId);
    if (!member) return;
    
    closeModal();
    
    if (method === 'email') {
        window.open(`mailto:${member.email}`, '_self');
    } else if (method === 'phone') {
        window.open(`tel:${member.phone.replace(/\s/g, '')}`, '_self');
    }
    
    showNotification(`Kontakt zu ${member.name} wird hergestellt...`, 'info');
}

/**
 * Show directions modal
 */
function showDirectionsModal() {
    const modal = createModal('directions-modal', `
        <div class="modal-header">
            <h3>🗺️ Anfahrt</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="directions-info">
                <div class="detail-section">
                    <h4>Adresse</h4>
                    <p>${contactData.location.address}</p>
                </div>
                <div class="detail-section">
                    <h4>Beschreibung</h4>
                    <p>${contactData.location.description}</p>
                </div>
                <div class="detail-section">
                    <h4>Öffentliche Verkehrsmittel</h4>
                    <ul>
                        <li>Buslinie 15 bis Haltestelle "Vereinsheim"</li>
                        <li>S-Bahn S3 bis Bahnhof Musterstadt (10 Min. Fußweg)</li>
                    </ul>
                </div>
                <div class="detail-section">
                    <h4>Parkmöglichkeiten</h4>
                    <p>Kostenlose Parkplätze direkt am Vereinsheim verfügbar.</p>
                </div>
                <div class="modal-actions">
                    <button class="kontakt-btn" onclick="openMaps()">
                        In Karten öffnen
                    </button>
                    <button class="kontakt-btn secondary" onclick="copyAddress()">
                        Adresse kopieren
                    </button>
                </div>
            </div>
        </div>
    `);
    
    showModal(modal);
}

/**
 * Open in maps application
 */
function openMaps() {
    const address = encodeURIComponent(contactData.location.address);
    const url = `https://maps.google.com/maps?q=${address}`;
    window.open(url, '_blank');
    closeModal();
}

/**
 * Copy contact information
 */
function copyContactInfo(type) {
    let textToCopy = '';
    
    switch (type) {
        case 'phone':
            textToCopy = '+49 123 456-789';
            break;
        case 'email':
            textToCopy = 'info@schuetzenverein.de';
            break;
        case 'location':
            textToCopy = contactData.location.address;
            break;
        case 'whatsapp':
            textToCopy = '+49 123 456-789';
            break;
    }
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('In Zwischenablage kopiert!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
        fallbackCopyTextToClipboard(textToCopy);
    }
}

/**
 * Copy address
 */
function copyAddress() {
    copyContactInfo('location');
    closeModal();
}

/**
 * Fallback copy function
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('In Zwischenablage kopiert!', 'success');
    } catch (err) {
        showNotification('Kopieren fehlgeschlagen', 'error');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Handle copy clicks
 */
function handleCopyClick(event) {
    if (event.target.dataset.action === 'copy') {
        const contactCard = event.target.closest('.contact-card');
        if (contactCard) {
            const type = contactCard.dataset.contactType;
            copyContactInfo(type);
        }
    }
}

/**
 * Initialize map
 */
function initializeMap() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    // For demo purposes, show a placeholder
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <i>🗺️</i>
            <div>Interaktive Karte</div>
            <div style="font-size: 0.9rem; margin-top: 0.5rem;">
                ${contactData.location.address}
            </div>
            <button class="kontakt-btn" onclick="openMaps()" style="margin-top: 1rem;">
                In Google Maps öffnen
            </button>
        </div>
    `;
}

/**
 * Handle modal clicks (close modal when clicking outside)
 */
function handleModalClick(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
    
    if (event.target.classList.contains('modal-close')) {
        closeModal();
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(event) {
    // Close modal with Escape key
    if (event.key === 'Escape') {
        closeModal();
    }
    
    // Navigate team members with arrow keys
    if (event.target.classList.contains('team-member')) {
        let newTarget = null;
        
        switch (event.key) {
            case 'ArrowLeft':
                newTarget = event.target.previousElementSibling;
                break;
            case 'ArrowRight':
                newTarget = event.target.nextElementSibling;
                break;
            case 'Enter':
            case ' ':
                event.target.click();
                event.preventDefault();
                break;
        }
        
        if (newTarget && newTarget.classList.contains('team-member')) {
            newTarget.focus();
            event.preventDefault();
        }
    }
}

/**
 * Create modal element
 */
function createModal(id, content) {
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            ${content}
        </div>
    `;
    
    return modal;
}

/**
 * Show modal
 */
function showModal(modal) {
    document.body.appendChild(modal);
    
    // Trigger animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Focus management
    const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.querySelector('.modal.show');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

/**
 * Animate elements on scroll
 */
function animateElements() {
    const elements = document.querySelectorAll('.contact-card, .team-member, .hours-card');
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '6px',
        color: 'white',
        zIndex: '1002',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    });
    
    // Set background color based on type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

/**
 * Hide notification
 */
function hideNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 300);
}

// Export functions for global access
window.ContactPage = {
    showTeamMemberDetails,
    contactMember,
    showDirectionsModal,
    openMaps,
    copyContactInfo,
    copyAddress,
    showNotification
};
