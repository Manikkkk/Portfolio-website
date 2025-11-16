/**
 * smooth-scroll.js
 * Handles smooth scrolling navigation and active link highlighting
 */

// Initialize smooth scroll when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSmoothScroll();
    initializeActiveNavigation();
    initializeMobileMenu();
    initializeNavbarScroll();
    initializeKeyboardNavigation();
    initializeFormValidation();
});

/**
 * Initialize smooth scrolling for all internal navigation links
 */
function initializeSmoothScroll() {
    // Select all links with href starting with #
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset for fixed navbar (mobile-aware)
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const isMobile = window.innerWidth < 768;
                const offset = isMobile ? navbarHeight + 10 : navbarHeight;
                
                // Get target position
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                // Smooth scroll to target with offset
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
                
                // Set focus for accessibility (after scroll completes)
                setTimeout(() => {
                    targetElement.focus({ preventScroll: true });
                }, 500);
            }
        });
    });
}

/**
 * Initialize active navigation link highlighting based on scroll position
 */
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    // Intersection Observer for active navigation
    const navObserverOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -66%'
    };
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveNavLink(sectionId, navLinks);
            }
        });
    }, navObserverOptions);
    
    // Observe all sections
    sections.forEach(section => {
        navObserver.observe(section);
    });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(sectionId, navLinks) {
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove active class from all links
        link.classList.remove('active', 'text-secondary');
        
        // Add active class to current section link
        if (href === `#${sectionId}`) {
            link.classList.add('active', 'text-secondary');
        }
    });
}

/**
 * Initialize mobile menu toggle functionality
 */
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu visibility
        mobileMenu.classList.toggle('hidden');
        
        // Toggle icons
        menuIcon.classList.toggle('hidden');
        menuIcon.classList.toggle('block');
        closeIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('block');
        
        // Update aria-expanded
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        
        // Prevent body scroll when menu is open (mobile optimization)
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
        } else {
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    });
    
    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && 
            !mobileMenuButton.contains(e.target) && 
            !mobileMenu.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });
    
    // Handle touch events for better mobile experience
    let touchStartY = 0;
    mobileMenu.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    mobileMenu.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const menuContent = mobileMenu.querySelector('div');
        
        // Prevent overscroll
        if (menuContent.scrollTop === 0 && touchY > touchStartY) {
            e.preventDefault();
        }
        
        const maxScroll = menuContent.scrollHeight - menuContent.clientHeight;
        if (menuContent.scrollTop >= maxScroll && touchY < touchStartY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Helper function to close mobile menu
    function closeMobileMenu() {
        const scrollY = document.body.style.top;
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        menuIcon.classList.add('block');
        closeIcon.classList.add('hidden');
        closeIcon.classList.remove('block');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }
}

/**
 * Initialize navbar backdrop blur effect on scroll
 */
function initializeNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add backdrop blur and background when scrolled past hero section (approximately 100px)
        if (scrollTop > 100) {
            navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-md');
        } else {
            navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-md');
        }
    });
}

/**
 * Initialize keyboard navigation for interactive elements
 */
function initializeKeyboardNavigation() {
    // Add keyboard support for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('keydown', (e) => {
            // Activate on Enter or Space key
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Add keyboard support for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Add keyboard support for filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const menuIcon = document.getElementById('menu-icon');
            const closeIcon = document.getElementById('close-icon');
            
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                menuIcon.classList.add('block');
                closeIcon.classList.add('hidden');
                closeIcon.classList.remove('block');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                mobileMenuButton.focus();
            }
        }
    });
    
    // Add keyboard navigation for testimonial slider
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    
    if (sliderPrev && sliderNext) {
        document.addEventListener('keydown', (e) => {
            // Only handle arrow keys when testimonial section is in focus
            const testimonialSection = document.getElementById('testimonials');
            if (testimonialSection && isElementInViewport(testimonialSection)) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    sliderPrev.click();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    sliderNext.click();
                }
            }
        });
    }
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Initialize form validation with accessibility features
 */
function initializeFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formSuccess = document.getElementById('form-success');
    
    // Real-time validation on blur
    nameInput.addEventListener('blur', () => validateField(nameInput, nameError, 'Please enter your name'));
    emailInput.addEventListener('blur', () => validateEmail(emailInput, emailError));
    messageInput.addEventListener('blur', () => validateField(messageInput, messageError, 'Please enter a message'));
    
    // Clear error on input
    nameInput.addEventListener('input', () => clearError(nameInput, nameError));
    emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    messageInput.addEventListener('input', () => clearError(messageInput, messageError));
    
    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateField(nameInput, nameError, 'Please enter your name');
        const isEmailValid = validateEmail(emailInput, emailError);
        const isMessageValid = validateField(messageInput, messageError, 'Please enter a message');
        
        if (isNameValid && isEmailValid && isMessageValid) {
            // Show success message
            formSuccess.classList.remove('hidden');
            formSuccess.setAttribute('role', 'alert');
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
            
            // Focus on success message for screen readers
            formSuccess.focus();
        } else {
            // Focus on first error field
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

/**
 * Validate a form field
 */
function validateField(input, errorElement, errorMessage) {
    if (!input.value.trim()) {
        showError(input, errorElement, errorMessage);
        return false;
    }
    clearError(input, errorElement);
    return true;
}

/**
 * Validate email field
 */
function validateEmail(input, errorElement) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.value.trim()) {
        showError(input, errorElement, 'Please enter your email address');
        return false;
    }
    if (!emailRegex.test(input.value)) {
        showError(input, errorElement, 'Please enter a valid email address');
        return false;
    }
    clearError(input, errorElement);
    return true;
}

/**
 * Show error message
 */
function showError(input, errorElement, message) {
    input.classList.add('border-red-500');
    input.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

/**
 * Clear error message
 */
function clearError(input, errorElement) {
    input.classList.remove('border-red-500');
    input.setAttribute('aria-invalid', 'false');
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
}

/**
 * Scroll to top functionality
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initializeSmoothScroll, 
        initializeActiveNavigation,
        initializeMobileMenu,
        initializeNavbarScroll,
        initializeKeyboardNavigation,
        initializeFormValidation,
        scrollToTop 
    };
}
