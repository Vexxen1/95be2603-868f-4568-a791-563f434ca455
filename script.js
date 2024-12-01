document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');

    // Function to load View List
    const loadViewList = () => {
        contentDiv.innerHTML = `
            <h2>View List</h2>
            <p>This section will display your list. Content is coming soon!</p>
        `;
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
