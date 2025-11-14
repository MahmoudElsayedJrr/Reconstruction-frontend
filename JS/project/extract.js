const token = localStorage.getItem("loggedInUserToken");
let currentExtractId = null;
let isEditMode = false;

function showToast(message, type = "success") {
  const toastContainer =
    document.querySelector(".toast-container") || createToastContainer();

  const toastId = "toast-" + Math.random().toString(36).substr(2, 9);
  const bgClass =
    type === "success"
      ? "bg-success"
      : type === "danger"
      ? "bg-danger"
      : type === "warning"
      ? "bg-warning"
      : "bg-info";

  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });

  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });

  toast.show();
}

function createToastContainer() {
  const container = document.createElement("div");
  container.className = "toast-container position-fixed top-0 end-0 p-3";
  container.style.zIndex = "9999";
  document.body.appendChild(container);
  return container;
}

export async function addExtract(BaseUrl, activityCode, showToast) {
  const extractDate = document.getElementById("extractDate").value;
  const extractValue = document.getElementById("extractValue").value;
  const extractFiles = document.getElementById("extractPDFs").files;

  const saveBtn = document.getElementById("saveExtractBtn");
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري الإضافة...`;

  function resetButton() {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalBtnText;
  }

  if (!extractDate || !extractValue) {
    showToast("برجاء ملء جميع الحقول", "warning");
    resetButton();
    return;
  }

  const selectedDate = new Date(extractDate);
  if (isNaN(selectedDate.getTime())) {
    showToast("تاريخ غير صحيح", "warning");
    resetButton();
    return;
  }

  const parsedValue = parseFloat(extractValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    showToast("قيمة المستخلص غير صحيحة", "warning");
    resetButton();
    return;
  }

  const formData = new FormData();
  formData.append("extractDate", selectedDate.toISOString());
  formData.append("extractValue", parsedValue);

  for (let i = 0; i < extractFiles.length; i++) {
    formData.append("files", extractFiles[i]);
  }

  try {
    const response = await fetch(`${BaseUrl}activity/extract/${activityCode}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok && data.status === "success") {
      showToast("تم إضافة المستخلص بنجاح", "success");
      clearAndCloseExtractModal();

      // Reload page after short delay
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      const errorMessage =
        data.message || data.error || "حدث خطأ، برجاء المحاولة مرة أخرى";
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error adding extract:", err);
    showToast("حدث خطأ أثناء إضافة المستخلص.", "danger");
  } finally {
    resetButton();
  }
}

function editExtract(extractId, index) {
  isEditMode = true;
  currentExtractId = extractId;

  const extractData = window.currentExtracts
    ? window.currentExtracts[index]
    : null;

  if (!extractData) {
    showToast("⚠️ حدث خطأ في تحميل بيانات المستخلص", "warning");
    return;
  }

  document.getElementById("addExtractModalLabel").textContent = "تعديل مستخلص";
  document.getElementById("saveExtractBtn").textContent = "حفظ التعديلات";

  document.getElementById("extractId").value = extractId;

  const dateValue = extractData.extractDate
    ? extractData.extractDate.split("T")[0]
    : "";
  document.getElementById("extractDate").value = dateValue;
  document.getElementById("extractValue").value = extractData.extractValue;

  document.getElementById("extractPDFs").value = "";

  showExistingPDFs(extractData.extractPDFs, extractId);

  const modal = new bootstrap.Modal(document.getElementById("addExtractModal"));
  modal.show();
}

function showExistingPDFs(pdfs, extractId) {
  const container = document.getElementById("existingPDFsContainer");

  if (!pdfs || pdfs.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="mb-3">
      <label class="form-label fw-bold">
        <i class="fas fa-paperclip me-2"></i>الملفات الحالية:
      </label>
      <div class="list-group">
        ${pdfs
          .map(
            (pdf) => `
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <i class="fas fa-file-pdf text-danger me-2"></i>
              ${pdf.filename || "ملف PDF"}
            </span>
            <button class="btn btn-sm btn-danger" 
                    onclick="deletePDF('${extractId}', '${pdf._id}')"
                    type="button">
              <i class="fas fa-times"></i> حذف
            </button>
          </div>
        `
          )
          .join("")}
      </div>
      <small class="text-muted d-block mt-2">
        <i class="fas fa-info-circle me-1"></i>
        يمكنك إضافة ملفات جديدة أو حذف الملفات الحالية
      </small>
    </div>
  `;
}

async function updateExtract(BaseUrl, activityCode, showToast) {
  const extractDate = document.getElementById("extractDate").value;
  const extractValue = document.getElementById("extractValue").value;
  const extractFiles = document.getElementById("extractPDFs").files;

  const saveBtn = document.getElementById("saveExtractBtn");
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> جاري التحديث...`;

  function resetButton() {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalBtnText;
  }

  if (!extractValue) {
    showToast("برجاء إدخال قيمة المستخلص", "warning");
    resetButton();
    return;
  }

  const parsedValue = parseFloat(extractValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    showToast("قيمة المستخلص غير صحيحة", "warning");
    resetButton();
    return;
  }

  const formData = new FormData();

  if (extractDate) {
    const selectedDate = new Date(extractDate);
    formData.append("extractDate", selectedDate.toISOString());
  }

  formData.append("extractValue", parsedValue);

  // Append new files if any
  for (let i = 0; i < extractFiles.length; i++) {
    formData.append("files", extractFiles[i]);
  }

  try {
    const response = await fetch(
      `${BaseUrl}activity/extract/${currentExtractId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Update response:", data);

    if (response.ok && data.status === "success") {
      showToast("تم تحديث المستخلص بنجاح", "success");
      clearAndCloseExtractModal();

      // Reload page after short delay
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      const errorMessage =
        data.message || data.error || "حدث خطأ، برجاء المحاولة مرة أخرى";
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error updating extract:", err);
    showToast("حدث خطأ أثناء تحديث المستخلص.", "danger");
  } finally {
    resetButton();
  }
}

// ========================================
// Save Extract (Add or Update Handler)
// ========================================
async function saveExtract(BaseUrl, activityCode, showToast) {
  if (isEditMode) {
    await updateExtract(BaseUrl, activityCode, showToast);
  } else {
    await addExtract(BaseUrl, activityCode, showToast);
  }
}

// ========================================
// Delete Extract Function
// ========================================
function deleteExtract(extractId) {
  currentExtractId = extractId;

  const modalElement = document.getElementById("confirmDeleteModal");

  // Check if modal exists
  if (!modalElement) {
    console.error("❌ Delete modal not found in DOM");
    // Fallback to confirm dialog
    if (
      confirm("⚠️ هل تريد حذف هذا المستخلص؟ لا يمكن التراجع عن هذا الإجراء.")
    ) {
      const activityCode = new URLSearchParams(window.location.search).get(
        "code"
      );
      confirmDeleteExtract(window.API_URL || API_URL, activityCode);
    }
    return;
  }

  // Update modal content
  const modalBody = modalElement.querySelector(".modal-body");
  if (modalBody) {
    modalBody.innerHTML = `
      <p class="mb-0">
        <i class="fas fa-exclamation-triangle text-warning me-2"></i>
        هل أنت متأكد من رغبتك في حذف هذا المستخلص؟
      </p>
      <p class="text-danger mt-3 mb-0">
        <strong>تحذير:</strong> لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع الملفات المرتبطة.
      </p>
    `;
  }

  // Show modal safely
  try {
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
  } catch (error) {
    console.error("Error showing modal:", error);
    // Fallback
    if (confirm("⚠️ هل تريد حذف هذا المستخلص؟")) {
      const activityCode = new URLSearchParams(window.location.search).get(
        "code"
      );
      confirmDeleteExtract(window.API_URL || API_URL, activityCode);
    }
  }
}

// ========================================
// Confirm Delete Extract
// ========================================
async function confirmDeleteExtract(BaseUrl, activityCode, showToast) {
  if (!currentExtractId) {
    showToast("⚠️ حدث خطأ في تحديد المستخلص", "warning");
    return;
  }

  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const originalText = confirmBtn.innerHTML;
  confirmBtn.disabled = true;
  confirmBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2"></span>جاري الحذف...';

  try {
    const response = await fetch(
      `${BaseUrl}activity/extract/${currentExtractId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.status === "success") {
      // Close modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("confirmDeleteModal")
      );
      if (modal) modal.hide();

      showToast("✅ تم حذف المستخلص بنجاح", "success");

      // Reload page after short delay
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      throw new Error(data.message || "خطأ غير معروف");
    }
  } catch (error) {
    console.error("Error deleting extract:", error);
    showToast("❌ حدث خطأ: " + error.message, "danger");

    // Reset button
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = originalText;
  }
}

// ========================================
// Delete Single PDF File
// ========================================
async function deletePDF(extractId, pdfId) {
  if (!confirm("⚠️ هل تريد حذف هذا الملف؟")) return;

  // Get activity code from URL
  const urlParams = new URLSearchParams(window.location.search);
  const activityCode = urlParams.get("code");
  const BaseUrl = window.API_URL || API_URL;

  if (!activityCode) {
    alert("⚠️ كود المشروع غير موجود");
    return;
  }

  try {
    const response = await fetch(
      `${BaseUrl}activity/${activityCode}/extract/${extractId}/pdf/${pdfId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.status === "success") {
      // Use showToast if available, otherwise alert
      if (typeof showToast === "function") {
        showToast("✅ تم حذف الملف بنجاح", "success");
      } else {
        alert("✅ تم حذف الملف بنجاح");
      }

      // Reload page after short delay
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      throw new Error(data.message || "خطأ غير معروف");
    }
  } catch (error) {
    console.error("Error deleting PDF:", error);
    if (typeof showToast === "function") {
      showToast("❌ حدث خطأ: " + error.message, "danger");
    } else {
      alert("❌ حدث خطأ: " + error.message);
    }
  }
}

// ========================================
// Clear and Close Extract Modal
// ========================================
function clearAndCloseExtractModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addExtractModal")
  );
  if (modal) modal.hide();

  resetExtractForm();
}

// ========================================
// Reset Extract Form
// ========================================
function resetExtractForm() {
  isEditMode = false;
  currentExtractId = null;

  document.getElementById("addExtractModalLabel").textContent = "إضافة مستخلص";
  document.getElementById("saveExtractBtn").textContent = "إضافة مستخلص";

  if (document.getElementById("extractId")) {
    document.getElementById("extractId").value = "";
  }
  document.getElementById("extractDate").value = "";
  document.getElementById("extractValue").value = "";
  document.getElementById("extractPDFs").value = "";

  const container = document.getElementById("existingPDFsContainer");
  if (container) container.innerHTML = "";
}

// ========================================
// Initialize Event Listeners
// ========================================
function initializeExtractManagement(BaseUrl, activityCode, showToast) {
  // Save button
  const saveBtn = document.getElementById("saveExtractBtn");
  if (saveBtn) {
    // Remove old listeners
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener("click", () => {
      saveExtract(BaseUrl, activityCode, showToast);
    });
  }

  // Confirm delete button
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  if (confirmDeleteBtn) {
    // Remove old listeners
    const newConfirmBtn = confirmDeleteBtn.cloneNode(true);
    confirmDeleteBtn.parentNode.replaceChild(newConfirmBtn, confirmDeleteBtn);

    newConfirmBtn.addEventListener("click", () => {
      confirmDeleteExtract(BaseUrl, activityCode, showToast);
    });
  }

  // Reset form when modal closes
  const addExtractModal = document.getElementById("addExtractModal");
  if (addExtractModal) {
    addExtractModal.addEventListener("hidden.bs.modal", resetExtractForm);
  }
}

window.editExtract = editExtract;
window.deleteExtract = deleteExtract;
window.deletePDF = deletePDF;
window.initializeExtractManagement = initializeExtractManagement;
