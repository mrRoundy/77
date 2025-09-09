// public/componentLoader.js

/**
 * Fetches HTML content from a URL and injects it into a specified element.
 * @param {string} url - The URL of the component to load (e.g., 'nav.html').
 * @param {string} elementId - The ID of the HTML element to place the content in.
 * @param {function} [callback] - An optional function to run after the component is loaded.
 */
function loadComponent(url, elementId, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load ${url}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                if (callback) {
                    callback();
                }
            }
        })
        .catch(error => console.error(`Error loading component:`, error));
}

/**
 * Initializes the navigation bar, primarily for handling the mobile menu toggle.
 * This function should be called after 'nav.html' has been loaded into the DOM.
 */
function initializeNavbar() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuText = document.getElementById('menu-text');

    if (mobileMenuButton && mobileMenu && menuText) {
        mobileMenuButton.addEventListener('click', () => {
            // Check if the menu is currently open
            const isMenuOpen = !mobileMenu.classList.contains('hidden');
            
            // Toggle the menu's visibility
            mobileMenu.classList.toggle('hidden');
            
            // Prevent scrolling of the body when the menu is open
            document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
            
            // Change the button text
            menuText.textContent = isMenuOpen ? 'Menu' : 'Close';
        });
    }
}