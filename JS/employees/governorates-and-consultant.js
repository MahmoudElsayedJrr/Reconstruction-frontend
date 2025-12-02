const token = localStorage.getItem("loggedInUserToken");
const TOKEN = `Bearer ${token}`;
const toastContainer = document.querySelector(".toast-container");

function showToast(message, type = "success") {
  if (!toastContainer) {
    console.error("Toast container not found!");
    alert(message);
    return;
  }
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
  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });
  toast.show();
}
function createListItem(item, entityType) {
  const apiPath = entityType === "governorate" ? "governorate" : "consultant";

  const listItem = document.createElement("div");
  listItem.className =
    "list-group-item d-flex justify-content-between align-items-center";
  listItem.dataset.id = item.id;
  listItem.dataset.name = item.name;

  const nameSpan = document.createElement("span");
  nameSpan.textContent = item.name;
  listItem.appendChild(nameSpan);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "d-flex gap-2";

  const editButton = document.createElement("button");
  editButton.className = "btn btn-action btn-primary";
  editButton.innerHTML = '<i class="fas fa-edit"></i>';
  editButton.title = "تعديل";
  editButton.onclick = () => {
    document.getElementById(`${entityType}-name`).value = item.name;
    document.getElementById(`${entityType}-id-field`).value = item._id;
    const submitBtn = document.getElementById(`${entityType}-submit-btn`);
    submitBtn.innerHTML = '<i class="fas fa-save"></i> تعديل';
    submitBtn.classList.remove("btn-success");
    submitBtn.classList.add("btn-warning");
    submitBtn.scrollIntoView({ behavior: "smooth" });
  };

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-action btn-danger";
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.title = "حذف";
  deleteButton.onclick = () => handleDelete(item._id, apiPath);

  actionsDiv.appendChild(editButton);
  actionsDiv.appendChild(deleteButton);
  listItem.appendChild(actionsDiv);

  return listItem;
}

async function fetchEntities(
  apiPath,
  listElementId,
  countElementId,
  loadingIndicatorId
) {
  const listElement = document.getElementById(listElementId);
  const countElement = document.getElementById(countElementId);
  const loadingIndicator = document.getElementById(loadingIndicatorId);

  listElement.innerHTML = "";
  loadingIndicator.style.display = "block";

  try {
    const response = await fetch(`${API_URL}${apiPath}/`, {
      headers: { Authorization: TOKEN },
    });
    const result = await response.json();
    loadingIndicator.style.display = "none";

    if (response.ok && Array.isArray(result.data)) {
      countElement.textContent = result.data.length;
      if (result.data.length === 0) {
        listElement.innerHTML = "";
        showToast(`لا توجد عناصر مسجلة بعد: ${apiPath}`, "warning");
        return;
      }

      const entityType =
        apiPath === "governorate" ? "governorate" : "consultant";
      result.data.forEach((item) =>
        listElement.appendChild(createListItem(item, entityType))
      );

      if (apiPath === "governorate") updateRegionDropdown(result.data);
    } else {
      showToast(result.message || `فشل جلب قائمة ${apiPath}`, "danger");
    }
  } catch (error) {
    loadingIndicator.style.display = "none";
    showToast(`خطأ في الاتصال بالخادم: ${error.message}`, "danger");
  }
}

async function handleDelete(id, apiPath) {
  if (!confirm(`هل أنت متأكد من حذف العنصر؟`)) return;

  try {
    const response = await fetch(`${API_URL}${apiPath}/${id}`, {
      method: "DELETE",
      headers: { Authorization: TOKEN },
    });
    const result = await response.json();

    if (response.ok && result.status === "success") {
      showToast("تم الحذف بنجاح.", "success");
      location.reload();
    } else {
      showToast(result.message || "فشل عملية الحذف.", "danger");
    }
  } catch (error) {
    showToast(`خطأ في الاتصال: ${error.message}`, "danger");
  }
}

async function handleFormSubmit(event, apiPath) {
  event.preventDefault();

  const entityType = apiPath === "governorate" ? "governorate" : "consultant";
  const nameInput = document.getElementById(`${entityType}-name`);
  const idField = document.getElementById(`${entityType}-id-field`);
  const submitBtn = document.getElementById(`${entityType}-submit-btn`);

  const name = nameInput.value.trim();
  const id = idField.value;
  if (!name) return showToast("الاسم لا يمكن أن يكون فارغاً.", "warning");

  const isEdit = !!id;
  const method = isEdit ? "PUT" : "POST";
  const url = isEdit ? `${API_URL}${apiPath}/${id}` : `${API_URL}${apiPath}/`;

  submitBtn.disabled = true;

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
      showToast(isEdit ? "تم التعديل بنجاح." : "تمت الإضافة بنجاح.", "success");
      location.reload();
    } else {
      showToast(result.message || "فشل العملية.", "danger");
    }
  } catch (error) {
    showToast(`خطأ في الاتصال: ${error.message}`, "danger");
  } finally {
    submitBtn.disabled = false;
  }
}

function updateRegionDropdown(regions) {
  const regionSelect = document.getElementById("region-edit");
  regionSelect
    .querySelectorAll("option:not([disabled])")
    .forEach((o) => o.remove());
  regions.forEach((r) => {
    const option = document.createElement("option");
    option.value = r.name;
    option.textContent = r.name;
    regionSelect.appendChild(option);
  });
}

function fetchGovernorates() {
  fetchEntities(
    "governorate",
    "governorate-list",
    "governorate-count",
    "governorate-loading-indicator"
  );
}

function fetchConsultants() {
  fetchEntities(
    "consultant",
    "consultant-list",
    "consultant-count",
    "consultant-loading-indicator"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("governorate-form")
    .addEventListener("submit", (e) => handleFormSubmit(e, "governorate"));
  document
    .getElementById("consultant-form")
    .addEventListener("submit", (e) => handleFormSubmit(e, "consultant"));

  fetchGovernorates();
  fetchConsultants();
});
