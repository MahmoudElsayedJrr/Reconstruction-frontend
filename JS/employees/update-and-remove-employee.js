document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("loggedInUserToken");
  const toastContainer = document.querySelector(".toast-container");

  // Edit section elements
  const searchInput = document.getElementById("searchname");
  const searchBtn = document.getElementById("searchEmployeeBtn");
  const editCard = document.getElementById("editEmployeeCard");
  const editForm = document.getElementById("editEmployeeForm");
  const editName = document.getElementById("editName");
  const editEmail = document.getElementById("editEmail");
  const editRole = document.getElementById("editRole");
  const editRegion = document.getElementById("editRegion");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  // Delete section elements
  const searchDeleteInput = document.getElementById("searchDeleteName");
  const searchDeleteBtn = document.getElementById("searchDeleteEmployeeBtn");
  const deleteCard = document.getElementById("deleteEmployeeCard");
  const deleteNameDisplay = document.getElementById("deleteEmployeeNameDisplay");
  const confirmDeleteBtn = document.getElementById("confirmDeleteEmployeeBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

  // Unlock section elements
  const unlockInput = document.getElementById("unlockName");
  const unlockBtn = document.getElementById("unlockAccountBtn");

  let currentEditEmployeeName = null;
  let currentDeleteEmployeeName = null;

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
      const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
      toast.show();
    }
  }

  // --- 1. Edit Employee ---
  async function searchEmployeeForEdit() {
    const name = searchInput ? searchInput.value.trim() : "";
    if (!name) {
      showToast("الرجاء إدخال اسم الموظف لتعديله", "danger");
      return;
    }

    try {
      const res = await fetch(`${API_URL}employee/${encodeURIComponent(name)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || "الموظف غير موجود أو حدث خطأ", "danger");
        if (editCard) editCard.classList.add("d-none");
        if (editForm) editForm.classList.add("d-none");
        return;
      }

      const data = await res.json();
      const employee = data.data || data.employee || data;

      if (!employee || !employee.name) {
        showToast("لم يتم العثور على موظف بهذا الاسم", "danger");
        if (editCard) editCard.classList.add("d-none");
        if (editForm) editForm.classList.add("d-none");
        return;
      }

      currentEditEmployeeName = employee.name;

      if (editName) editName.value = employee.name || "";
      if (editEmail) editEmail.value = employee.email || "";
      if (editRole) editRole.value = employee.role || "employee";
      if (editRegion) editRegion.value = employee.region || "الكل";

      if (editCard) editCard.classList.remove("d-none");
      if (editForm) editForm.classList.remove("d-none");
    } catch (err) {
      console.error("Search edit error:", err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", searchEmployeeForEdit);
  }
  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") searchEmployeeForEdit();
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!currentEditEmployeeName) {
        showToast("لم يتم تحديد موظف للتعديل", "danger");
        return;
      }

      const updatedData = {
        name: editName ? editName.value.trim() : "",
        email: editEmail ? editEmail.value.trim() : "",
        role: editRole ? editRole.value : "",
        region: editRegion ? editRegion.value.trim() : "",
      };

      try {
        const res = await fetch(
          `${API_URL}employee/UpdateEmployee/${encodeURIComponent(currentEditEmployeeName)}`,
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
          showToast("تم تحديث بيانات الموظف بنجاح", "success");
          editForm.reset();
          if (editCard) editCard.classList.add("d-none");
          if (editForm) editForm.classList.add("d-none");
          if (searchInput) searchInput.value = "";
          currentEditEmployeeName = null;
        } else {
          const errorData = await res.json().catch(() => ({}));
          showToast(errorData.message || "فشل التحديث", "danger");
        }
      } catch (err) {
        console.error("Update employee error:", err);
        showToast("فشل الاتصال بالسيرفر", "danger");
      }
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      if (editForm) editForm.reset();
      if (editCard) editCard.classList.add("d-none");
      if (editForm) editForm.classList.add("d-none");
      currentEditEmployeeName = null;
    });
  }

  // --- 2. Delete Employee ---
  async function searchEmployeeForDelete() {
    const name = searchDeleteInput ? searchDeleteInput.value.trim() : "";
    if (!name) {
      showToast("الرجاء إدخال اسم الموظف لحذفه", "danger");
      return;
    }

    try {
      const res = await fetch(`${API_URL}employee/${encodeURIComponent(name)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.message || "لم يتم العثور على موظف بهذا الاسم", "danger");
        if (deleteCard) deleteCard.classList.add("d-none");
        return;
      }

      const data = await res.json();
      const employee = data.data || data.employee || data;

      if (employee && employee.name) {
        currentDeleteEmployeeName = employee.name;
        if (deleteNameDisplay) {
          deleteNameDisplay.textContent = `${employee.name} (${employee.email || "بدون بريد"})`;
        }
        if (deleteCard) deleteCard.classList.remove("d-none");
      } else {
        showToast("لم يتم العثور على موظف بهذا الاسم", "danger");
        if (deleteCard) deleteCard.classList.add("d-none");
      }
    } catch (err) {
      console.error("Search delete error:", err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  }

  if (searchDeleteBtn) {
    searchDeleteBtn.addEventListener("click", searchEmployeeForDelete);
  }
  if (searchDeleteInput) {
    searchDeleteInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") searchEmployeeForDelete();
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!currentDeleteEmployeeName) {
        showToast("لم يتم تحديد موظف للحذف", "danger");
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}employee/deleteEmployee/${encodeURIComponent(currentDeleteEmployeeName)}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          showToast("تم حذف الموظف بنجاح", "success");
          if (deleteCard) deleteCard.classList.add("d-none");
          if (searchDeleteInput) searchDeleteInput.value = "";
          currentDeleteEmployeeName = null;
        } else {
          const errorData = await res.json().catch(() => ({}));
          showToast(errorData.message || "فشل الحذف", "danger");
        }
      } catch (err) {
        console.error("Delete employee error:", err);
        showToast("فشل الاتصال بالسيرفر", "danger");
      }
    });
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", () => {
      if (deleteCard) deleteCard.classList.add("d-none");
      currentDeleteEmployeeName = null;
    });
  }

  // --- 3. Unlock Account ---
  async function unlockAccount() {
    const name = unlockInput ? unlockInput.value.trim() : "";

    if (!name) {
      showToast("الرجاء إدخال اسم الموظف لفك قفل الحساب", "danger");
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

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showToast(`تم فك قفل حساب الموظف "${name}" بنجاح.`, "success");
        if (unlockInput) unlockInput.value = "";
      } else {
        showToast(
          data.message || "فشل فك قفل الحساب. الرجاء التحقق من الاسم.",
          "danger"
        );
      }
    } catch (err) {
      console.error("Unlock account error:", err);
      showToast("فشل الاتصال بالسيرفر. تأكد من اتصال الشبكة.", "danger");
    }
  }

  if (unlockBtn) {
    unlockBtn.addEventListener("click", unlockAccount);
  }
  if (unlockInput) {
    unlockInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") unlockAccount();
    });
  }
});
