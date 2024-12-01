// Load JSON data and initialize UI
fetch('wishlist.json')
    .then(response => response.json())
    .then(data => {
        const wishlistContainer = document.getElementById('wishlist-container');
        const categoryFilter = document.getElementById('category-filter');
        const viewListButton = document.getElementById('view-list-button');
        const changelogButton = document.getElementById('changelog-button');
        const viewListSection = document.getElementById('view-list-section');
        const changelogSection = document.getElementById('changelog-section');

        let currentSort = 'priority'; // Default sort
        let categories = ['All'];
        let filteredData = data;

        // Populate categories
        data.forEach(item => {
            if (!categories.includes(item.category)) {
                categories.push(item.category);
            }
        });
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Render the wishlist
        const renderWishlist = () => {
            wishlistContainer.innerHTML = '';
            filteredData.forEach((item, index) => {
                const listItem = document.createElement('div');
                listItem.classList.add('wishlist-item');
                const priorityClass =
                    item.priority === 3 ? 'priority-high' :
                    item.priority === 2 ? 'priority-medium' : 'priority-low';
                listItem.innerHTML = `
                    <a href="${item.link}" target="_blank">${index + 1}. ${item.name}</a> -
                    <span class="priority ${priorityClass}">${item.priority === 3 ? 'Top Priority' : item.priority === 2 ? 'Nice-to-Have' : 'Optional'}</span> -
                    <span>${item.value}/10</span>
                    <p>${item.description}</p>
                `;
                wishlistContainer.appendChild(listItem);
            });
        };

        // Filter by category
        categoryFilter.addEventListener('change', () => {
            const selectedCategories = Array.from(categoryFilter.selectedOptions).map(option => option.value);
            filteredData = data.filter(item =>
                selectedCategories.includes('All') || selectedCategories.includes(item.category)
            );
            renderWishlist();
        });

        // Sort handlers
        document.getElementById('sort-priority').addEventListener('click', () => {
            currentSort = currentSort === 'priority' ? '-priority' : 'priority';
            filteredData.sort((a, b) => currentSort === 'priority' ? b.priority - a.priority : a.priority - b.priority);
            renderWishlist();
        });

        document.getElementById('sort-date').addEventListener('click', () => {
            currentSort = currentSort === 'date' ? '-date' : 'date';
            filteredData.sort((a, b) => currentSort === 'date' ? b.dateAdded - a.dateAdded : a.dateAdded - b.dateAdded);
            renderWishlist();
        });

        document.getElementById('sort-alpha').addEventListener('click', () => {
            currentSort = currentSort === 'alpha' ? '-alpha' : 'alpha';
            filteredData.sort((a, b) => currentSort === 'alpha' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
            renderWishlist();
        });

        // Navigation
        viewListButton.addEventListener('click', () => {
            viewListSection.style.display = 'block';
            changelogSection.style.display = 'none';
        });

        changelogButton.addEventListener('click', () => {
            viewListSection.style.display = 'none';
            changelogSection.style.display = 'block';
        });

        // Initial render
        renderWishlist();
    });
