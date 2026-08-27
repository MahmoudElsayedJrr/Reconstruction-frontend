function checkRoleAccess() {
  const role = localStorage.getItem("loggedInUserRole");
  if (!role || !["admin", "super_admin", "projectManager"].includes(role)) {
    window.location.href = "dashboard.html";
  }
}
checkRoleAccess();

function getToken() {
  return localStorage.getItem("loggedInUserToken") || "";
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getToken(),
  };
}

let deleteModal = null;
let deleteItemId = null;
let deleteItemType = null;

function showToast(message, type = "success") {
  const toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    alert(message);
    return;
  }

  const toastId = "toast-" + Math.random().toString(36).substr(2, 9);
  const icons = {
    success: "fa-check-circle",
    danger: "fa-times-circle",
    warning: "fa-exclamation-circle",
    info: "fa-info-circle",
  };

  const bgClass =
    type === "success"
      ? "bg-success"
      : type === "danger"
      ? "bg-danger"
      : type === "warning"
      ? "bg-warning"
      : "bg-info";

  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 show" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas ${icons[type] || 'fa-info-circle'} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);
  const toastElement = document.getElementById(toastId);

  setTimeout(() => {
    if (toastElement) {
      toastElement.classList.remove("show");
      setTimeout(() => toastElement.remove(), 300);
    }
  }, 3000);
}

function createListItem(item, entityType) {
  const listItem = document.createElement("div");
  listItem.className = "list-item";
  listItem.dataset.id = item._id;

  const icon = entityType === "consultant" ? "fa-user-tie" : "fa-building";

  listItem.innerHTML = `
        <div class="item-name">
            <i class="fas ${icon}"></i>
            <span>${item.name}</span>
        </div>
        <div class="item-actions">
            <button class="btn-action btn-edit" title="تعديل" onclick="editItem('${item._id}', '${item.name.replace(/'/g, "\\'")}', '${entityType}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action btn-delete" title="حذف" onclick="confirmDelete('${item._id}', '${item.name.replace(/'/g, "\\'")}', '${entityType}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;

  return listItem;
}

async function fetchEntities(apiPath, entityType) {
  const listElement = document.getElementById(`${entityType}-list`);
  const countElement = document.getElementById(`${entityType}-count`);
  const loadingIndicator = document.getElementById(
    `${entityType}-loading-indicator`
  );
  const emptyState = document.getElementById(`${entityType}-empty`);

  if (!listElement) return;

  listElement.querySelectorAll(".list-item").forEach((item) => item.remove());

  if (loadingIndicator) loadingIndicator.classList.remove("d-none");
  if (emptyState) emptyState.classList.add("d-none");

  try {
    const baseUrl = typeof API_URL !== "undefined" ? API_URL.replace(/\/$/, "") : "http://localhost:3000";
    const url = `${baseUrl}/${apiPath}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    const result = await response.json();

    if (loadingIndicator) loadingIndicator.classList.add("d-none");

    const items = Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.companies)
      ? result.companies
      : Array.isArray(result.consultants)
      ? result.consultants
      : [];

    if (response.ok && (result.status === "success" || Array.isArray(items))) {
      if (countElement) countElement.textContent = items.length;

      if (items.length === 0) {
        if (emptyState) emptyState.classList.remove("d-none");
        return;
      }

      items.forEach((item) => {
        const listItem = createListItem(item, entityType);
        listElement.appendChild(listItem);
      });
    } else {
      if (emptyState) emptyState.classList.remove("d-none");
      showToast(result.message || `فشل جلب قائمة ${entityType}`, "danger");
    }
  } catch (error) {
    if (loadingIndicator) loadingIndicator.classList.add("d-none");
    if (emptyState) emptyState.classList.remove("d-none");
    showToast(`خطأ في الاتصال بالخادم: ${error.message}`, "danger");
  }
}

function editItem(id, name, entityType) {
  const nameInput = document.getElementById(`${entityType}-name`);
  const idField = document.getElementById(`${entityType}-id-field`);
  const submitBtn = document.getElementById(`${entityType}-submit-btn`);
  const cancelBtn = document.getElementById(`${entityType}-cancel-btn`);

  if (!nameInput || !idField || !submitBtn) return;

  nameInput.value = name;
  idField.value = id;

  submitBtn.innerHTML =
    '<i class="fas fa-save"></i><span class="btn-text">تعديل</span>';
  submitBtn.classList.remove("btn-submit-add");
  submitBtn.classList.add("btn-submit-edit");

  if (cancelBtn) cancelBtn.classList.remove("d-none");

  nameInput.focus();
  nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
}

function cancelEdit(entityType) {
  const nameInput = document.getElementById(`${entityType}-name`);
  const idField = document.getElementById(`${entityType}-id-field`);
  const submitBtn = document.getElementById(`${entityType}-submit-btn`);
  const cancelBtn = document.getElementById(`${entityType}-cancel-btn`);

  if (nameInput) nameInput.value = "";
  if (idField) idField.value = "";

  if (submitBtn) {
    submitBtn.innerHTML =
      '<i class="fas fa-plus"></i><span class="btn-text">إضافة</span>';
    submitBtn.classList.remove("btn-submit-edit");
    submitBtn.classList.add("btn-submit-add");
  }

  if (cancelBtn) cancelBtn.classList.add("d-none");
}

function confirmDelete(id, name, entityType) {
  deleteItemId = id;
  deleteItemType = entityType;
  const nameElem = document.getElementById("delete-item-name");
  if (nameElem) nameElem.textContent = name;

  const modalElem = document.getElementById("deleteModal");
  if (modalElem && typeof bootstrap !== "undefined") {
    deleteModal = bootstrap.Modal.getInstance(modalElem) || new bootstrap.Modal(modalElem);
    deleteModal.show();
  }
}

async function handleDelete() {
  if (!deleteItemId || !deleteItemType) return;

  const apiPath = deleteItemType;
  const confirmBtn = document.getElementById("confirm-delete-btn");

  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-1"></span> جاري الحذف...';
  }

  try {
    const baseUrl = typeof API_URL !== "undefined" ? API_URL.replace(/\/$/, "") : "http://localhost:3000";
    const response = await fetch(`${baseUrl}/${apiPath}/${deleteItemId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const result = await response.json();

    if (response.ok && (result.status === "success" || response.status === 200)) {
      showToast("تم الحذف بنجاح", "success");
      if (deleteModal) deleteModal.hide();
      fetchEntities(apiPath, deleteItemType);
    } else {
      showToast(result.message || "فشل عملية الحذف", "danger");
    }
  } catch (error) {
    showToast(`خطأ في الاتصال: ${error.message}`, "danger");
  } finally {
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = '<i class="fas fa-trash-alt me-1"></i> حذف';
    }
    deleteItemId = null;
    deleteItemType = null;
  }
}

async function handleFormSubmit(event, apiPath, entityType) {
  event.preventDefault();

  const nameInput = document.getElementById(`${entityType}-name`);
  const idField = document.getElementById(`${entityType}-id-field`);
  const submitBtn = document.getElementById(`${entityType}-submit-btn`);

  const name = nameInput ? nameInput.value.trim() : "";
  const id = idField ? idField.value : "";

  if (!name) {
    showToast("الاسم لا يمكن أن يكون فارغاً", "warning");
    if (nameInput) nameInput.focus();
    return;
  }

  const isEdit = !!id;
  const method = isEdit ? "PUT" : "POST";
  const baseUrl = typeof API_URL !== "undefined" ? API_URL.replace(/\/$/, "") : "http://localhost:3000";
  const url = isEdit ? `${baseUrl}/${apiPath}/${id}` : `${baseUrl}/${apiPath}`;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    const result = await response.json();

    if (response.ok && (result.status === "success" || response.status === 200 || response.status === 201)) {
      showToast(isEdit ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح", "success");
      cancelEdit(entityType);
      fetchEntities(apiPath, entityType);
    } else {
      showToast(result.message || "فشل العملية", "danger");
    }
  } catch (error) {
    showToast(`خطأ في الاتصال: ${error.message}`, "danger");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = isEdit
        ? '<i class="fas fa-save"></i><span class="btn-text">تعديل</span>'
        : '<i class="fas fa-plus"></i><span class="btn-text">إضافة</span>';
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const consultantForm = document.getElementById("consultant-form");
  if (consultantForm) {
    consultantForm.addEventListener("submit", (e) => {
      handleFormSubmit(e, "consultant", "consultant");
    });
  }

  const companyForm = document.getElementById("company-form");
  if (companyForm) {
    companyForm.addEventListener("submit", (e) => {
      handleFormSubmit(e, "company", "company");
    });
  }

  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", handleDelete);
  }

  fetchEntities("consultant", "consultant");
  fetchEntities("company", "company");
});
