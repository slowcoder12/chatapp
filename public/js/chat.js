document.addEventListener("DOMContentLoaded", async function () {
  try {
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
      const box = document.getElementById("container");
      box.appendChild(entry);
    }

    // Send message
    document
      .getElementById("send-button")
      .addEventListener("click", async function (e) {
        e.preventDefault();
        const messageInput = document.getElementById("message-input");
        const message = messageInput.value;
        const msg = { message };

        console.log(msg);

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

        const messagesResponse = await axios.get(
          "http://localhost:3000/getMessages",
          {
            headers: { Authorization: token },
          }
        );

        let messages = messagesResponse.data.result;
        console.log(messages);

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
      } catch (err) {
        console.log("Error occurred", err);
      }
    }

    // Fetch and display messages initially
    fetchAndDisplayMessages();

    setInterval(fetchAndDisplayMessages, 1000);
  } catch (err) {
    console.log("Error occurred", err);
  }
});
