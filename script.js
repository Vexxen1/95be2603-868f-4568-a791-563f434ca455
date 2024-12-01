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

    // Function to load View List
    const loadViewList = () => {
        contentDiv.innerHTML = '<h2>View List</h2>';

        if (wishlist.length > 0) {
            const entry = getWishlistEntry(0); // Get the first entry
            if (entry) {
                const entryHTML = `
                    <div>
                        <h3><a href="${entry.getLink()}" target="_blank" style="color: blue;">${entry.getName()}</a></h3>
                        <p><strong>Category:</strong> ${entry.getCategory()}</p>
                        <p><strong>Priority:</strong> ${entry.getPriority()}</p>
                        <p><strong>Value:</strong> ${entry.getValue()}</p>
                        <p><strong>Description:</strong> ${entry.getDescription()}</p>
                    </div>
                `;
                contentDiv.innerHTML += entryHTML;
            } else {
                contentDiv.innerHTML += '<p>No entry found at index 0.</p>';
            }
        } else {
            contentDiv.innerHTML += '<p>Loading wishlist data...</p>';
        }
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
