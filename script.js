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

Array.prototype.sortWishlistEntriesByPriority = function(order) {
    return this.slice().sort((a, b) => {
        if (a.priority !== b.priority) {
            return order === "Up" ? b.priority - a.priority : a.priority - b.priority;
        }
        // If priority is the same, compare by value
        return order === "Up" ? b.value - a.value : a.value - b.value;
    });
};

Array.prototype.sortWishlistEntriesByTimestampNewest = function() {
    return this.slice().sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;

        return dateB - dateA; // Newest first
    });
};

Array.prototype.sortWishlistEntriesByTimestampOldest = function() {
    return this.slice().sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : Infinity;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : Infinity;

        return dateA - dateB; // Oldest first
    });
};
Array.prototype.sortWishlistEntriesByAZ = function() {
    return this.slice().sort((a, b) => a.name.localeCompare(b.name));
};

Array.prototype.sortWishlistEntriesByZA = function() {
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

    // Function to load View List
const loadViewList = () => {
    contentDiv.innerHTML = `
        <h2 class="section-title">View List</h2>

        <div id="controls" class="controls-container">
            <select id="category-filter" multiple class="filter-select">
                <option value="All" selected>All Categories</option>
            </select>
            <button id="sort-priority-high" class="btn">Sort by Highest Priority</button>
            <button id="sort-priority-low" class="btn">Sort by Lowest Priority</button>
            <button id="sort-timestamp-newest" class="btn">Sort by Newest</button>
            <button id="sort-timestamp-oldest" class="btn">Sort by Oldest</button>
            <button id="sort-az" class="btn">Sort A-Z</button>
            <button id="sort-za" class="btn">Sort Z-A</button>
        </div>

        <div id="wishlist-items" class="wishlist-container"></div>

        <div id="create-entry" class="create-entry-container">
            <h3 class="section-title">Create Entry</h3>
            <div class="form-group">
                <label>Load Entry (Enter Number):
                    <input id="entry-load-number" type="number" min="1" class="input-field" />
                </label>
                <button id="load-entry" class="btn">Load</button>
            </div>
            <div class="form-group">
                <label>Name:
                    <input id="entry-name" type="text" class="input-field" />
                </label>
            </div>
            <div class="form-group">
                <label>Category:
                    <input id="entry-category" type="text" class="input-field" />
                </label>
            </div>
            <div class="form-group">
                <label>Priority:
                    <select id="entry-priority" class="input-field">
                        <option value="3" color="red">Top Priority</option>
                        <option value="2" color="yellow">Nice-to-Have</option>
                        <option value="1" color="gray">Optional</option>
                    </select>
                </label>
            </div>
            <div class="form-group">
                <label>Value:
                    <input id="entry-value" type="number" min="0" max="10" step="0.1" class="input-field" />
                </label>
            </div>
            <div class="form-group">
                <label>Description:
                    <textarea id="entry-description" class="textarea-field"></textarea>
                </label>
            </div>
            <div class="form-group">
                <label>Link:
                    <input id="entry-link" type="text" class="input-field" />
                </label>
            </div>
            <button id="copy-to-clipboard" class="btn btn-full">Copy To Clipboard</button>
        </div>
    `;

    let filteredWishlist = [...wishlist];

    // Populate category filter
    const categoryFilter = document.getElementById('category-filter');
    const categories = [...new Set(wishlist.map(item => item.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const renderWishlist = (items) => {
        const wishlistContainer = document.getElementById('wishlist-items');
        wishlistContainer.innerHTML = '';
        items.forEach((item, index) => {
            const boxColor = item.priority === 3 ? 'red' :
                item.priority === 2 ? 'yellow' : 'gray';

            const hasValidLink = item.link && item.link.trim() !== '' && item.link !== 'entity';

            wishlistContainer.innerHTML += `
                <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px;">
                    <h3 style="margin: 0;">
                        ${hasValidLink 
                            ? `<a href="${item.link}" target="_blank" style="color: blue;">${index + 1}. ${item.name}</a>` 
                            : `${index + 1}. ${item.name}`
                        } - 
                        <span style="color: ${boxColor};">${item.priority === 3 ? 'Top Priority' : item.priority === 2 ? 'Nice-to-Have' : 'Optional'}</span> - ${item.value}/10
                    </h3>
                    <p style="margin: 5px 0;">${item.description}</p>
                </div>
            `;
        });
    };

    // Initial render
    renderWishlist(filteredWishlist);

    // Add sorting functionality
    document.getElementById('sort-priority-high').addEventListener('click', () => {
        filteredWishlist = filteredWishlist.sortWishlistEntriesByPriority('Up');
        renderWishlist(filteredWishlist);
    });

    document.getElementById('sort-priority-low').addEventListener('click', () => {
        filteredWishlist = filteredWishlist.sortWishlistEntriesByPriority('Down');
        renderWishlist(filteredWishlist);
    });

    document.getElementById('sort-timestamp-newest').addEventListener('click', () => {
        filteredWishlist = filteredWishlist.sortWishlistEntriesByTimestampNewest();
        renderWishlist(filteredWishlist);
    });

    document.getElementById('sort-timestamp-oldest').addEventListener('click', () => {
        filteredWishlist = filteredWishlist.sortWishlistEntriesByTimestampOldest();
        renderWishlist(filteredWishlist);
    });

    document.getElementById('sort-az').addEventListener('click', () => {
        filteredWishlist = filteredWishlist.sortWishlistEntriesByAZ();
        renderWishlist(filteredWishlist);
    });

    document.getElementById('sort-za').addEventListener('click', () => {
        filteredWishlist = filteredWishlist.sortWishlistEntriesByZA();
        renderWishlist(filteredWishlist);
    });

    // Add category filtering functionality
    categoryFilter.addEventListener('change', () => {
        const selectedCategories = Array.from(categoryFilter.selectedOptions).map(opt => opt.value);
        filteredWishlist = selectedCategories.includes('All')
            ? wishlist
            : wishlist.filter(item => selectedCategories.includes(item.category));
        renderWishlist(filteredWishlist);
    });

    // Maintain Create Entry functionality
    document.getElementById('load-entry').addEventListener('click', () => {
        const entryNumber = parseInt(document.getElementById('entry-load-number').value, 10);
        if (isNaN(entryNumber) || entryNumber < 1 || entryNumber > filteredWishlist.length) {
            alert('Invalid entry number.');
            return;
        }

        const entry = filteredWishlist[entryNumber - 1];
        document.getElementById('entry-name').value = entry.name;
        document.getElementById('entry-category').value = entry.category;
        document.getElementById('entry-priority').value = entry.priority;
        document.getElementById('entry-value').value = entry.value;
        document.getElementById('entry-description').value = entry.description;
        document.getElementById('entry-link').value = entry.link;
    });

    document.getElementById('copy-to-clipboard').addEventListener('click', () => {
        const name = document.getElementById('entry-name').value.trim();
        const category = document.getElementById('entry-category').value.trim();
        const priority = parseInt(document.getElementById('entry-priority').value, 10);
        const value = parseFloat(document.getElementById('entry-value').value);
        const description = document.getElementById('entry-description').value.trim();
        const link = document.getElementById('entry-link').value.trim();

        if (!name || !category || isNaN(priority) || isNaN(value) || !description) {
            alert('Please fill in all required fields.');
            return;
        }

        const newEntry = {
            name,
            category,
            priority,
            value,
            description,
            link: link || '',
            timestamp: getCurrentTimestamp(),
        };

        const updatedWishlist = getAllWishlistEntries().filter(
            (entry) => !(entry.name === newEntry.name && entry.category === newEntry.category)
        );

        updatedWishlist.push(newEntry);

        const sortedWishlist = updatedWishlist.sortWishlistEntriesByPriority('Up');

        navigator.clipboard.writeText(JSON.stringify(sortedWishlist, null, 4))
            .then(() => alert('Updated wishlist copied to clipboard!'))
            .catch(() => alert('Failed to copy updated wishlist to clipboard.'));
    });
};




    // Function to load Changelog
    const loadChangelog = () => {
        const currentTimestamp = getCurrentTimestamp(); // Generate the current timestamp
        const changelogContent = `
            - 2024-12-01T12:00:00Z: Added "The Wild Robot Movie" to the list.
            - 2024-11-30T15:30:00Z: Updated "Journal 3" description.
        `; // Example changelog content

        contentDiv.innerHTML = `
            <h2 class="section-title">Changelog</h2>
            <div class="changelog-container">
                <pre class="changelog-content">${changelogContent}</pre>
            </div>
        `;
    };

    // Add event listeners to buttons
    document.getElementById('view-list').addEventListener('click', loadViewList);
    document.getElementById('changelog').addEventListener('click', loadChangelog);
});
