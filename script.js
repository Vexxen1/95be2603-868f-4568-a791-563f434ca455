// Load data from JSON
fetch('wishlist.json')
    .then(response => response.json())
    .then(data => {
        const wishlist = document.getElementById('wishlist');
        const searchBar = document.getElementById('search-bar');
        const categoryFilter = document.getElementById('category-filter');

        // Function to display items
        const displayItems = (items) => {
            wishlist.innerHTML = '';
            items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <a href="${item.link}" target="_blank">${item.name}</a> - 
                    <strong>${item.priority}</strong> - 
                    <em>${item.description}</em>
                `;
                wishlist.appendChild(listItem);
            });
        };

        // Initial display
        displayItems(data);

        // Filter items by search
        searchBar.addEventListener('input', () => {
            const searchQuery = searchBar.value.toLowerCase();
            const filteredItems = data.filter(item =>
                item.name.toLowerCase().includes(searchQuery) ||
                item.description.toLowerCase().includes(searchQuery)
            );
            displayItems(filteredItems);
        });

        // Filter items by category
        categoryFilter.addEventListener('change', () => {
            const category = categoryFilter.value;
            const filteredItems = data.filter(item =>
                category === 'All' || item.category === category
            );
            displayItems(filteredItems);
        });
    });
