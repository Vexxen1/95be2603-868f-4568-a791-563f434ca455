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
        contentDiv.innerHTML = `
            <h2>Changelog</h2>
            <p>This section will display the changelog. Content is coming soon!</p>
        `;
    };

    // Add event listeners to buttons
    document.getElementById('view-list').addEventListener('click', loadViewList);
    document.getElementById('changelog').addEventListener('click', loadChangelog);
});
