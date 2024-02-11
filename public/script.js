document.addEventListener("DOMContentLoaded", function () {
  const chatLog = document.getElementById("chat-log"),
    userInput = document.getElementById("user-input"),
    sendButton = document.getElementById("send-button"),
    buttonIcon = document.getElementById("button-icon");

  sendButton.addEventListener("click", () => sendMessage());
  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  function typeText(element, text, callback = () => {}) {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
        callback(); // Ensure the callback is called after typing is finished
      }
    }, 10); // Adjust typing speed as needed
  }

  function appendMessage(sender, message) {
    const messageBox = document.createElement("div");
    const icon = document.createElement("i");
    const textNode = document.createElement("span");

    icon.className =
      sender === "user" ? "fa fa-user user-icon" : "fa fa-robot bot-icon";
    messageBox.appendChild(icon);
    messageBox.appendChild(textNode);
    messageBox.className = `message ${sender}`;
    chatLog.appendChild(messageBox);

    if (sender === "bot") {
      // Start typing effect for bot response
      typeText(textNode, message, () => {
        chatLog.scrollTop = chatLog.scrollHeight;
        buttonIcon.classList.remove("fa-spinner", "fa-pulse"); // Stop loading animation
        buttonIcon.classList.add("fa-paper-plane"); // Revert to default icon
      });
    } else {
      // Immediate display for user messages
      textNode.textContent = message;
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }

  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    appendMessage("user", message);
    userInput.value = "";
    buttonIcon.classList.remove("fa-paper-plane"); // Remove default icon
    buttonIcon.classList.add("fa-spinner", "fa-pulse"); // Start loading animation

    fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
      .then((response) => response.json())
      .then((data) => {
        appendMessage(
          "bot",
          data.choices[0].message.content ||
            "Sorry, I couldn't understand that."
        ); // Note: The loading icon is removed after the bot's typing effect completes
      })
      .catch(() => {
        buttonIcon.classList.remove("fa-spinner", "fa-pulse"); // Stop loading animation on error
        buttonIcon.classList.add("fa-paper-plane"); // Revert to default icon on error
        appendMessage("bot", "Oops... Please try again.");
      });
  }

  // Initial greeting from the bot
  appendMessage("bot", "Hello! I am AkileshGPT. How can I assist you today?");
});
