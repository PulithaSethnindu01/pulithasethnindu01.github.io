export class RulerNavigation {
    constructor() {
        this.container = document.getElementById('ruler-container');
        this.ruler = document.getElementById('ruler');
        this.labels = {
            home: document.getElementById('home-label'),
            about: document.getElementById('about-label'),
            contact: document.getElementById('contact-label')
        };

        this.isDragging = false;
        this.startX = 0;
        this.targetDeltaX = 0;
        this.currentDeltaX = 250;
        this.snapTargetX = 250;
        this.currentPage = 0;
        this.animationId = null;

        this.pageSnapPoints = {
            0: 250,  // Home
            1: -300, // About
            2: -850  // Contact
        };

        this.onPageChange = null; // Callback for page changes
    }

    init() {
        if (!this.container || !this.ruler) return;

        this.setupRuler();
        this.setupEventListeners();
        this.startAnimation();
        this.updateLabels();
    }

    setupRuler() {
        // Clear existing ticks
        this.ruler.innerHTML = '';

        // Create ruler ticks
        for (let i = 0; i < 600; i++) {
            const tick = document.createElement('div');
            tick.className = 'tick';
            
            if (i % 10 === 0) {
                tick.classList.add('long');
            } else if (i % 5 === 0) {
                tick.classList.add('medium');
            } else {
                tick.classList.add('short');
            }
            
            const line = document.createElement('div');
            line.className = 'tick-line';
            tick.appendChild(line);
            this.ruler.appendChild(tick);
        }
    }

    setupEventListeners() {
        // Mouse events
        this.container.addEventListener('mousedown', (e) => this.handleDragStart(e.clientX));
        document.addEventListener('mousemove', (e) => this.handleDragMove(e.clientX));
        document.addEventListener('mouseup', () => this.handleDragEnd());

        // Touch events
        this.container.addEventListener('touchstart', (e) => {
            this.handleDragStart(e.touches[0].clientX);
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            this.handleDragMove(e.touches[0].clientX);
        }, { passive: true });

        document.addEventListener('touchend', () => this.handleDragEnd(), { passive: true });

        // Arrow navigation
        const nextArrow = document.getElementById('next-arrow');
        const prevArrow = document.getElementById('prev-arrow');

        if (nextArrow) {
            nextArrow.addEventListener('click', () => this.navigateNext());
            nextArrow.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.navigateNext();
                }
            });
        }

        if (prevArrow) {
            prevArrow.addEventListener('click', () => this.navigatePrev());
            prevArrow.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.navigatePrev();
                }
            });
        }
    }

    handleDragStart(clientX) {
        this.isDragging = true;
        this.startX = clientX;
        this.targetDeltaX = 0;
        this.container.style.cursor = 'grabbing';
        this.ruler.style.transition = 'none';
    }

    handleDragMove(clientX) {
        if (!this.isDragging) return;
        this.targetDeltaX = clientX - this.startX;
    }

    handleDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.container.style.cursor = 'grab';

        const dragThreshold = 150;
        const maxPages = Object.keys(this.pageSnapPoints).length - 1;

        if (this.targetDeltaX < -dragThreshold && this.currentPage < maxPages) {
            this.currentPage++;
        } else if (this.targetDeltaX > dragThreshold && this.currentPage > 0) {
            this.currentPage--;
        }

        this.snapTargetX = this.pageSnapPoints[this.currentPage];
        this.notifyPageChange();
    }

    navigateNext() {
        const maxPages = Object.keys(this.pageSnapPoints).length - 1;
        if (this.currentPage < maxPages) {
            this.currentPage++;
            this.snapTargetX = this.pageSnapPoints[this.currentPage];
            this.notifyPageChange();
        }
    }

    navigatePrev() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.snapTargetX = this.pageSnapPoints[this.currentPage];
            this.notifyPageChange();
        }
    }

    startAnimation() {
        if (this.animationId) return;

        const animate = () => {
            if (!this.isDragging) {
                // Smooth snap to target
                this.currentDeltaX += (this.snapTargetX - this.currentDeltaX) * 0.1;
            } else {
                // Follow drag
                const baseOffset = this.pageSnapPoints[this.currentPage];
                const desiredX = baseOffset + this.targetDeltaX;
                this.currentDeltaX += (desiredX - this.currentDeltaX) * 0.15;
            }

            this.ruler.style.transform = `translateX(calc(-50% + ${this.currentDeltaX}px))`;
            this.updateLabels();
            
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    updateLabels() {
        Object.values(this.labels).forEach(label => {
            if (label) label.classList.remove('active');
        });

        const labelKeys = ['home', 'about', 'contact'];
        const activeLabel = this.labels[labelKeys[this.currentPage]];
        if (activeLabel) {
            activeLabel.classList.add('active');
        }
    }

    updateCurrentPage(pageIndex) {
        if (pageIndex >= 0 && pageIndex < Object.keys(this.pageSnapPoints).length) {
            this.currentPage = pageIndex;
            this.snapTargetX = this.pageSnapPoints[this.currentPage];
            this.updateLabels();
        }
    }

    notifyPageChange() {
        if (this.onPageChange) {
            this.onPageChange(this.currentPage);
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}