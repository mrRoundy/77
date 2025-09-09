// public/home-prompt.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('home-prompt-form');
    const promptInput = document.getElementById('promptInput');
    const sendBtn = document.getElementById('sendBtn');
    const byHighlightsBtn = document.getElementById('byHighlightsBtn');
    const bySynopsisBtn = document.getElementById('bySynopsisBtn');
    
    let searchType = 'highlights'; // Default search type

    // Function to update send button state and style
    const updateSendButton = () => {
        const hasText = promptInput.value.trim() !== '';
        sendBtn.disabled = !hasText;
        if (hasText) {
            sendBtn.classList.remove('bg-neutral-100', 'text-neutral-400');
            sendBtn.classList.add('bg-classic-green', 'text-white');
        } else {
            sendBtn.classList.remove('bg-classic-green', 'text-white');
            sendBtn.classList.add('bg-neutral-100', 'text-neutral-400');
        }
    };

    // Make textarea expand with content
    promptInput.addEventListener('input', () => {
        promptInput.style.height = 'auto';
        promptInput.style.height = `${promptInput.scrollHeight}px`;
        updateSendButton();
    });

    // START: New code to handle Enter key submission
    promptInput.addEventListener('keypress', (e) => {
        // Check if the Enter key is pressed without the Shift key
        if (e.key === 'Enter' && !e.shiftKey) {
            // Prevent the default action (which is to add a new line)
            e.preventDefault();
            // Trigger the send button's click event
            sendBtn.click();
        }
    });
    // END: New code

    // Handle search type selection
    byHighlightsBtn.addEventListener('click', () => {
        searchType = 'highlights';
        byHighlightsBtn.classList.add('active');
        bySynopsisBtn.classList.remove('active');
    });

    bySynopsisBtn.addEventListener('click', () => {
        searchType = 'synopsis';
        bySynopsisBtn.classList.add('active');
        byHighlightsBtn.classList.remove('active');
    });
    
    // Handle form submission for redirection
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = promptInput.value.trim();
        if (query) {
            // Encode the parameters to make them URL-safe
            const encodedQuery = encodeURIComponent(query);
            const encodedSearchType = encodeURIComponent(searchType);
            
            // Redirect to the prompt page with the query and search type
            window.location.href = `prompt.html?query=${encodedQuery}&searchType=${encodedSearchType}`;
        }
    });

    // Initial check in case of browser auto-fill
    updateSendButton();
});