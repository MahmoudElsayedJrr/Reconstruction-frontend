document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("loggedInUserToken");
  const toastContainer = document.querySelector(".toast-container");

  const searchBtn = document.getElementById("searchEmployeeBtn");
  const searchInput = document.getElementById("searchNationalId");
  const form = document.getElementById("editEmployeeForm");

  const deleteInput = document.getElementById("searchNationalIdDelete");
  const deleteBtn = document.getElementById("searchEmployeeDeleteBtn");
  const deleteForm = document.getElementById("deleteEmployeeForm");
  const deleteCard = document.getElementById("deleteEmployeeCard");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  const idinput = document.getElementById("nationalId");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const roleInput = document.getElementById("role");

  let currentEmployeeId = null;

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

  // عند الضغط على زر البحث
  searchBtn.addEventListener("click", async () => {
    const nationalId = searchInput.value.trim();

    if (nationalId.length !== 14 || !/^\d+$/.test(nationalId)) {
      showToast("الرقم القومي غير صحيح", "danger");
      return;
    }

    try {
      console.log("Fetching employee with National ID:", nationalId);
      const res = await fetch(`${API_URL}employee/${nationalId}`, {
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
      console.log("Received data:", data);
      const employee = data.data;

      currentEmployeeId = employee.nationalId;

      idinput.value = employee.nationalId;
      nameInput.value = employee.name;
      emailInput.value = employee.email;
      roleInput.value = employee.role;

      document.getElementById("editEmployeeCard").classList.remove("d-none");
      form.classList.remove("d-none");
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  });

  // عند تعديل البيانات والضغط على حفظ
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      role: roleInput.value,
    };

    try {
      const res = await fetch(
        `${API_URL}employee/UpdateEmployee/${currentEmployeeId}`,
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

  deleteInput.addEventListener("change", async () => {
    const nationalId = deleteInput.value.trim();
    if (!nationalId) return;

    try {
      const res = await fetch(`${API_URL}employee/${nationalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.status === "success") {
        const employee = data.data;

        currentEmployeeId = employee.nationalId;

        deleteForm.classList.remove("d-none");
        deleteForm.name.value = employee.name;
        deleteForm.email.value = employee.email || "";
        deleteForm.role.value = employee.role;
        deleteForm.nationalId.value = employee.nationalId;
        deleteCard.classList.remove("d-none");
        deleteForm.classList.remove("d-none");
      } else {
        showToast("لم يتم العثور على موظف بهذا الرقم القومي", "danger");
        deleteForm.classList.add("d-none");
      }
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  });

  // ========== تأكيد الحذف ========== //
  confirmDeleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!currentEmployeeId) {
      showToast("لم يتم تحديد موظف للحذف", "danger");
      return;
    }

    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;

    try {
      const res = await fetch(
        `${API_URL}employee/deleteEmployee/${currentEmployeeId}`,
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
        currentEmployeeId = null;
      } else {
        const errorData = await res.json();
        showToast(errorData.message || "فشل الحذف", "danger");
      }
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر", "danger");
    }
  });
});
