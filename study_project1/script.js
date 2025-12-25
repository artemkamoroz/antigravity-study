
// DOM Elements
const sections = document.querySelectorAll('.hero-content, .section-title, .skill-card, .timeline-item, .project-card, .footer-content');
const contactForm = document.getElementById('contact-form');

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

// Helper to add 'hidden' initially
sections.forEach((el) => {
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


// Handle Contact Form Submission (AJAX)
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Stop standard redirect

        const formData = new FormData(contactForm);
        const startBtnText = contactForm.querySelector('button').innerText;
        contactForm.querySelector('button').innerText = 'Sending... ⏳';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success!
                contactForm.innerHTML = `
                    <div class="success-message" style="text-align: center; padding: 20px;">
                        <h3 style="color: #4ade80; margin-bottom: 10px;">Message Sent! 🚀</h3>
                        <p style="color: var(--text-secondary);">Thank you for reaching out. I'll get back to you soon.</p>
                    </div>
                `;
            } else {
                // Formspree error
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    alert(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    alert("Oops! There was a problem submitting your form");
                }
                contactForm.querySelector('button').innerText = startBtnText;
            }
        } catch (error) {
            // Network error
            alert("Oops! There was a problem submitting your form");
            contactForm.querySelector('button').innerText = startBtnText;
        }
    });
}
