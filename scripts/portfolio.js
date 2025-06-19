import { BlurEffect } from './effects/blur-effect.js';
import { TypingEffect } from './effects/typing-effect.js';
import { RulerNavigation } from './navigation/ruler-navigation.js';
import { PageManager } from './navigation/page-manager.js';
import { ContactForm } from './components/contact-form.js';

export class PortfolioApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        try {
            // Initialize GSAP plugins
            if (typeof gsap !== 'undefined') {
                gsap.registerPlugin(ScrollToPlugin);
            }

            // Initialize components
            this.components.blurEffect = new BlurEffect();
            this.components.typingEffect = new TypingEffect();
            this.components.rulerNavigation = new RulerNavigation();
            this.components.pageManager = new PageManager();
            this.components.contactForm = new ContactForm();

            // Initialize all components
            Object.values(this.components).forEach(component => {
                if (component.init) {
                    component.init();
                }
            });

            // Set up component interactions
            this.setupComponentInteractions();

            this.isInitialized = true;
            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio app:', error);
        }
    }

    setupComponentInteractions() {
        // Connect ruler navigation with page manager
        if (this.components.rulerNavigation && this.components.pageManager) {
            this.components.rulerNavigation.onPageChange = (pageIndex) => {
                this.components.pageManager.navigateToPage(pageIndex);
            };

            this.components.pageManager.onPageChanged = (pageIndex) => {
                this.components.rulerNavigation.updateCurrentPage(pageIndex);
            };
        }

        // Connect typing effect with page manager
        if (this.components.typingEffect && this.components.pageManager) {
            this.components.pageManager.onPageChanged = (pageIndex) => {
                if (pageIndex === 0) {
                    this.components.typingEffect.start();
                } else {
                    this.components.typingEffect.pause();
                }
            };
        }
    }

    destroy() {
        Object.values(this.components).forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
        this.components = {};
        this.isInitialized = false;
    }
}