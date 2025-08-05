document.addEventListener("DOMContentLoaded", () => {
  const usernameDisplay = document.getElementById("username-display");
  const logoutButton = document.getElementById("logout-button");
  const token = localStorage.getItem("loggedInUserToken");
  const tokenExpiry = localStorage.getItem("tokenExpiry");


  if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("loggedInUserRole");
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  }

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

    const addEmployeeLink = document.getElementById("addEmployeeLink");

    if (role === "admin") {
      if (addEmployeeLink) {
        addEmployeeLink.style.display = "block";
        updateAndRemoveEmployeeLink.style.display = "block";
      }
    } else if (role === "manager") {
      if (addEmployeeLink) {
        addEmployeeLink.style.display = "none";
        updateAndRemoveEmployeeLink.style.display = "none";
      }
    } else {
      addEmployeeLink.style.display = "none";
      updateAndRemoveEmployeeLink.style.display = "none";
      addactivityLink.style.display = "none";

      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("loggedInUserToken");
        window.location.href = "login.html";
      });
    }
  }
});
