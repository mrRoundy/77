import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- SUPABASE CLIENT ---
// Make sure to use your actual Supabase URL and Key
const supabaseUrl = 'https://gyytvnpsjazrkcfxolxg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5eXR2bnBzamF6cmtjZnhvbHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyODE4MjMsImV4cCI6MjA2OTg1NzgyM30.b58KbtxvgwzrRw_q-nSDE44a4fr-Ssxhx0MRDO9t3es';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- DOM ELEMENTS ---
const loadingIndicator = document.getElementById('loading-indicator');
const bookContent = document.getElementById('book-content');
const bookCover = document.getElementById('book-cover');
const bookTitle = document.getElementById('book-title');
const bookAuthor = document.getElementById('book-author');
const bookGenres = document.getElementById('book-genres');
const bookSubgenres = document.getElementById('book-subgenres');
const bookSynopsis = document.getElementById('book-synopsis');


/**
 * Fetches book details from Supabase based on its ID.
 * @param {string} id The ID of the book to fetch.
 * @returns {Promise<object|null>} The book data object or null if not found.
 */
async function fetchBookDetails(id) {
    const { data, error } = await supabase
        .from('filtered_books')
        .select('*') // Select all columns for the details page
        .eq('id', id)
        .single(); // We expect only one book

    if (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
    return data;
}

/**
 * Displays the fetched book data on the page.
 * @param {object} book The book data object.
 */
function displayBookDetails(book) {
    if (!book) {
        loadingIndicator.innerHTML = '<p>Sorry, this book could not be found.</p>';
        return;
    }

    // Populate the elements
    bookCover.src = book.image || ''; // Use a placeholder if no image
    bookCover.alt = `Cover of ${book.title}`;
    bookTitle.textContent = book.title || 'Title not available';
    bookAuthor.textContent = `by ${book.author || 'Unknown Author'}`;
     bookGenres.textContent = 'Self-improvement';
    bookSubgenres.textContent = book['sub-genre'] || 'Not specified';
    bookSynopsis.textContent = book.synopsis || 'Synopsis not available.';

    // Hide loading and show content
    loadingIndicator.classList.add('hidden');
    bookContent.classList.remove('hidden');
}


// --- MAIN EXECUTION ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get the book ID from the URL
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    if (!bookId) {
        loadingIndicator.innerHTML = '<p>No book selected. Please go back and choose a book.</p>';
        return;
    }

    // 2. Fetch the book details
    const bookData = await fetchBookDetails(bookId);

    // 3. Display the details
    displayBookDetails(bookData);
});