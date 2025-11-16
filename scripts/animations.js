/**
 * animations.js
 * Handles scroll-triggered animations using Intersection Observer API
 * 
 * Supported animation types (via data-animation attribute):
 * - fade-in: Simple opacity fade
 * - slide-up: Slide from bottom (default if no data-animation specified)
 * - slide-left: Slide from left
 * - slide-right: Slide from right
 * - scale-in: Scale up from 90%
 * 
 * Staggered animations are automatically applied to:
 * - .skill-card elements
 * - .project-card elements
 * - .service-card elements
 */

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Check if Intersection Observer is supported
const isIntersectionObserverSupported = 'IntersectionObserver' in window;

// Intersection Observer configuration
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

// Fallback function for browsers without Intersection Observer support
function fallbackAnimation() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(element => {
        element.classList.add('animate-in');
        element.style.opacity = '1';
        element.style.transform = 'none';
    });
}

// Initialize Intersection Observer with staggered animations
let observer;

if (isIntersectionObserverSupported) {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Check if element is part of a staggered group
                const parent = element.closest('#about, #portfolio, #services, #testimonials, #contact');
                
                if (parent) {
                    // Get all animate-on-scroll elements within the parent
                    const siblings = Array.from(parent.querySelectorAll('.animate-on-scroll'));
                    const index = siblings.indexOf(element);
                    
                    // Apply staggered delay for cards and grid items
                    if (element.classList.contains('skill-card') || 
                        element.classList.contains('project-card') || 
                        element.classList.contains('service-card')) {
                        // Use inline style delay if present, otherwise calculate
                        const inlineDelay = element.style.animationDelay;
                        if (!inlineDelay) {
                            const delay = index * 100; // 100ms stagger
                            setTimeout(() => {
                                element.classList.add('animate-in');
                            }, delay);
                        } else {
                            element.classList.add('animate-in');
                        }
                    } else {
                        // Regular animation without extra delay
                        element.classList.add('animate-in');
                    }
                } else {
                    // Element not in a specific section, animate immediately
                    element.classList.add('animate-in');
                }
                
                // Unobserve after animation to improve performance
                observer.unobserve(element);
            }
        });
    }, observerOptions);
}

// Observe elements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // If user prefers reduced motion, skip animations
    if (prefersReducedMotion) {
        console.info('Reduced motion preference detected. Animations disabled.');
        fallbackAnimation();
    } else if (isIntersectionObserverSupported) {
        // Select all elements that should animate on scroll
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback: Show all elements immediately without animation
        console.warn('Intersection Observer not supported. Animations disabled.');
        fallbackAnimation();
    }
    
    // Initialize portfolio filtering
    initPortfolioFilter();
    
    // Initialize contact form validation
    initContactForm();
});

/**
 * Portfolio Filter Functionality
 * Filters project cards based on selected category
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) {
        return; // Exit if elements don't exist yet
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            
            // Update active button state
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('bg-secondary', 'text-white');
                btn.classList.add('bg-white', 'text-darkGray');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            button.classList.add('active');
            button.classList.remove('bg-white', 'text-darkGray');
            button.classList.add('bg-secondary', 'text-white');
            button.setAttribute('aria-pressed', 'true');
            
            // Filter projects with smooth fade transition
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                // Add fade-out effect
                card.classList.add('fade-out');
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden', 'fade-out');
                        // Re-trigger animation with stagger
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 50);
                    } else {
                        card.classList.add('hidden');
                        card.classList.remove('fade-out');
                    }
                }, 200);
            });
        });
    });
}

/**
 * Contact Form Validation and Submission
 * Handles form validation with HTML5 and custom error messages
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        return; // Exit if form doesn't exist yet
    }
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const successMessage = document.getElementById('form-success');
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Clear error message
    function clearError(input, errorElement) {
        input.classList.remove('border-red-500');
        errorElement.classList.add('hidden');
    }
    
    // Show error message
    function showError(input, errorElement, message) {
        input.classList.add('border-red-500');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
    
    // Validate name field
    function validateName() {
        const value = nameInput.value.trim();
        
        if (value === '') {
            showError(nameInput, nameError, 'Please enter your name');
            return false;
        }
        
        clearError(nameInput, nameError);
        return true;
    }
    
    // Validate email field
    function validateEmail() {
        const value = emailInput.value.trim();
        
        if (value === '') {
            showError(emailInput, emailError, 'Please enter your email address');
            return false;
        }
        
        if (!emailRegex.test(value)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        
        clearError(emailInput, emailError);
        return true;
    }
    
    // Validate message field
    function validateMessage() {
        const value = messageInput.value.trim();
        
        if (value === '') {
            showError(messageInput, messageError, 'Please enter a message');
            return false;
        }
        
        if (value.length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters long');
            return false;
        }
        
        clearError(messageInput, messageError);
        return true;
    }
    
    // Real-time validation on blur
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);
    
    // Clear errors on input
    nameInput.addEventListener('input', () => {
        if (nameInput.value.trim() !== '') {
            clearError(nameInput, nameError);
        }
    });
    
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '') {
            clearError(emailInput, emailError);
        }
    });
    
    messageInput.addEventListener('input', () => {
        if (messageInput.value.trim() !== '') {
            clearError(messageInput, messageError);
        }
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide success message if visible
        successMessage.classList.add('hidden');
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        // If all fields are valid, submit the form
        if (isNameValid && isEmailValid && isMessageValid) {
            // In a real application, you would send the data to a server here
            // For now, we'll just show a success message
            
            // Simulate form submission
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                // Show success message
                successMessage.classList.remove('hidden');
                
                // Reset form
                form.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000);
            }, 1500);
        } else {
            // Focus on first invalid field
            if (!isNameValid) {
                nameInput.focus();
            } else if (!isEmailValid) {
                emailInput.focus();
            } else if (!isMessageValid) {
                messageInput.focus();
            }
        }
    });
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { observer, observerOptions, initPortfolioFilter, initContactForm };
}
