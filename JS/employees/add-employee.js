document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addEmployeeForm");

  function showToast(message, type = "success") {
    const toastContainer = document.querySelector(".toast-container");

    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const nationalId = document.getElementById("nationalId").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    const role = document.getElementById("role").value;

    if (nationalId.length !== 14 || !/^\d+$/.test(nationalId)) {
      showToast("يجب أن يكون الرقم القومي 14 رقمًا.", "danger");
      return;
    }

    if (password !== confirmPassword) {
      showToast("كلمتا المرور غير متطابقتين.", "danger");
      return;
    }

    const payload = {
      name,
      nationalId,
      email,
      password,
      role,
    };

    const token = localStorage.getItem("loggedInUserToken");
    console.log("Token:", token);
    if (!token) {
      showToast("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.", "danger");
      window.location.href = "login.html";
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("تمت إضافة الموظف بنجاح!", "success");
        form.reset();
      } else {
        const error = await res.json();
        showToast(
          `حدث خطأ: ${error.message || "يرجى المحاولة لاحقًا."}`,
          "danger"
        );
      }
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  });
});
