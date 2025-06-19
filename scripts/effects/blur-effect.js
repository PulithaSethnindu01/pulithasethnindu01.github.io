export class BlurEffect {
    constructor() {
        this.blurLayer = document.getElementById('blur-layer');
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.targetX = this.mouseX;
        this.targetY = this.mouseY;
        this.animationId = null;
        this.isActive = true;
    }

    init() {
        if (!this.blurLayer) return;

        this.setupEventListeners();
        this.startAnimation();
    }

    setupEventListeners() {
        // Mouse events
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });

        // Touch events
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.targetX = e.touches[0].clientX;
                this.targetY = e.touches[0].clientY;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.targetX = e.touches[0].clientX;
                this.targetY = e.touches[0].clientY;
            }
        }, { passive: true });
    }

    startAnimation() {
        if (this.animationId) return;

        const animate = () => {
            if (!this.isActive) return;

            // Smooth interpolation
            this.mouseX += (this.targetX - this.mouseX) * 0.1;
            this.mouseY += (this.targetY - this.mouseY) * 0.1;

            // Update CSS custom properties
            this.blurLayer.style.setProperty('--x', `${this.mouseX}px`);
            this.blurLayer.style.setProperty('--y', `${this.mouseY}px`);

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    setMask(maskStyle) {
        if (!this.blurLayer) return;
        
        this.blurLayer.style.mask = maskStyle;
        this.blurLayer.style.webkitMask = maskStyle;
    }

    show() {
        if (!this.blurLayer) return;
        this.blurLayer.style.display = 'block';
        this.isActive = true;
        this.startAnimation();
    }

    hide() {
        if (!this.blurLayer) return;
        this.blurLayer.style.display = 'none';
        this.isActive = false;
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isActive = false;
    }
}