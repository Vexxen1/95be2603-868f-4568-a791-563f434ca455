document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');

    // Add click event listeners for navigation
    document.getElementById('view-list').addEventListener('click', () => {
        contentDiv.innerHTML = '<h2>View List</h2><p>This section will display your list.</p>';
    });

    document.getElementById('changelog').addEventListener('click', () => {
        contentDiv.innerHTML = '<h2>Changelog</h2><p>This section will display the changelog.</p>';
    });
});
