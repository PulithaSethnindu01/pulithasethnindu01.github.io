export class TypingEffect {
    constructor() {
        this.element = document.getElementById('typing');
        this.roles = [
            "Graphic Designer", 
            "Web Developer", 
            "Creative Thinker", 
            "Tech Explorer", 
            "UI/UX Enthusiast"
        ];
        this.roleIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.timeoutId = null;
    }

    init() {
        if (!this.element) return;
        this.start();
    }

    start() {
        if (!this.element) return;
        
        this.roleIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.element.style.display = 'block';
        this.type();
    }

    pause() {
        this.isPaused = true;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.type();
        }
    }

    type() {
        if (this.isPaused || !this.element) return;

        const current = this.roles[this.roleIndex];
        
        if (this.isDeleting) {
            this.element.textContent = current.substring(0, this.charIndex--);
        } else {
            this.element.textContent = current.substring(0, this.charIndex++);
        }

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.roleIndex = (this.roleIndex + 1) % this.roles.length;
            typeSpeed = 500; // Pause before typing next role
        } else if (!this.isDeleting && this.charIndex === current.length + 1) {
            this.isDeleting = true;
            typeSpeed = 1000; // Pause after typing a role
        }

        this.timeoutId = setTimeout(() => this.type(), typeSpeed);
    }

    destroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.isPaused = true;
    }
}