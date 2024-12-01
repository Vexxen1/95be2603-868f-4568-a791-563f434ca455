const getCurrentTimestamp = () => {
    return new Date().toISOString();
};

// Global variable to store the wishlist data
let wishlist = [];

// Functions to handle wishlist data 
const getWishlistEntry = (index) => {
    if (index >= 0 && index < wishlist.length) {
        const entry = wishlist[index];
        return {
            getName: () => entry.name,
            getCategory: () => entry.category,
            getPriority: () => entry.priority,
            getValue: () => entry.value,
            getDescription: () => entry.description,
            getLink: () => entry.link,
            getTimestamp: () => entry.timestamp,
        };
    }
    return null; // Return null if index is out of range
};

const getAllWishlistEntries = () => wishlist;

const getAllWishlistEntriesWithCategory = (categoryString) => {
    return wishlist.filter(entry => entry.category === categoryString);
};

Array.prototype.sortWishlistEntriesByPriority = function (order) {
    return this.slice().sort((a, b) => {
        if (a.priority !== b.priority) {
            return order === "Up" ? b.priority - a.priority : a.priority - b.priority;
        }
        // If priority is the same, compare by value
        return order === "Up" ? b.value - a.value : a.value - b.value;
    });
};

Array.prototype.sortWishlistEntriesByTimestampNewest = function () {
    return this.slice().sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;

        return dateB - dateA; // Newest first
    });
};

Array.prototype.sortWishlistEntriesByTimestampOldest = function () {
    return this.slice().sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : Infinity;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : Infinity;

        return dateA - dateB; // Oldest first
    });
};
Array.prototype.sortWishlistEntriesByAZ = function () {
    return this.slice().sort((a, b) => a.name.localeCompare(b.name));
};

Array.prototype.sortWishlistEntriesByZA = function () {
    return this.slice().sort((a, b) => b.name.localeCompare(a.name));
};
// Fetch wishlist data when the page loads
fetch('wishlist.json')
    .then(response => response.json())
    .then(data => {
        wishlist = data;
        console.log('Wishlist loaded:', wishlist);
    })
    .catch(error => console.error('Error loading wishlist:', error));

// Main DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');

    // Function to load View Listconst loadViewList = () => {
    const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = `
            <h2>View List</h2>
            <div id="controls" style="margin-bottom: 20px;">
                <div id="category-container" style="display: flex; flex-wrap: wrap; gap: 5px; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                    <input id="category-input" style="flex-grow: 1; border: none; outline: none;" placeholder="Type to filter categories..." />
                </div>
                <button id="sort-priority-high" style="margin: 10px;">Sort by Priority: Highest</button>
                <button id="sort-priority-low" style="margin: 10px;">Sort by Priority: Lowest</button>
                <button id="sort-timestamp-newest" style="margin: 10px;">Sort by Newest</button>
                <button id="sort-timestamp-oldest" style="margin: 10px;">Sort by Oldest</button>
                <button id="sort-az" style="margin: 10px;">Sort A-Z</button>
                <button id="sort-za" style="margin: 10px;">Sort Z-A</button>
            </div>
            <div id="wishlist-items" style="max-height: 600px; overflow-y: auto;"></div>
        `;

        const categoryInput = document.getElementById('category-input');
        const categoryContainer = document.getElementById('category-container');
        const wishlistContainer = document.getElementById('wishlist-items');

        let selectedCategories = [];
        const allCategories = [...new Set(wishlist.map(item => item.category))];

        const renderWishlist = (items) => {
            wishlistContainer.innerHTML = '';
            items.forEach((item, index) => {
                const boxColor = item.priority === 3 ? 'red' : item.priority === 2 ? 'yellow' : 'gray';
                wishlistContainer.innerHTML += `
                    <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px;">
                        <h3 style="margin: 0;">
                            <a href="${item.link}" target="_blank" style="color: blue;">${index + 1}. ${item.name}</a> - 
                            <span style="color: ${boxColor};">${item.priority === 3 ? 'Top Priority' : item.priority === 2 ? 'Nice-to-Have' : 'Optional'}</span> - ${item.value}/10
                        </h3>
                        <p style="margin: 5px 0;">${item.description}</p>
                    </div>
                `;
            });
        };

        const filterAndRender = () => {
            const filtered = selectedCategories.length === 0
                ? wishlist
                : wishlist.filter(item => selectedCategories.includes(item.category));
            renderWishlist(filtered);
        };
    
        const createBubble = (category) => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.innerHTML = `${category} <span>&times;</span>`;
            bubble.querySelector('span').addEventListener('click', () => {
                selectedCategories = selectedCategories.filter(cat => cat !== category);
                bubble.remove();
                filterAndRender();
            });
            categoryContainer.insertBefore(bubble, categoryInput);
        };

        categoryInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            const suggestions = allCategories.filter(cat => cat.toLowerCase().startsWith(value));
            // Show autocomplete suggestions (optional dropdown)
            console.log(suggestions); // Use a dropdown to display suggestions if needed
        });

        categoryInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                const value = categoryInput.value.trim();
                if (value && allCategories.includes(value) && !selectedCategories.includes(value)) {
                    selectedCategories.push(value);
                    createBubble(value);
                    filterAndRender();
                }
                categoryInput.value = '';
            }
        });
        
        // Initial render
        renderWishlist(wishlist);
    };


    // Function to load Changelog
    const loadChangelog = () => {
        const currentTimestamp = getCurrentTimestamp(); // Generate the current timestamp
        const changelogContent = `
            - 2024-12-01T12:00:00Z: Added "The Wild Robot Movie" to the list.
            - 2024-11-30T15:30:00Z: Updated "Journal 3" description.
        `; // Example changelog content

        contentDiv.innerHTML = `
            <h2>Changelog</h2>
            <p><strong>Current Timestamp:</strong> ${currentTimestamp}</p>
            <div style="margin-top: 20px; padding: 10px; background: #f4f4f4; border-radius: 5px; font-family: monospace; white-space: pre-line;">
                ${changelogContent}
            </div>
        `;
    };

    // Add event listeners to buttons
    document.getElementById('view-list').addEventListener('click', loadViewList);
    document.getElementById('changelog').addEventListener('click', loadChangelog);
});

