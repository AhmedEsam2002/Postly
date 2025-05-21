var posts;
var users;
var comments;
var PostsContainer = document.querySelector(".posts");
var postElements = document.querySelectorAll(".post");
var searchInput = document.querySelector(".search-input");

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

function getUserById(id) {
  return users.find((user) => user.id === id);
}
function getComments() {
  return new Promise(function (callback) {
    var reqComments = new XMLHttpRequest();
    reqComments.open(
      "GET",
      "https://jsonplaceholder.typicode.com/comments",
      true
    );
    reqComments.send();
    reqComments.addEventListener("loadend", function () {
      if (reqComments.readyState == 4) {
        comments = JSON.parse(reqComments.response);
        console.log("Comments", comments);
        callback();
      }
    });
  });
}

function getCommentByPostId(id) {
  return comments.filter((comment) => comment.postId === id);
}
function getPosts() {
  return new Promise(function (callback) {
    var reqPosts = new XMLHttpRequest();
    reqPosts.open("GET", "https://jsonplaceholder.typicode.com/posts", true);
    reqPosts.send();
    reqPosts.addEventListener("loadend", function () {
      if (reqPosts.readyState == 4) {
        posts = JSON.parse(reqPosts.response);
        console.log("Posts", posts);
        callback();
      }
    });
  });
}
function createPostElement(post) {
  var postElement = document.createElement("div");
  postElement.classList.add("post");

  var postComments = getCommentByPostId(post.id);
  var postUser = getUserById(post.userId); // Get the user of the post
  // Create comments HTML
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

  // Add event listener to the comments toggle button
  setTimeout(() => {
    const toggleBtn = postElement.querySelector(".comments-toggle");
    const commentsContainer = postElement.querySelector(".comments-container");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent the post click event
        commentsContainer.classList.toggle("comments-visible");
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
function renderPosts(shownPosts = posts) {
  console.log("Rendering posts");
  shownPosts.forEach((post) => {
    var postElement = createPostElement(post);
    PostsContainer.appendChild(postElement);
  });
}

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

  PostsContainer.innerHTML = ""; // Clear previously rendered posts.
  console.log("Filtered posts", FilterPosts);
  renderPosts(FilterPosts); // Render the new list of filtered posts.
});

getUsers().then(getComments).then(getPosts).then(renderPosts);
