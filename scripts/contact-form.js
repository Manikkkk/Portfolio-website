/**
 * contact-form.js
 * Handles contact form submission with Web3Forms
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Show loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            btnLoading.classList.remove('hidden');
            successMsg.classList.add('hidden');
            errorMsg.classList.add('hidden');

            // Get form data
            const formData = new FormData(form);

            try {
                // Submit to Web3Forms
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    // Show success message
                    successMsg.classList.remove('hidden');
                    form.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMsg.classList.add('hidden');
                    }, 5000);
                } else {
                    // Show error message
                    errorMsg.classList.remove('hidden');
                    console.error('Form submission error:', data);
                }
            } catch (error) {
                // Show error message
                errorMsg.classList.remove('hidden');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                btnLoading.classList.add('hidden');
            }
        });

        // Real-time validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                validateField(this, 'name-error', 'Please enter your name');
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    showError(this, 'email-error', 'Please enter a valid email address');
                } else {
                    hideError(this, 'email-error');
                }
            });
        }

        if (messageInput) {
            messageInput.addEventListener('blur', function() {
                validateField(this, 'message-error', 'Please enter a message');
            });
        }
    }
});

function validateField(field, errorId, errorMessage) {
    if (field.value.trim() === '') {
        showError(field, errorId, errorMessage);
    } else {
        hideError(field, errorId);
    }
}

function showError(field, errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        field.classList.add('border-red-500');
        field.setAttribute('aria-invalid', 'true');
    }
}

function hideError(field, errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add('hidden');
        field.classList.remove('border-red-500');
        field.setAttribute('aria-invalid', 'false');
    }
}
