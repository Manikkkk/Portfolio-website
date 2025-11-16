/**
 * project-navigation.js
 * Handles navigation to project detail pages
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeProjectNavigation();
});

/**
 * Initialize project card click handlers
 */
function initializeProjectNavigation() {
    // Project mapping - maps project titles to their detail page URLs
    const projectMapping = {
        'LearnAxis': 'learnAxis.html',
        'Shambala Luxury Hotel': 'shambala-luxury-hotel.html',
        'Movie Ticket Booking Platform': 'movie-ticket-booking.html',
        'Thar DriveMax Landing Page': 'thar-drivemax.html',
        'Thar DriveMax': 'thar-drivemax.html',
        'Sneaker E-commerce App': 'sneaker-ecommerce.html',
        'Fitness Tracker App': null, // Coming soon
        'Real Estate Platform': null, // Coming soon
        'Social Media Dashboard': null // Coming soon
    };
    
    // Get all project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Check if card has a direct link (anchor tag)
        const directLink = card.querySelector('a[href$=".html"]');
        
        // Only add click handler if there's no direct link
        if (!directLink) {
            // Add click event listener
            card.addEventListener('click', function(e) {
                // Get project title from the card
                const titleElement = this.querySelector('h3');
                if (titleElement) {
                    const projectTitle = titleElement.textContent.trim();
                    const projectUrl = projectMapping[projectTitle];
                    
                    if (projectUrl) {
                        // Navigate to project detail page
                        window.location.href = projectUrl;
                    }
                    // If projectUrl is null, do nothing (coming soon projects)
                }
            });
            
            // Add keyboard support (Enter key)
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
        
        // Add visual feedback for keyboard focus
        card.addEventListener('focus', function() {
            this.style.outline = '3px solid #F59E0B';
            this.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeProjectNavigation };
}
