const socket = io();

const username = getUsername();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const title = document.getElementById("title");

const userList = document.getElementById("userList");

if (username) {
  // emit a new user event.
  socket.emit("new user", username);

  title.textContent = `Welcome to the chat - ${username}`;
} else {
  // redirect back to "/"
  window.location = "/";
}

let users = [];

// send a message
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

// new message
socket.on("chat message", (message) => {
  const item = document.createElement("li");
  item.textContent = message;
  messages.appendChild(item);
});

// it updates the user list
socket.on("users online", (users) => {
  users = users;

  fillUserList(userList, users);
});

// notifications
socket.on("notification", (message) => {
  const item = document.createElement("li");
  item.textContent = message;
  messages.appendChild(item);
});

// get username from the query string
function getUsername() {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const username = params.get("username");
  return username;
}

// refresh the user list
function fillUserList(element, users) {
  element.innerHTML = "";

  users.forEach((u) => {
    let item = document.createElement("li");
    item.textContent = u.user;
    element.appendChild(item);
  });
}
