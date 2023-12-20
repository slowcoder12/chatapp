window.addEventListener("load", async function (e) {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:3000/getusers",

      {
        headers: { Authorization: token },
      }
    );
    //console.log(response.data);

    for (let i = 0; i < response.data.length; i++) {
      const entry = document.createElement("p");
      if (i % 2 == 0) {
        entry.style.backgroundColor = "lightgrey";
      }

      entry.innerText = `${response.data[i].name} joined`;
      const box = document.getElementById("container");
      box.appendChild(entry);
    }
  } catch (err) {
    console.log("error occured", err);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("send-button")
    .addEventListener("click", async function (e) {
      e.preventDefault();
      const message = document.getElementById("message-input").value;
      const msg = { message };

      console.log(msg);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/sendmessage",
        msg,

        {
          headers: { Authorization: token },
        }
      );

      console.log(response);
    });
});
