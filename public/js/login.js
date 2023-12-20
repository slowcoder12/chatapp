const loginForm = document.querySelector("#form");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginUser = { email, password };
  try {
    const response = await axios.post(`/login`, loginUser);
    if (response.status === 200) {
      // console.log(response);

      alert("user logged in successfully");
      //console.log(response.data.token);
      localStorage.setItem("token", response.data.token);
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        alert(err.response.data.message);
      } else if (err.response.status === 404) {
        alert(err.response.data.message);
      }
    }
  }
});
