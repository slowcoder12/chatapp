document.addEventListener("DOMContentLoaded", async function () {
  try {
    const socket = io("http://localhost:3000");
    const token = localStorage.getItem("token");

    // Fetch users
    const usersResponse = await axios.get("http://localhost:3000/getusers", {
      headers: { Authorization: token },
    });

    for (let i = 0; i < usersResponse.data.length; i++) {
      const entry = document.createElement("p");
      if (i % 2 == 0) {
        entry.style.backgroundColor = "lightgrey";
      }

      entry.innerText = `${usersResponse.data[i].name} joined`;
      const box = document.getElementById("user-container");
      box.appendChild(entry);
    }

    //Send message
    document
      .getElementById("send-button")
      .addEventListener("click", async function (e) {
        e.preventDefault();
        const messageInput = document.getElementById("message-input");
        const message = messageInput.value;
        const msg = { message };

        socket.emit("sendMessage", { message });

        console.log("message from chat.js", msg);

        const token = localStorage.getItem("token");

        try {
          const response = await axios.post(
            "http://localhost:3000/sendmessage",
            msg,
            {
              headers: { Authorization: token },
            }
          );

          console.log(response);

          // Reset the input field after a successful send
          messageInput.value = "";
        } catch (err) {
          console.log("Error occurred in sending message", err);
        }
      });

    // Fetch messages
    async function fetchAndDisplayMessages() {
      try {
        const token = localStorage.getItem("token");
        const lastMessageId = localStorage.getItem("lastMessageId") || -1;

        const messagesResponse = await axios.get(
          `http://localhost:3000/getMessages?lastMessageId=${lastMessageId}`,
          {
            headers: { Authorization: token },
          }
        );

        const newMessages = messagesResponse.data.result;

        if (newMessages.length > 0) {
          let messages = JSON.parse(localStorage.getItem("messages")) || [];

          messages = [...messages, ...newMessages];

          if (messages.length > 1000) {
            // Trim messages array if it exceeds 1000 messages
            messages = messages.slice(messages.length - 1000);
          }

          localStorage.setItem("messages", JSON.stringify(messages));
          localStorage.setItem(
            "lastMessageId",
            messages[messages.length - 1].id
          );
        }

        displayMessages();
      } catch (err) {
        console.log("Error occurred", err);
      }
    }

    socket.on("newMessage", (data) => {
      console.log("New message received:", data.message);

      fetchAndDisplayMessages();
    });

    function displayMessages() {
      const messages = JSON.parse(localStorage.getItem("messages")) || [];
      const container = document.getElementById("message-container");
      container.innerHTML = ""; // Clear existing messages

      for (let i = 0; i < messages.length; i++) {
        const entry = document.createElement("p");
        if (i % 2 === 0) {
          entry.style.backgroundColor = "lightgrey";
        }

        entry.innerText = `${messages[i].message_content}`;
        container.appendChild(entry);
      }
    }

    // Initial fetch and display
    //fetchAndDisplayMessages();
    // setInterval(fetchAndDisplayMessages, 1000);
  } catch (err) {
    console.log("Error occurred", err);
  }
});
