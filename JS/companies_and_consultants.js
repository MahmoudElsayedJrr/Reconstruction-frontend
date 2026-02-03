const token = localStorage.getItem("loggedInUserToken");
const TOKEN = `Bearer ${token}`;

const toastContainer = document.querySelector(".toast-container");
const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
let deleteItemId = null;
let deleteItemType = null;

function showToast(message, type = "success") {
  if (!toastContainer) {
    console.error("Toast container not found!");
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

  const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${icons[type]} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>`;

  toastContainer.insertAdjacentHTML("beforeend", toastHTML);
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });

  toastElement.addEventListener("hidden.bs.toast", () => toastElement.remove());
  toast.show();
}

// ===== Create List Item =====
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
            <button class="btn-action btn-edit" title="تعديل" onclick="editItem('${item._id}', '${item.name}', '${entityType}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action btn-delete" title="حذف" onclick="confirmDelete('${item._id}', '${item.name}', '${entityType}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;

  return listItem;
}

// ===== Fetch Entities =====
async function fetchEntities(apiPath, entityType) {
  const listElement = document.getElementById(`${entityType}-list`);
  const countElement = document.getElementById(`${entityType}-count`);
  const loadingIndicator = document.getElementById(
    `${entityType}-loading-indicator`,
  );
  const emptyState = document.getElementById(`${entityType}-empty`);

  listElement.querySelectorAll(".list-item").forEach((item) => item.remove());
  loadingIndicator.classList.remove("d-none");
  emptyState.classList.add("d-none");

  try {
    const response = await fetch(`${API_URL}${apiPath}/`, {
      headers: { Authorization: TOKEN },
    });
    const result = await response.json();

    loadingIndicator.classList.add("d-none");

    if (response.ok && Array.isArray(result.data)) {
      countElement.textContent = result.data.length;

      if (result.data.length === 0) {
        emptyState.classList.remove("d-none");
        return;
      }

      result.data.forEach((item, index) => {
        const listItem = createListItem(item, entityType);
        listItem.style.animationDelay = `${index * 0.05}s`;
        listElement.appendChild(listItem);
      });
    } else {
      showToast(result.message || `فشل جلب قائمة ${entityType}`, "danger");
    }
  } catch (error) {
    loadingIndicator.classList.add("d-none");
    showToast(`خطأ في الاتصال بالخادم: ${error.message}`, "danger");
  }
}

function editItem(id, name, entityType) {
  const nameInput = document.getElementById(`${entityType}-name`);
  const idField = document.getElementById(`${entityType}-id-field`);
  const submitBtn = document.getElementById(`${entityType}-submit-btn`);
  const cancelBtn = document.getElementById(`${entityType}-cancel-btn`);

  nameInput.value = name;
  idField.value = id;

  submitBtn.innerHTML =
    '<i class="fas fa-save"></i><span class="btn-text">تعديل</span>';
  submitBtn.classList.remove("btn-success");
  submitBtn.classList.add("btn-warning");

  cancelBtn.classList.remove("d-none");

  nameInput.focus();
  nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
}

function cancelEdit(entityType) {
  const nameInput = document.getElementById(`${entityType}-name`);
  const idField = document.getElementById(`${entityType}-id-field`);
  const submitBtn = document.getElementById(`${entityType}-submit-btn`);
  const cancelBtn = document.getElementById(`${entityType}-cancel-btn`);

  nameInput.value = "";
  idField.value = "";

  submitBtn.innerHTML =
    '<i class="fas fa-plus"></i><span class="btn-text">إضافة</span>';
  submitBtn.classList.remove("btn-warning");
  submitBtn.classList.add("btn-success");

  cancelBtn.classList.add("d-none");
}

function confirmDelete(id, name, entityType) {
  deleteItemId = id;
  deleteItemType = entityType;
  document.getElementById("delete-item-name").textContent = name;
  deleteModal.show();
}

async function handleDelete() {
  if (!deleteItemId || !deleteItemType) return;

  const apiPath = deleteItemType;
  const confirmBtn = document.getElementById("confirm-delete-btn");

  confirmBtn.disabled = true;
  confirmBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm me-1"></span> جاري الحذف...';

  try {
    const response = await fetch(`${API_URL}${apiPath}/${deleteItemId}`, {
      method: "DELETE",
      headers: { Authorization: TOKEN },
    });
    const result = await response.json();

    if (response.ok && result.status === "success") {
      showToast("تم الحذف بنجاح", "success");

      const listElement = document.getElementById(`${deleteItemType}-list`);
      const item = listElement.querySelector(`[data-id="${deleteItemId}"]`);
      if (item) {
        item.style.animation = "fadeOut 0.3s ease forwards";
        setTimeout(() => {
          item.remove();

          const countElement = document.getElementById(
            `${deleteItemType}-count`,
          );
          const currentCount = parseInt(countElement.textContent) - 1;
          countElement.textContent = currentCount;

          if (currentCount === 0) {
            document
              .getElementById(`${deleteItemType}-empty`)
              .classList.remove("d-none");
          }
        }, 300);
      }

      deleteModal.hide();
    } else {
      showToast(result.message || "فشل عملية الحذف", "danger");
    }
  } catch (error) {
    showToast(`خطأ في الاتصال: ${error.message}`, "danger");
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = '<i class="fas fa-trash-alt me-1"></i> حذف';
    deleteItemId = null;
    deleteItemType = null;
  }
}

async function handleFormSubmit(event, apiPath, entityType) {
  event.preventDefault();

  const nameInput = document.getElementById(`${entityType}-name`);
  const idField = document.getElementById(`${entityType}-id-field`);
  const submitBtn = document.getElementById(`${entityType}-submit-btn`);

  const name = nameInput.value.trim();
  const id = idField.value;

  if (!name) {
    showToast("الاسم لا يمكن أن يكون فارغاً", "warning");
    nameInput.focus();
    return;
  }

  const isEdit = !!id;
  const method = isEdit ? "PUT" : "POST";
  const url = isEdit ? `${API_URL}${apiPath}/${id}` : `${API_URL}${apiPath}/`;

  submitBtn.disabled = true;
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML =
    '<span class="spinner-border spinner-border-sm"></span>';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
      },
      body: JSON.stringify({ name }),
    });
    const result = await response.json();

    if (response.ok && result.status === "success") {
      showToast(isEdit ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح", "success");
      cancelEdit(entityType);
      fetchEntities(apiPath, entityType);
    } else {
      showToast(result.message || "فشل العملية", "danger");
    }
  } catch (error) {
    showToast(`خطأ في الاتصال: ${error.message}`, "danger");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
  }
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("consultant-form").addEventListener("submit", (e) => {
    handleFormSubmit(e, "consultant", "consultant");
  });

  document.getElementById("company-form").addEventListener("submit", (e) => {
    handleFormSubmit(e, "company", "company");
  });

  document
    .getElementById("confirm-delete-btn")
    .addEventListener("click", handleDelete);

  fetchEntities("consultant", "consultant");
  fetchEntities("company", "company");

  const style = document.createElement("style");
  style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(-20px); }
        }
    `;
  document.head.appendChild(style);
});
