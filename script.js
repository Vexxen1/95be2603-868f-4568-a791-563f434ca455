// Load JSON data and handle functionality
fetch('wishlist.json')
    .then(response => response.json())
    .then(data => {
        const wishlist = document.getElementById('wishlist');
        const categoryFilter = document.getElementById('category-filter');
        const viewListBtn = document.getElementById('view-list-btn');
        const changelogBtn = document.getElementById('changelog-btn');
        const viewListSection = document.getElementById('view-list-section');
        const changelogSection = document.getElementById('changelog-section');

        // Populate category filter with unique categories from JSON data
        const categories = [...new Set(data.map(item => item.category))];
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Function to display items
        const displayItems = (items) => {
            wishlist.innerHTML = '';
            items.forEach((item, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('wishlist-item');
                listItem.innerHTML = `
                    <a href="${item.link}" target="_blank">${index + 1}. ${item.name}</a> - 
                    <span class="${item.priority === 3 ? 'priority-high' : item.priority === 2 ? 'priority-medium' : 'priority-low'}">
                    ${item.priority === 3 ? 'Top Priority' : item.priority === 2 ? 'Nice-to-Have' : 'Optional'}
                    </span> - ${item.value}/10
                    <div>${item.description}</div>
                `;
                wishlist.appendChild(listItem);
            });
        };

        // Initial display of items
        displayItems(data);

        // Sorting functions
        const sortItems = (criteria, direction) => {
            let sortedItems = [...data];
            sortedItems.sort((a, b) => {
                if (criteria === 'priority' || criteria === 'value') {
                    return direction === 'asc' ? a[criteria] - b[criteria] : b[criteria] - a[criteria];
                } else {
                    return direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                }
            });
            displayItems(sortedItems);
        };

        // Event listeners for sorting buttons
        document.getElementById('sort-priority-highest').addEventListener('click', () => sortItems('priority', 'desc'));
        document.getElementById('sort-priority-lowest').addEventListener('click', () => sortItems('priority', 'asc'));
        document.getElementById('sort-az').addEventListener('click', () => sortItems('name', 'asc'));
        document.getElementById('sort-za').addEventListener('click', () => sortItems('name', 'desc'));

        // Toggle view between sections
        viewListBtn.addEventListener('click', () => {
            viewListSection.style.display = 'block';
            changelogSection.style.display = 'none';
        });

        changelogBtn.addEventListener('click', () => {
            changelogSection.style.display = 'block';
            viewListSection.style.display = 'none';
        });

    });
