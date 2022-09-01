const socket = io();

const username = getUsername();

if (username) {
  // emit a new user event.
  socket.emit("new user", username);
} else {
  // redirect back to "/"
  window.location = "/";
}

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

const userList = document.getElementById("userList");

let users = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", (message) => {
  const item = document.createElement("li");
  item.textContent = message;
  messages.appendChild(item);
});

socket.on("users online", (users) => {
  users = users;
  fillUserList(userList, users);
});

function getUsername() {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const username = params.get("username");
  return username;
}

function fillUserList(element, users) {
  element.innerHTML = "";

  users.forEach((u) => {
    let item = document.createElement("li");
    item.textContent = u.user;
    element.appendChild(item);
  });
}
