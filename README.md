# Postly

Postly is a modern social media feed application that fetches and displays posts, user information, and comments from a JSON API. The application allows users to view posts, toggle comments visibility, and search through posts by title, content, or author name.

![Postly Screenshot](Postly.png)

## Features

- **Post Display**: Renders posts with titles, content, and author information
- **Comments System**: Toggle visibility of comments on each post
- **Search Functionality**: Filter posts by title, content, or author name
- **Responsive Design**: Works on various screen sizes
- **Modern UI**: Clean and intuitive user interface with animations

## Technologies Used

- HTML5
- CSS3 (Custom properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)
- Bootstrap 5 (for basic styling)
- Font Awesome (for icons)

## Project Structure

```
├── index.html          # Main HTML document
├── Scripts/
│   └── index.js        # JavaScript code
├── Stylees/
│   └── style.css       # CSS styles
└── README.md           # This file
```

## Code Explanation

### Data Fetching and Promise Chaining

The application fetches data from three JSONPlaceholder API endpoints using a Promise-based approach for asynchronous operations:

1. **Users API**: Information about post authors (names, emails, etc.)
2. **Comments API**: Comments associated with each post
3. **Posts API**: The main content posts with titles and bodies

#### Promise-Based API Calls

Each data type is fetched using a custom Promise wrapper around XMLHttpRequest:

```javascript
function getUsers() {
  return new Promise(function (callback) {
    var reqUsers = new XMLHttpRequest();
    reqUsers.open("GET", "https://jsonplaceholder.typicode.com/users", true);
    reqUsers.send();
    reqUsers.addEventListener("loadend", function () {
      if (reqUsers.readyState == 4) {
        users = JSON.parse(reqUsers.response);
        console.log("Users", users);
        callback();
      }
    });
  });
}
```

This pattern is repeated for `getComments()` and `getPosts()` functions with their respective endpoints. The XMLHttpRequest pattern:

1. Creates a new XMLHttpRequest object
2. Opens a connection to the API endpoint with the GET method
3. Sends the request
4. Sets up an event listener for the 'loadend' event
5. When the request completes successfully (readyState = 4), parses the JSON response and resolves the Promise

#### Sequential Data Loading

The application uses Promise chaining to ensure data is loaded in the correct sequence:

```javascript
getUsers().then(getComments).then(getPosts).then(renderPosts);
```

This ensures that:

1. User data is loaded first
2. Then comment data is loaded
3. Then post data is loaded
4. Finally, posts are rendered to the DOM

This sequential loading is important because posts need user data to display author information, and comment data to display associated comments.

### Post Creation and DOM Manipulation

#### Creating Post Elements

The `createPostElement()` function is responsible for generating the HTML structure for each post:

```javascript
function createPostElement(post) {
  var postElement = document.createElement("div");
  postElement.classList.add("post");

  var postComments = getCommentByPostId(post.id);
  var postUser = getUserById(post.userId); // Get the user of the post

  // Generate HTML for comments
  let commentsHTML = "";
  postComments.forEach((comment) => {
    commentsHTML += `
      <div class="comment">
        <div class="comment-header">
          <i class="fas fa-user-circle comment-avatar"></i>
          <span class="comment-author">${comment.name}</span>
        </div>
        <p class="comment-body">${comment.body}</p>
      </div>
    `;
  });

  // Set the inner HTML of the post element using template literals
  postElement.innerHTML = `
    <div class="post-header">
        <i class="fas fa-user-circle post-avatar"></i>
        <span class="post-author">${
          postUser ? postUser.name : "Unknown User"
        }</span>
    </div>
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <div class="comments-section">
      <button class="comments-toggle">
        <i class="fas fa-comments"></i> Show Comments (${postComments.length})
      </button>
      <div class="comments-container">
        ${commentsHTML}
      </div>
    </div>
  `;

  // Add interactive toggle functionality for comments
  setTimeout(() => {
    const toggleBtn = postElement.querySelector(".comments-toggle");
    const commentsContainer = postElement.querySelector(".comments-container");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent the post click event
        commentsContainer.classList.toggle("comments-visible");
        // Update button text based on visibility state
        this.innerHTML = commentsContainer.classList.contains(
          "comments-visible"
        )
          ? `<i class="fas fa-comments"></i> Hide Comments (${postComments.length})`
          : `<i class="fas fa-comments"></i> Show Comments (${postComments.length})`;
      });
    }
  }, 0);

  return postElement;
}
```

Key aspects of this function:

1. Creates a div element with a 'post' class
2. Retrieves related comments and user information
3. Generates HTML for all comments
4. Builds the post HTML structure using template literals
5. Sets up an event listener for the comments toggle button (using setTimeout to ensure the DOM is ready)
6. Returns the completed post element

#### Rendering Posts to DOM

The `renderPosts()` function handles adding posts to the container:

```javascript
function renderPosts(shownPosts = posts) {
  console.log("Rendering posts");
  shownPosts.forEach((post) => {
    var postElement = createPostElement(post);
    PostsContainer.appendChild(postElement);
  });
}
```

This function:

1. Takes an optional `shownPosts` parameter (defaults to all posts)
2. Iterates through each post
3. Creates a DOM element for each post using `createPostElement()`
4. Appends each post element to the posts container

### Real-Time Search Functionality

The application implements dynamic filtering as users type in the search input:

```javascript
searchInput.addEventListener("input", function (event) {
  const searchTerm = event.target.value.toLowerCase();

  var FilterPosts = posts.filter((currentPost) => {
    const titleMatch = currentPost.title.toLowerCase().includes(searchTerm);
    const bodyMatch = currentPost.body.toLowerCase().includes(searchTerm);

    const user = getUserById(currentPost.userId);
    const authorNameMatch = user
      ? user.name.toLowerCase().includes(searchTerm)
      : false;

    return titleMatch || bodyMatch || authorNameMatch;
  });

  PostsContainer.innerHTML = ""; // Clear previously rendered posts
  console.log("Filtered posts", FilterPosts);
  renderPosts(FilterPosts); // Render the filtered posts
});
```

This event listener:

1. Triggers on every keystroke in the search input
2. Converts the search term to lowercase for case-insensitive matching
3. Uses Array.filter() to create a new array of posts that match the search criteria
4. Checks if the search term appears in the post title, body, or author name
5. Clears the existing posts from the DOM
6. Renders only the filtered posts

The search is implemented to be:

- Real-time (updates as you type)
- Multi-field (searches across titles, content, and authors)
- Case-insensitive (converts everything to lowercase)

### Helper Functions for Data Relationships

Two important helper functions manage relationships between the data types:

```javascript
function getUserById(id) {
  return users.find((user) => user.id === id);
}

function getCommentByPostId(id) {
  return comments.filter((comment) => comment.postId === id);
}
```

- `getUserById`: Uses Array.find() to locate a single user object that matches the given ID
- `getCommentByPostId`: Uses Array.filter() to return an array of all comments that belong to a specific post

These functions establish the relational connections between:

- Posts and their authors (one-to-one relationship via userId)
- Posts and their comments (one-to-many relationship via postId)

## How to Run

1. Clone this repository
2. Open `index.html` in a modern web browser
3. Alternatively, you can use a local development server


---


