const ALL_YEARS = [
  "2024/2025",
  "2025/2026",
  "2026/2027",
  "2027/2028",
  "2028/2029",
  "2029/2030",
  "2030/2031",
  "2031/2032",
  "2032/2033",
  "2033/2034",
];

const FUNDING_TYPES = ["خطة استثمارية", "تمويل الغير"];

let budgets = [];
let filteredBudgets = [];
let mode = "add";
let editingId = null;
let currentFilter = "";

function getToken() {
  return localStorage.getItem("loggedInUserToken") || "";
}

function reqHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

document.addEventListener("DOMContentLoaded", fetchAllBudgets);

// ============ API Calls ============

async function fetchAllBudgets() {
  try {
    const res = await fetch(`${API_URL}budget`, { headers: reqHeaders() });
    const json = await res.json();
    budgets =
      json.status === "success" && Array.isArray(json.data) ? json.data : [];
    if (json.status !== "success")
      showToast(json.message || "تعذّر تحميل البيانات", "error");
  } catch (_) {
    budgets = [];
  }
  applyFilter();
  buildYearOptions();
}

async function callUpsert(fiscalYear, amount, fundingType) {
  const res = await fetch(`${API_URL}budget`, {
    method: "POST",
    headers: reqHeaders(),
    body: JSON.stringify({ fiscalYear, amount, fundingType }),
  });
  const json = await res.json();
  return { ok: json.status === "success", json, code: res.status };
}

// ============ Form Handling ============

async function handleSubmit(e) {
  e.preventDefault();

  const year = document.getElementById("yearSelect").value;
  const fundingType = document.getElementById("fundingTypeSelect").value;
  const raw = document.getElementById("amountInput").value.trim();
  const amount = parseFloat(raw);

  if (!year) {
    showToast("اختر السنة المالية", "error");
    return;
  }
  if (!fundingType) {
    showToast("اختر جهة التمويل", "error");
    return;
  }
  if (!raw || isNaN(amount) || amount < 0) {
    showToast("أدخل قيمة مالية صحيحة", "error");
    return;
  }

  if (mode === "add") {
    const exists = budgets.some(
      (b) => b.fiscalYear === year && b.fundingType === fundingType,
    );
    if (exists) {
      showToast(`مخصص ${year} - ${fundingType} موجود بالفعل`, "error");
      return;
    }
  }

  setLoading(true);
  const { ok, json, code } = await callUpsert(year, amount, fundingType);
  setLoading(false);

  if (!ok) {
    showToast(json.message || `خطأ (${code})`, "error");
    return;
  }

  const saved = json.data;
  if (mode === "add") {
    budgets.unshift(saved);
    showToast("تم إضافة المخصص المالي بنجاح", "success");
  } else {
    const idx = budgets.findIndex((b) => b._id === editingId);
    if (idx !== -1) budgets[idx] = saved;
    showToast("تم تعديل المخصص المالي بنجاح", "success");
  }

  resetForm();
  applyFilter();
  buildYearOptions();
}

// ============ Mode Management ============

function setMode(m, budget = null) {
  mode = m;
  const addBtn = document.querySelector('[data-mode="add"]');
  const editBtn = document.getElementById("editModeBtn");
  const fundingSelect = document.getElementById("fundingTypeSelect");

  if (m === "add") {
    addBtn.classList.add("active");
    editBtn.classList.remove("active");
    editBtn.disabled = true;
    document.getElementById("formTitle").textContent = "إضافة مخصص مالي";
    document.getElementById("formSub").textContent =
      "تسجيل مخصص جديد للسنة المالية";
    document.getElementById("submitText").textContent = "حفظ المخصص";
    editingId = null;
    document.getElementById("budgetForm").reset();
    fundingSelect.disabled = false;
    buildYearOptions();
  } else if (m === "edit" && budget) {
    editingId = budget._id;
    addBtn.classList.remove("active");
    editBtn.classList.add("active");
    editBtn.disabled = false;
    document.getElementById("formTitle").textContent = "تعديل مخصص مالي";
    document.getElementById("formSub").textContent =
      `تعديل ${budget.fiscalYear} - ${budget.fundingType}`;
    document.getElementById("submitText").textContent = "تحديث المخصص";

    buildYearOptions(budget.fiscalYear);
    document.getElementById("yearSelect").value = budget.fiscalYear;
    document.getElementById("fundingTypeSelect").value = budget.fundingType;
    document.getElementById("amountInput").value = budget.amount;

    fundingSelect.disabled = true;
    document.getElementById("yearSelect").disabled = true;
  }
}

function startEdit(id) {
  const b = budgets.find((b) => b._id === id);
  if (!b) return;
  setMode("edit", b);
  document
    .querySelector(".layout")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetForm() {
  mode = "add";
  editingId = null;
  const editBtn = document.getElementById("editModeBtn");
  editBtn.disabled = true;
  editBtn.classList.remove("active");
  document.querySelector('[data-mode="add"]').classList.add("active");
  document.getElementById("formTitle").textContent = "إضافة مخصص مالي";
  document.getElementById("formSub").textContent =
    "تسجيل مخصص جديد للسنة المالية";
  document.getElementById("submitText").textContent = "حفظ المخصص";
  document.getElementById("budgetForm").reset();
  document.getElementById("fundingTypeSelect").disabled = false;
  document.getElementById("yearSelect").disabled = false;
  buildYearOptions();
}

// ============ Year Options ============

function buildYearOptions(currentYear = null) {
  const sel = document.getElementById("yearSelect");
  sel.innerHTML =
    '<option value="" disabled selected>اختر السنة المالية</option>';

  ALL_YEARS.forEach((y) => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    sel.appendChild(opt);
  });

  // Re-enable in case it was disabled
  if (mode === "add") {
    sel.disabled = false;
  }
}

// ============ Filter ============

function applyFilter() {
  currentFilter = document.getElementById("filterFundingType")?.value || "";

  if (currentFilter) {
    filteredBudgets = budgets.filter((b) => b.fundingType === currentFilter);
  } else {
    filteredBudgets = [...budgets];
  }

  renderTable();
}

// ============ Table Rendering ============

function renderTable() {
  const tbody = document.getElementById("budgetsTable");
  const empty = document.getElementById("emptyState");
  document.getElementById("countBadge").textContent = filteredBudgets.length;

  if (!filteredBudgets.length) {
    tbody.innerHTML = "";
    empty.style.display = "flex";
    return;
  }
  empty.style.display = "none";

  tbody.innerHTML = filteredBudgets
    .map(
      (b, i) => `
    <tr style="animation-delay:${i * 0.05}s">
      <td>
        <span class="year-pill">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${b.fiscalYear}
        </span>
      </td>
      <td>
        <span class="funding-badge ${getFundingClass(b.fundingType)}">
          <i class="fas ${getFundingIcon(b.fundingType)}"></i>
          ${b.fundingType}
        </span>
      </td>
      <td class="amount-cell">
        ${formatMoneyAdvanced(b.amount)}
      </td>
      <td>
        <div class="actions">
          <button class="btn-icon edit" title="تعديل" onclick="startEdit('${b._id}')">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn-icon del" title="حذف" onclick="openConfirm('${b._id}', '${b.fiscalYear}', '${b.fundingType}')">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

// Helper functions for funding type styling
function getFundingClass(fundingType) {
  return fundingType === "خطة استثمارية"
    ? "funding-investment"
    : "funding-external";
}

function getFundingIcon(fundingType) {
  return fundingType === "خطة استثمارية" ? "fa-chart-line" : "fa-handshake";
}

// ============ Delete Confirmation ============

let deleteTargetId = null;

function openConfirm(id, year, fundingType) {
  deleteTargetId = id;
  document.getElementById("confirmYear").textContent = year;
  document.getElementById("confirmFunding").textContent = fundingType;
  document.getElementById("confirmOverlay").classList.add("show");
}

function closeConfirm() {
  deleteTargetId = null;
  document.getElementById("confirmOverlay").classList.remove("show");
}

async function confirmDelete() {
  if (!deleteTargetId) return;

  try {
    const response = await fetch(`${API_URL}budget/${deleteTargetId}`, {
      method: "DELETE",
      headers: reqHeaders(),
    });

    if (response.ok) {
      budgets = budgets.filter((b) => b._id !== deleteTargetId);
      applyFilter();
      buildYearOptions();
      showToast("تم الحذف بنجاح", "success");
    } else {
      const errorData = await response.json();
      showToast(errorData.message || "فشل الحذف", "error");
    }
  } catch (err) {
    showToast("مشكلة في الاتصال بالسيرفر", "error");
  }
  closeConfirm();
}

// ============ Utilities ============

function setLoading(v) {
  document.getElementById("submitBtn").classList.toggle("loading", v);
}

function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 3500);
}

function formatMoneyAdvanced(amount) {
  if (typeof amount !== "number") return amount;
  return new Intl.NumberFormat("ar-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
