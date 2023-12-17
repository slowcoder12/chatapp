const form = document.querySelector("#form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const user = { name, email, phone, password };
  // console.log(user);
  try {
    const response = await axios.post("http://localhost:3000/signup", user);
    if (response.status === 200) {
      alert(response.data.message);
    }
  } catch (err) {
    //console.log(err);
    if (err.response && err.response.status === 400) {
      alert(err.response.data.message);
    }
  }
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("password").value = "";
});
