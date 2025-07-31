import { ContactChat } from '../classes/ContactChat.js';

export class App {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.initialize();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('contact.html')) return 'contact';
        return 'home';
    }

    initialize() {
        switch (this.currentPage) {
            case 'contact':
                this.initializeContactPage();
                break;
            case 'home':
                this.initializeHomePage();
                break;
            default:
                console.log('Unknown page:', this.currentPage);
        }
    }

    initializeContactPage() {
        try {
            new ContactChat();
            console.log('Contact chat initialized successfully');
        } catch (error) {
            console.error('Error initializing contact chat:', error);
        }
    }

    initializeHomePage() {
        // Initialize home page functionality
        this.setupHomePageButtons();
        console.log('Home page initialized successfully');
    }

    setupHomePageButtons() {
        const websiteBtn = document.getElementById('website-btn');
        const complexBtn = document.getElementById('complex-btn');

        if (websiteBtn) {
            websiteBtn.addEventListener('click', () => {
                window.location.href = 'contact.html';
            });
        }

        if (complexBtn) {
            complexBtn.addEventListener('click', () => {
                window.location.href = 'contact.html';
            });
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
}); 