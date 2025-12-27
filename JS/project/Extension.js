function showToast(message, type = "success") {
  const toastContainer = document.querySelector(".toast-container");
  const toastId = "toast-" + Math.random().toString(36).substr(2, 9);
  const toastColor = type === "success" ? "bg-success" : "bg-danger";
  const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${toastColor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>`;
  toastContainer.insertAdjacentHTML("beforeend", toastHTML);
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();
}

function openEditExtensionModal(index, fromDate, extensionDate, activityCode) {
  currentActivityCode = activityCode;
  document.getElementById("editExtensionIndex").value = index;
  document.getElementById("editFromDate").value = fromDate;
  document.getElementById("editExtensionDate").value = extensionDate;

  const editModal = new bootstrap.Modal(
    document.getElementById("editExtensionModal")
  );
  editModal.show();
}

async function saveExtensionEdit() {
  const index = document.getElementById("editExtensionIndex").value;
  const newExtensionDate = document.getElementById("editExtensionDate").value;
  const token = localStorage.getItem("loggedInUserToken");
  if (!newExtensionDate) {
    showToast("❌ يرجى اختيار تاريخ", "danger");
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}activity/extension/${currentActivityCode}/${index}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ extensionDate: newExtensionDate }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      showToast("تم تعديل مد المدة بنجاح", "success");

      bootstrap.Modal.getInstance(
        document.getElementById("editExtensionModal")
      ).hide();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showToast(result.message || "حدث خطأ أثناء التعديل", "danger");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast("حدث خطأ في الاتصال بالسيرفر", "danger");
  }
}

function openDeleteExtensionModal(index, extensionNumber, activityCode) {
  document.getElementById("deleteExtensionIndex").value = index;
  document.getElementById("deleteExtensionNumber").textContent =
    extensionNumber;
  document.getElementById("deleteActivityCode").value = activityCode;

  const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteExtensionModal")
  );
  deleteModal.show();
}

async function confirmDeleteExtension() {
  const index = document.getElementById("deleteExtensionIndex").value;
  const activityCode = document.getElementById("deleteActivityCode").value;
  const token = localStorage.getItem("loggedInUserToken");

  try {
    const response = await fetch(
      `${API_URL}activity/extension/${activityCode}/${index}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    console.log(result);
    if (response.ok) {
      showToast("تم حذف مد المدة بنجاح", "success");

      bootstrap.Modal.getInstance(
        document.getElementById("deleteExtensionModal")
      ).hide();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showToast(result.message || "حدث خطأ أثناء الحذف", "danger");
    }
  } catch (error) {
    console.error("Error:", error);
    showToast(error.message || "حدث خطأ في الاتصال بالسيرفر", "danger");
  }
}
