document.addEventListener("DOMContentLoaded", () => {
  const usernameDisplay = document.getElementById("username-display");
  const logoutButton = document.getElementById("logout-button");

  if (usernameDisplay && logoutButton) {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("loggedInUserToken");

    if (loggedInUser && token) {
      usernameDisplay.textContent = loggedInUser;
    } else {
      alert("الرجاء تسجيل الدخول أولاً.");
      window.location.href = "login.html";
    }

    if (role === "admin") {
      const addEmployeeLink = document.getElementById("addEmployeeLink");
      if (addEmployeeLink) {
        addEmployeeLink.style.display = "block";
        updateAndRemoveEmployeeLink.style.display = "block";
      }
    } else {
      const addEmployeeLink = document.getElementById("addEmployeeLink");
      if (addEmployeeLink) {
        addEmployeeLink.style.display = "none";
        updateAndRemoveEmployeeLink.style.display = "none";
      }

      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("loggedInUserToken");
        window.location.href = "login.html";
      });
    }
  }
});
