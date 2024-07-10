// scripts.js

// Example function to load common functionality for project cards
function loadProjectCards() {
    const projectCards = document.querySelectorAll('.card');

    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get the URL of the project from the card's link
            const projectUrl = this.querySelector('a').getAttribute('href');
            
            // Redirect to the project URL
            window.location.href = projectUrl;
        });
    });
}

// Call the common functions when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    loadProjectCards();
    // Add more common functions as needed
});
