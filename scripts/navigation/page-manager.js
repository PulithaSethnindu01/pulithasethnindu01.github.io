export class PageManager {
    constructor() {
        this.background = document.getElementById('background');
        this.contentArea = document.getElementById('content-area');
        this.blurLayer = document.getElementById('blur-layer');
        
        this.sections = {
            home: document.getElementById('home-section'),
            about: document.getElementById('about-page-section'),
            contact: document.getElementById('contact-page-section')
        };

        this.titles = {
            home: document.getElementById('main-title'),
            about: document.getElementById('about-page-title'),
            contact: document.getElementById('contact-page-title')
        };

        this.typingElement = document.getElementById('typing');
        this.scrollDownArrows = document.getElementById('scroll-down-arrows');
        this.aboutDetailContent = document.getElementById('about-detail-content');
        this.contactButton = document.getElementById('contact-button');

        this.currentPage = 0;
        this.isAboutDetailedView = false;
        this.onPageChanged = null; // Callback for page changes

        this.backgrounds = {
            0: "url('https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')",
            1: "linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)",
            2: "linear-gradient(135deg, #0f1c2c 0%, #1e3a5f 50%, #0a141d 100%)"
        };
    }

    init() {
        this.setupEventListeners();
        this.navigateToPage(0); // Start with home page
    }

    setupEventListeners() {
        // Scroll down arrows
        if (this.scrollDownArrows) {
            this.scrollDownArrows.addEventListener('click', () => {
                this.scrollToAboutDetail();
            });
        }

        // Contact button
        if (this.contactButton) {
            this.contactButton.addEventListener('click', () => {
                this.navigateToPage(2); // Navigate to contact page
            });
        }
    }

    navigateToPage(pageIndex, isRulerNav = true) {
        if (pageIndex === this.currentPage && pageIndex !== 1) return;

        this.currentPage = pageIndex;

        // Handle about page scroll reset
        if (pageIndex === 1 && isRulerNav) {
            if (typeof gsap !== 'undefined') {
                gsap.to(this.contentArea, {
                    duration: 0.5,
                    scrollTo: { y: 0, autoKill: false },
                    onComplete: () => {
                        this.isAboutDetailedView = false;
                    }
                });
            }
        }

        this.updatePageContent();
        this.notifyPageChanged();
    }

    updatePageContent() {
        // Fade out all sections
        if (typeof gsap !== 'undefined') {
            gsap.to(Object.values(this.sections), {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    this.showCurrentPage();
                }
            });
        } else {
            this.showCurrentPage();
        }
    }

    showCurrentPage() {
        // Hide all sections and titles
        Object.values(this.sections).forEach(section => {
            if (section) {
                section.classList.remove('active');
                section.style.display = 'none';
            }
        });

        Object.values(this.titles).forEach(title => {
            if (title) title.style.display = 'none';
        });

        if (this.typingElement) {
            this.typingElement.style.display = 'none';
        }

        // Hide scroll arrows by default
        if (this.scrollDownArrows && typeof gsap !== 'undefined') {
            gsap.set(this.scrollDownArrows, { opacity: 0, pointerEvents: 'none' });
        }

        // Show current page content
        const pageKeys = ['home', 'about', 'contact'];
        const currentKey = pageKeys[this.currentPage];
        const currentSection = this.sections[currentKey];
        const currentTitle = this.titles[currentKey];

        if (currentSection && currentTitle) {
            currentSection.style.display = 'flex';
            currentSection.classList.add('active');
            currentTitle.style.display = 'block';

            // Set page-specific content
            this.setPageSpecificContent(currentKey);
            
            // Update background
            this.updateBackground();
            
            // Update blur layer
            this.updateBlurLayer();

            // Animate in content
            this.animatePageIn(currentSection, currentTitle);
        }
    }

    setPageSpecificContent(pageKey) {
        switch (pageKey) {
            case 'home':
                this.titles.home.textContent = "Pulitha Sethnindu";
                if (this.typingElement) {
                    this.typingElement.style.display = 'block';
                }
                break;
            case 'about':
                this.titles.about.textContent = "About Me";
                if (this.aboutDetailContent) {
                    this.aboutDetailContent.style.opacity = 0;
                    this.aboutDetailContent.style.pointerEvents = 'none';
                }
                this.isAboutDetailedView = false;
                
                // Show scroll arrows
                if (this.scrollDownArrows && typeof gsap !== 'undefined') {
                    gsap.to(this.scrollDownArrows, { 
                        opacity: 1, 
                        pointerEvents: 'auto', 
                        duration: 0.3, 
                        delay: 0.5 
                    });
                }
                break;
            case 'contact':
                this.titles.contact.textContent = "Get in Touch!";
                break;
        }
    }

    animatePageIn(section, title) {
        if (typeof gsap === 'undefined') {
            section.style.opacity = 1;
            title.style.opacity = 1;
            return;
        }

        if (this.currentPage === 0) {
            // Home page - immediate visibility
            gsap.set([section, title], { opacity: 1, y: 0 });
        } else {
            // Other pages - animate in
            gsap.fromTo(section, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.7, delay: 0.2 }
            );
            gsap.fromTo(title, 
                { opacity: 0, y: -20 }, 
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }
    }

    updateBackground() {
        if (this.background && this.backgrounds[this.currentPage]) {
            this.background.style.backgroundImage = this.backgrounds[this.currentPage];
        }
    }

    updateBlurLayer() {
        if (!this.blurLayer) return;

        if (this.currentPage === 1) { // About page
            this.blurLayer.style.mask = 'none';
            this.blurLayer.style.webkitMask = 'none';
        } else {
            // Default spotlight mask for other pages
            const mask = `radial-gradient(circle 250px at var(--x, 50%) var(--y, 50%),
                transparent 0%, transparent 96%, rgba(0, 0, 0, 0.8) 98%, black 100%)`;
            this.blurLayer.style.mask = mask;
            this.blurLayer.style.webkitMask = mask;
        }
    }

    scrollToAboutDetail() {
        if (this.currentPage !== 1 || !this.aboutDetailContent || !this.contentArea) return;

        if (typeof gsap !== 'undefined') {
            gsap.to(this.contentArea, {
                duration: 1.0,
                scrollTo: {
                    y: this.aboutDetailContent,
                    offsetY: 20,
                    autoKill: true
                },
                ease: "power2.out",
                onStart: () => {
                    // Show detailed content
                    this.aboutDetailContent.style.opacity = 1;
                    this.aboutDetailContent.style.pointerEvents = 'auto';
                    this.isAboutDetailedView = true;

                    // Animate detail items
                    const detailItems = this.aboutDetailContent.querySelectorAll('.about-detail-item');
                    gsap.fromTo(detailItems, 
                        { opacity: 0, y: 20 }, 
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2 }
                    );

                    // Update title
                    if (this.titles.about) {
                        this.titles.about.textContent = "My Story";
                    }
                },
                onComplete: () => {
                    // Hide scroll arrows
                    if (this.scrollDownArrows) {
                        gsap.to(this.scrollDownArrows, { 
                            opacity: 0, 
                            pointerEvents: 'none', 
                            duration: 0.3 
                        });
                    }
                }
            });
        }
    }

    notifyPageChanged() {
        if (this.onPageChanged) {
            this.onPageChanged(this.currentPage);
        }
    }
}