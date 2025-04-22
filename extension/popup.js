// Constants for API endpoint and DOM elements
const API_BASE_URL = 'http://localhost:5000/api/items'; // Adjust if backend runs elsewhere
const saveButton = document.getElementById('save-button');
const notesInput = document.getElementById('notes');
const itemsList = document.getElementById('items-list');
const saveStatus = document.getElementById('save-status');
const itemsStatus = document.getElementById('items-status');
const loadingItems = document.getElementById('loading-items');
const currentPageTitleElement = document.getElementById('current-page-title');

let currentPage = { url: '', title: '' };

/**
 * Fetches the details (URL and title) of the currently active tab.
 */
async function getCurrentTabDetails() {
    try {
        // Query for the active tab in the current window
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url && tab.title) {
            currentPage = { url: tab.url, title: tab.title };
            currentPageTitleElement.textContent = currentPage.title;
            currentPageTitleElement.title = currentPage.title; // Add tooltip for long titles
            saveButton.disabled = false; // Enable save button once details are loaded
        } else {
            showStatus(saveStatus, 'Error: Could not get page details.', true);
            currentPageTitleElement.textContent = 'Could not load page details.';
            saveButton.disabled = true;
        }
    } catch (error) {
        console.error('Error getting current tab:', error);
        showStatus(saveStatus, 'Error fetching tab details.', true);
        currentPageTitleElement.textContent = 'Error loading page details.';
        saveButton.disabled = true;
    }
}

/**
 * Displays status messages to the user.
 * @param {HTMLElement} element - The DOM element to display the message in.
 * @param {string} message - The message text.
 * @param {boolean} isError - Whether the message indicates an error.
 */
function showStatus(element, message, isError = false) {
    element.textContent = message;
    element.className = `status-message ${isError ? 'error' : 'success'}`;
    // Clear the message after a few seconds
    setTimeout(() => {
        element.textContent = '';
        element.className = 'status-message';
    }, 3000);
}

/**
 * Fetches saved items from the backend API.
 */
async function fetchItems() {
    loadingItems.style.display = 'block'; // Show loading indicator
    itemsList.innerHTML = ''; // Clear existing list
    itemsStatus.textContent = ''; // Clear previous status

    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const items = await response.json();
        displayItems(items);
        if (items.length === 0) {
            itemsStatus.textContent = 'No items saved yet.';
        }
    } catch (error) {
        console.error('Error fetching items:', error);
        showStatus(itemsStatus, 'Error fetching saved items.', true);
    } finally {
        loadingItems.style.display = 'none'; // Hide loading indicator
    }
}

/**
 * Renders the list of saved items in the popup.
 * @param {Array} items - An array of saved item objects.
 */
function displayItems(items) {
    itemsList.innerHTML = ''; // Clear the list first
    items.forEach(item => {
        const li = document.createElement('li');

        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';

        const titleLink = document.createElement('a');
        titleLink.className = 'item-title';
        titleLink.href = item.url; // Make title a link
        titleLink.textContent = item.title;
        titleLink.title = item.url; // Show URL on hover
        titleLink.target = '_blank'; // Open in new tab
        itemInfo.appendChild(titleLink);

        if (item.notes) {
            const notesP = document.createElement('p');
            notesP.className = 'item-notes';
            notesP.textContent = item.notes;
            notesP.title = item.notes; // Show full notes on hover
            itemInfo.appendChild(notesP);
        }

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '&times;'; // Use '×' symbol for delete
        deleteButton.title = 'Delete this item';
        deleteButton.addEventListener('click', () => deleteItem(item._id));

        li.appendChild(itemInfo);
        li.appendChild(deleteButton);
        itemsList.appendChild(li);
    });
}

/**
 * Handles the click event for the 'Save This Page' button.
 */
async function handleSaveClick() {
    saveButton.disabled = true; // Disable button during save
    saveStatus.textContent = 'Saving...';
    saveStatus.className = 'status-message';

    const notes = notesInput.value.trim();

    try {
        const response = await fetch(`${API_BASE_URL}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: currentPage.url,
                title: currentPage.title,
                notes: notes,
                // Thumbnail fetching could be added here or on the backend
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
        }

        const savedItem = await response.json();
        showStatus(saveStatus, 'Page saved successfully!', false);
        notesInput.value = ''; // Clear notes field
        fetchItems(); // Refresh the list of items
    } catch (error) {
        console.error('Error saving item:', error);
        showStatus(saveStatus, `Error: ${error.message}`, true);
    } finally {
        // Re-enable button only if page details are still valid
        if (currentPage.url) {
             saveButton.disabled = false;
        }
    }
}

/**
 * Handles the deletion of a saved item.
 * @param {string} id - The MongoDB ID of the item to delete.
 */
async function deleteItem(id) {
    itemsStatus.textContent = 'Deleting...';
    itemsStatus.className = 'status-message';

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
        }

        showStatus(itemsStatus, 'Item deleted successfully.', false);
        fetchItems(); // Refresh the list after deletion
    } catch (error) {
        console.error('Error deleting item:', error);
        showStatus(itemsStatus, `Error: ${error.message}`, true);
    }
}

// --- Event Listeners --- //

// Add listener for the save button
saveButton.addEventListener('click', handleSaveClick);

// Initial actions when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    saveButton.disabled = true; // Disable save button initially
    getCurrentTabDetails(); // Get current tab info
    fetchItems(); // Fetch and display saved items
});