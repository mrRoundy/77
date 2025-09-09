// public/bookshelf.js

/**
 * Initializes a bookshelf component, fetches its books, and sets up scroll controls.
 * @param {string} sectionId - The ID of the main <section> element for this bookshelf.
 * @param {string} genre - The book genre to fetch from Supabase.
 * @param {object} supabase - The initialized Supabase client.
 */
export function initializeBookshelf(sectionId, genre, supabase) {
    (async () => {
        async function fetchBooksByGenre(genreToFetch) {
            const { data, error } = await supabase
                .from('filtered_books')
                .select('id, title, author, image')
                .ilike('sub-genre', `%${genreToFetch}%`)
                .limit(10);

            if (error) {
                console.error(`Error fetching books for genre "${genreToFetch}":`, error);
                return [];
            }
            return data;
        }

        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) return;

        const bookshelf = sectionElement.querySelector('.bookshelf');
        const scrollLeftBtn = sectionElement.querySelector('[aria-label="Scroll left"]');
        const scrollRightBtn = sectionElement.querySelector('[aria-label="Scroll right"]');

        if (!bookshelf || !scrollLeftBtn || !scrollRightBtn) return;

        const booksData = await fetchBooksByGenre(genre);

        if (!booksData || booksData.length === 0) {
            bookshelf.innerHTML = `<p style="color: #a0a0a0; text-align: center; width: 100%;">No books found for ${genre}.</p>`;
            scrollLeftBtn.style.display = 'none';
            scrollRightBtn.style.display = 'none';
            return;
        }

        function createBookElement(book) {
            const link = document.createElement('a');
            link.href = `book-details.html?id=${book.id}`;
            link.className = "book-item-link";
            link.dataset.title = book.title.toLowerCase();
            link.dataset.author = book.author ? book.author.toLowerCase() : '';

            const bookItem = document.createElement('div');
            bookItem.className = "book-item";
            bookItem.innerHTML = `
                <div class="book-wrapper-3d">
                    <div class="book-cover-3d">
                        <img src="${book.image}" alt="Cover of ${book.title}">
                    </div>
                    <div class="book-spine-3d">
                        <h4>${book.title}</h4>
                    </div>
                </div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p>by ${book.author || 'Unknown'}</p>
                </div>`;
            
            link.appendChild(bookItem);
            return link;
        }

        // --- NEW: SCROLL QUEUE LOGIC ---
        const originalBookCount = booksData.length;
        const allBooksData = [...booksData, ...booksData]; // Duplicate for infinite effect
        allBooksData.forEach(book => bookshelf.appendChild(createBookElement(book)));

        let currentIndex = 0;
        const baseTransitionDuration = 600; // Base speed in milliseconds
        let isScrolling = false;
        const scrollQueue = [];

        function updateScrollPosition(duration, useTransition = true) {
            if (bookshelf.children.length === 0) return;
            const bookWidth = bookshelf.children[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(bookshelf).gap);
            const scrollAmount = (bookWidth + gap) * currentIndex;
            
            bookshelf.style.transition = useTransition ? `transform ${duration}ms ease-out` : 'none';
            bookshelf.style.transform = `translateX(-${scrollAmount}px)`;
        }

        function processScrollQueue() {
            if (isScrolling || scrollQueue.length === 0) {
                return; // Don't process if already scrolling or queue is empty
            }

            isScrolling = true;
            const direction = scrollQueue.shift(); // Get the next action from the queue

            // Adjust speed based on how many items are left in the queue
            const speedFactor = Math.max(0.4, 1 - (scrollQueue.length * 0.1));
            const dynamicDuration = baseTransitionDuration * speedFactor;

            // Handle 'next' scroll
            if (direction === 'next') {
                currentIndex++;
                updateScrollPosition(dynamicDuration);
                if (currentIndex >= originalBookCount) {
                    // When we reach the end of the original list (in the cloned part)
                    setTimeout(() => {
                        currentIndex = 0;
                        updateScrollPosition(0, false); // Jump back to the start without animation
                    }, dynamicDuration);
                }
            }

            // Handle 'previous' scroll
            if (direction === 'prev') {
                if (currentIndex <= 0) {
                    // If at the beginning, jump to the end of the list (cloned part)
                    currentIndex = originalBookCount;
                    updateScrollPosition(0, false);
                    // Use a tiny timeout to allow the browser to apply the non-transitioned jump
                    setTimeout(() => {
                        currentIndex--;
                        updateScrollPosition(dynamicDuration);
                    }, 20);
                } else {
                    currentIndex--;
                    updateScrollPosition(dynamicDuration);
                }
            }
            
            // After the animation is done, allow the next item in the queue to be processed
            setTimeout(() => {
                isScrolling = false;
                processScrollQueue(); // Process next item if it exists
            }, dynamicDuration);
        }

        scrollRightBtn.addEventListener('click', () => {
            scrollQueue.push('next');
            processScrollQueue();
        });

        scrollLeftBtn.addEventListener('click', () => {
            scrollQueue.push('prev');
            processScrollQueue();
        });

    })();
}