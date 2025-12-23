// Intersection Observer for Scroll Animations

const observerOptions = {
    threshold: 0.1 // Trigger when 10% of element is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Optional: Stop observing once shown? 
            // observer.unobserve(entry.target); 
            // Commented out to allow re-animating if scrolling up/down (user preference, usually keep it once)
        }
    });
}, observerOptions);

// Select elements to animate
// We'll apply the .hidden class to these elements in HTML or JS
// For now, let's grab sections and cards
const hiddenElements = document.querySelectorAll('.hero-content, .section-title, .skill-card, .timeline-item, .project-card, .footer-content');

// Helper to add 'hidden' initially
hiddenElements.forEach((el) => {
    el.classList.add('hidden');
    observer.observe(el);
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
