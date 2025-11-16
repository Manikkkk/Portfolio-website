/**
 * slider.js
 * Handles testimonial slider/carousel functionality
 */

// Slider state
let currentSlide = 0;
let autoScrollInterval = null;
const SLIDE_INTERVAL = 5000; // 5 seconds

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSlider();
});

/**
 * Initialize the testimonial slider
 */
function initializeSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.testimonial-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevButton = slider.querySelector('.slider-prev');
    const nextButton = slider.querySelector('.slider-next');
    
    if (slides.length === 0) return;
    
    // Set up auto-scroll
    startAutoScroll(slides, dots);
    
    // Pause on hover (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
        slider.addEventListener('mouseenter', stopAutoScroll);
        slider.addEventListener('mouseleave', () => startAutoScroll(slides, dots));
    }
    
    // Pause when slider is focused (accessibility)
    slider.addEventListener('focusin', stopAutoScroll);
    slider.addEventListener('focusout', () => startAutoScroll(slides, dots));
    
    // Navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            navigateSlide(-1, slides, dots);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            navigateSlide(1, slides, dots);
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index, slides, dots);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            navigateSlide(-1, slides, dots);
        } else if (e.key === 'ArrowRight') {
            navigateSlide(1, slides, dots);
        }
    });
    
    // Enhanced touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isSwiping = false;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = false;
        stopAutoScroll(); // Pause auto-scroll during touch
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isSwiping) {
            const touchMoveX = e.changedTouches[0].screenX;
            const touchMoveY = e.changedTouches[0].screenY;
            const deltaX = Math.abs(touchMoveX - touchStartX);
            const deltaY = Math.abs(touchMoveY - touchStartY);
            
            // Determine if this is a horizontal swipe
            if (deltaX > deltaY && deltaX > 10) {
                isSwiping = true;
            }
        }
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        if (isSwiping) {
            handleSwipe(slides, dots);
        }
        
        // Resume auto-scroll after touch ends
        setTimeout(() => startAutoScroll(slides, dots), 1000);
    }, { passive: true });
    
    function handleSwipe(slides, dots) {
        const swipeThreshold = 50;
        const deltaX = touchStartX - touchEndX;
        const deltaY = Math.abs(touchStartY - touchEndY);
        
        // Only trigger swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                // Swipe left - next slide
                navigateSlide(1, slides, dots);
            } else {
                // Swipe right - previous slide
                navigateSlide(-1, slides, dots);
            }
        }
    }
}

/**
 * Navigate to a specific slide
 */
function goToSlide(index, slides, dots) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].setAttribute('aria-selected', 'false');
    }
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
    }
    
    // Announce slide change to screen readers
    const liveRegion = document.getElementById('slider-live-region');
    if (liveRegion) {
        liveRegion.textContent = `Showing testimonial ${currentSlide + 1} of ${slides.length}`;
    }
}

/**
 * Navigate to next or previous slide
 */
function navigateSlide(direction, slides, dots) {
    let newIndex = currentSlide + direction;
    
    if (newIndex < 0) {
        newIndex = slides.length - 1;
    } else if (newIndex >= slides.length) {
        newIndex = 0;
    }
    
    goToSlide(newIndex, slides, dots);
}

/**
 * Start auto-scrolling
 */
function startAutoScroll(slides, dots) {
    stopAutoScroll(); // Clear any existing interval
    autoScrollInterval = setInterval(() => {
        navigateSlide(1, slides, dots);
    }, SLIDE_INTERVAL);
}

/**
 * Stop auto-scrolling
 */
function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeSlider, goToSlide, navigateSlide };
}
