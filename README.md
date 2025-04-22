# WebSaver - Read Later Browser Extension

WebSaver is a browser extension designed to allow users to save any article, recipe, or webpage directly into a personal "Read Later" database.

## Project Structure

```
root/
  ├── extension/    # All extension code (popup, content scripts, etc.)
  ├── backend/      # API server code
  ├── README.md     # Full project documentation
  ├── .gitignore
  └── package.json  # Backend dependencies (inside backend/)
```

## Features

- Save current webpage URL, title, and optional notes.
- View saved items within the extension popup.
- Delete saved items.

## Tech Stack

- **Frontend (Extension):** HTML, CSS, Vanilla JavaScript (Manifest V3)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose)

## Setup and Installation

### Prerequisites

- Node.js (v18 or later recommended)
- npm (usually comes with Node.js)
- A MongoDB Atlas account (or a local MongoDB instance)
- A modern web browser that supports extensions (Chrome, Edge)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Read-Later--Browser-Extension/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    - Rename the `.env.example` file (or create a new `.env` file) in the `backend` directory.
    - Update the `MONGODB_URI` with your actual MongoDB connection string.
    - Optionally, change the `PORT` if needed.
    ```dotenv
    # .env
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
    PORT=5000
    ```

### Extension Setup (Chrome/Edge)

1.  Open your browser (Chrome or Edge).
2.  Go to the extensions page:
    - Chrome: `chrome://extensions`
    - Edge: `edge://extensions`
3.  Enable **Developer mode** (usually a toggle switch in the top right corner).
4.  Click on **"Load unpacked"**.
5.  Navigate to the `Read-Later--Browser-Extension/extension` directory in your cloned project and select it.
6.  The WebSaver extension icon should now appear in your browser's toolbar.

## Running the Backend Server

1.  Navigate to the `backend` directory:
    ```bash
    cd Read-Later--Browser-Extension/backend
    ```
2.  Start the server:
    - For development (with automatic restarts using nodemon, if installed globally or as dev dependency):
      ```bash
      npm run dev
      ```
    - For production:
      ```bash
      npm start
      ```
3.  The server should start, and you'll see messages indicating the connection to MongoDB and the port it's running on (e.g., `Server is running on port 5000`).

## Environment Variables

The backend requires the following environment variables defined in a `.env` file in the `backend` directory:

- `MONGODB_URI`: Your MongoDB connection string. This is essential for the backend to connect to the database.
- `PORT`: (Optional) The port the backend server will run on. Defaults to `5000` if not specified.

## Testing

### Manual Testing

1.  **Ensure the backend server is running.**
2.  **Open the browser where the extension is installed.**
3.  **Navigate to various webpages** (articles, blogs, product pages, etc.).
4.  **Click the WebSaver extension icon** in the toolbar.
5.  **Verify the popup UI:**
    - The current page title should be displayed correctly.
    - The "Save This Page" button should be enabled.
    - The saved items list should initially be empty or show previously saved items.
6.  **Save a page:**
    - Optionally add notes in the textarea.
    - Click "Save This Page".
    - Verify the success message appears.
    - Verify the new item appears in the "Saved Items" list.
7.  **View saved items:**
    - Check if the list displays titles and notes correctly.
    - Click on a saved item's title link to ensure it opens the correct URL in a new tab.
8.  **Delete an item:**
    - Click the delete button (×) next to an item.
    - Verify the item is removed from the list and a success message appears.
9.  **Test Error Scenarios:**
    - Stop the backend server and try saving or viewing items (expect error messages).
    - Try saving from special browser pages (like `chrome://extensions`) where content scripts might not run (expect graceful handling or disabled button).

### Backend Unit Testing

*(Unit tests for API endpoints are planned but not yet implemented in this version. Future development could include using frameworks like Jest or Mocha/Chai.)*

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)