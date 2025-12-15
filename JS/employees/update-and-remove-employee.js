document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("loggedInUserToken");
  const toastContainer = document.querySelector(".toast-container");

  const searchBtn = document.getElementById("searchEmployeeBtn");
  const searchInput = document.getElementById("searchname");
  const form = document.getElementById("editEmployeeForm");

  const deleteInput = document.getElementById("searchnameDelete");
  const deleteBtn = document.getElementById("searchDeleteBtn");
  const deleteForm = document.getElementById("deleteEmployeeForm");
  const deleteCard = document.getElementById("deleteEmployeeCard");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const activateAccountBtn = document.getElementById("activateAccountBtn");

  const nameEdit = document.getElementById("nameEdit");
  const emailEdit = document.getElementById("emailEdit");
  const roleEdit = document.getElementById("roleEdit");
  const regionEdit = document.getElementById("regionEdit");

  let currentEmployeeName = null;

  function showToast(message, type = "success") {
    const toastId = "toast-" + Math.random().toString(36).substr(2, 9);
    const toastColor = type === "success" ? "bg-success" : "bg-danger";
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white ${toastColor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;
    if (toastContainer) {
      toastContainer.insertAdjacentHTML("beforeend", toastHTML);
      const toastElement = document.getElementById(toastId);
      const toast = new bootstrap.Toast(toastElement, { delay: 1500 });
      toast.show();
    }
  }

  searchBtn.addEventListener("click", async () => {
    const name = searchInput.value.trim();

    try {
      const res = await fetch(`${API_URL}employee/${name}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        showToast("الموظف غير موجود أو حدث خطأ", "danger");
        return;
      }

      const data = await res.json();
      const employee = data.data;

      currentEmployeeName = employee.name;

      nameEdit.value = employee.name;
      emailEdit.value = employee.email || "";
      roleEdit.value = employee.role;
      regionEdit.value = employee.region;

      document.getElementById("editEmployeeCard").classList.remove("d-none");
      form.classList.remove("d-none");
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: nameEdit.value.trim(),
      email: emailEdit.value.trim(),
      role: roleEdit.value,
      region: regionEdit.value.trim(),
    };

    try {
      const res = await fetch(
        `${API_URL}employee/UpdateEmployee/${currentEmployeeName}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (res.ok) {
        showToast("تم تحديث الموظف بنجاح");
        form.reset();
        document.getElementById("editEmployeeCard").classList.add("d-none");
        form.classList.add("d-none");
      } else {
        const error = await res.json();
        showToast(error.message || "فشل التحديث", "danger");
      }
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  });

  deleteBtn.addEventListener("click", async () => {
    const name = deleteInput.value.trim();
    if (!name) return;

    try {
      const res = await fetch(`${API_URL}employee/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        const employee = data.data;

        currentEmployeeName = employee.name;

        deleteForm.classList.remove("d-none");
        nameDelete.value = employee.name;
        emailDelete.value = employee.email || "";
        roleDelete.value = employee.role;
        regionDelete.value = employee.region;
        deleteCard.classList.remove("d-none");
        deleteForm.classList.remove("d-none");
      } else {
        showToast("لم يتم العثور على موظف بهذا الاسم", "danger");
        deleteForm.classList.add("d-none");
      }
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  });

  confirmDeleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!currentEmployeeName) {
      showToast("لم يتم تحديد موظف للحذف", "danger");
      return;
    }

    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;

    try {
      const res = await fetch(
        `${API_URL}employee/deleteEmployee/${currentEmployeeName}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        showToast("تم حذف الموظف بنجاح");
        deleteForm.reset();
        deleteCard.classList.add("d-none");
        deleteForm.classList.add("d-none");
        deleteInput.value = "";
        currentEmployeeName = null;
      } else {
        const errorData = await res.json();
        showToast(errorData.message || "فشل الحذف", "danger");
      }
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  });

  activateAccountBtn.addEventListener("click", async () => {
    const nameInput = document.getElementById("searchnameActivate");
    const name = nameInput.value.trim();

    if (!name) {
      showToast("الرجاء إدخال اسم الموظف المراد تفعيله", "danger");
      return;
    }

    try {
      const res = await fetch(`${API_URL}auth/unlock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(`تم تفعيل حساب الموظف ${name} بنجاح.`);
        nameInput.value = "";
      } else {
        showToast(
          data.message || "فشل التفعيل. الرجاء التحقق من الاسم.",
          "danger"
        );
      }
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر. تأكد من اتصال الشبكة.", "danger");
    }
  });
});
