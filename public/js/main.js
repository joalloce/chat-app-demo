const socket = io();

const username = getUsername();
console.log(username);

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

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

function getUsername() {
  const queryString = location.search;
  const params = new URLSearchParams(queryString);
  const username = params.get("username");
  return username;
}
