export class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.isSubmitting = false;
    }

    init() {
        if (!this.form) return;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Add input validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Validate form
        if (!this.validateForm(data)) {
            return;
        }

        this.isSubmitting = true;
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            await this.simulateSubmission(data);
            
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            this.showError('Failed to send message. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            this.isSubmitting = false;
        }
    }

    validateForm(data) {
        let isValid = true;

        // Validate name
        if (!data.name || data.name.trim().length < 2) {
            this.showFieldError('name', 'Name must be at least 2 characters long');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate message
        if (!data.message || data.message.trim().length < 10) {
            this.showFieldError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;

        switch (name) {
            case 'name':
                if (value.length > 0 && value.length < 2) {
                    this.showFieldError(name, 'Name must be at least 2 characters long');
                    return false;
                }
                break;
            case 'email':
                if (value.length > 0) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        this.showFieldError(name, 'Please enter a valid email address');
                        return false;
                    }
                }
                break;
            case 'message':
                if (value.length > 0 && value.length < 10) {
                    this.showFieldError(name, 'Message must be at least 10 characters long');
                    return false;
                }
                break;
        }

        this.clearFieldError(field);
        return true;
    }

    showFieldError(fieldName, message) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        // Remove existing error
        this.clearFieldError(field);

        // Add error styling
        field.style.borderColor = '#ff6b6b';
        field.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.8em';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.marginBottom = '10px';

        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }

    clearFieldError(field) {
        // Reset field styling
        field.style.borderColor = '';
        field.style.backgroundColor = '';

        // Remove error message
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    showSuccess() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Thank you! Your message has been sent successfully.</p>
        `;
        successDiv.style.cssText = `
            background: rgba(76, 175, 80, 0.2);
            border: 1px solid rgba(76, 175, 80, 0.5);
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            color: #4caf50;
        `;

        // Insert success message
        this.form.parentNode.insertBefore(successDiv, this.form);

        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }

    showError(message) {
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        `;
        errorDiv.style.cssText = `
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid rgba(255, 107, 107, 0.5);
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            color: #ff6b6b;
        `;

        // Insert error message
        this.form.parentNode.insertBefore(errorDiv, this.form);

        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    async simulateSubmission(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log form data (in production, send to your backend)
        console.log('Form submitted:', data);
        
        // Simulate occasional failure for testing
        if (Math.random() < 0.1) {
            throw new Error('Simulated network error');
        }
    }
}