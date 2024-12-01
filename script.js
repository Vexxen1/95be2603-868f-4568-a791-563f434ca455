// Select the button and output elements
const button = document.getElementById('actionButton');
const output = document.getElementById('output');

// Add a click event listener
button.addEventListener('click', () => {
    output.textContent = "You clicked the button!";
});
