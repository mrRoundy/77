document.addEventListener('DOMContentLoaded', () => {
    // Load the navbar and footer components
    loadComponent('nav.html', 'navbar-container', initializeNavbar);
    loadComponent('footer.html', 'footer-container', () => {
        const yearSpan = document.getElementById('footer-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    });

    // Logic to trigger the typing animation when the user scrolls to it
    const quoteElement = document.getElementById('animated-quote');
    if (quoteElement) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    quoteElement.classList.add('typing-animation');
                    observer.unobserve(quoteElement);
                }
            });
        }, { threshold: 0.8 }); 
        observer.observe(quoteElement);
    }
});