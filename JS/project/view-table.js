let modalActivitiesData = [];
let currentModalData = [];

document
  .getElementById("view-excel-btn")
  .addEventListener("click", async function () {
    const modal = new bootstrap.Modal(
      document.getElementById("viewExcelModal")
    );
    modal.show();

    await fetchModalData();
  });

async function fetchModalData() {
  const tbody = document.getElementById("modalExcelTableBody");
  tbody.innerHTML = `<tr><td colspan="15" class="text-center py-4">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">جاري التحميل...</span>
    </div>
  </td></tr>`;

  try {
    const token = localStorage.getItem("loggedInUserToken");

    const savedFilters = JSON.parse(
      localStorage.getItem("dashboardFilters") || "{}"
    );
    const queryParams = new URLSearchParams(savedFilters).toString();
    const fetchUrl = `${API_URL}activity?${queryParams}`;

    const response = await fetch(fetchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const apiResponse = await response.json();

    if (!response.ok) {
      throw new Error(apiResponse.data || "فشل جلب البيانات");
    }

    if (
      apiResponse &&
      apiResponse.data &&
      Array.isArray(apiResponse.data.activities)
    ) {
      modalActivitiesData = apiResponse.data.activities;
      currentModalData = [...modalActivitiesData];
      renderModalTable();
    } else {
      tbody.innerHTML =
        '<tr><td colspan="15" class="text-center py-4">لا توجد بيانات</td></tr>';
    }
  } catch (error) {
    console.error("خطأ في جلب البيانات:", error);
    tbody.innerHTML = `<tr><td colspan="15" class="text-center py-4 text-danger">
      <i class="fas fa-exclamation-triangle me-2"></i>${error.message}
    </td></tr>`;
  }
}

/* function renderModalTable() {
  const tbody = document.getElementById("modalExcelTableBody");
  tbody.innerHTML = "";

  if (currentModalData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="15" class="text-center py-4">لا توجد مشروعات</td></tr>';
    updateModalStats();
    return;
  }

  const now = new Date();
  const currentYear =
    now.getMonth() + 1 >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const nextYear = currentYear + 1;
  const fiscalStart = new Date(currentYear, 6, 1);
  const fiscalEnd = new Date(nextYear, 5, 30, 23, 59, 59);

  currentModalData.forEach((activity, index) => {
    const contractualValue = activity.contractualValue || 0;

    const totalDisbursed =
      activity.extract?.reduce(
        (sum, ext) => sum + (ext.extractValue || 0),
        0
      ) || 0;

    const currentYearDisbursed =
      activity.extract
        ?.filter((ext) => {
          const d = new Date(ext.extractDate);
          return d >= fiscalStart && d <= fiscalEnd;
        })
        .reduce((sum, ext) => sum + (ext.extractValue || 0), 0) || 0;

    const disbursementRate =
      contractualValue > 0
        ? ((totalDisbursed / contractualValue) * 100).toFixed(2) + "%"
        : "0%";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="text-center">${index + 1}</td>
      <td style="word-break: break-word;">${activity.activityName || "-"}</td>
      <td style="word-break: break-word;">${
        activity.executingCompany || "-"
      }</td>
      <td class="text-center">${activity.governorate || "-"}</td>
      <td class="text-center">${activity.projectCategory || "-"}</td>
      <td class="text-center" style="white-space: nowrap;">${formatNumber(
        contractualValue
      )}</td>
      <td class="text-center" style="white-space: nowrap;">${formatNumber(
        activity.estimatedValue || 0
      )}</td>
      <td class="text-center" style="white-space: nowrap;">${formatNumber(
        currentYearDisbursed
      )}</td>
      <td class="text-center" style="white-space: nowrap;">${formatNumber(
        totalDisbursed
      )}</td>
      <td class="text-center" style="white-space: nowrap;">${disbursementRate}</td>
      <td class="text-center" style="white-space: nowrap;">${
        activity.progress || "0%"
      }</td>
      <td class="text-center" style="white-space: nowrap;">
        ${
          activity.projectLocationLink
            ? `<a href="${activity.projectLocationLink}" target="_blank" class="text-primary">
              <i class="fas fa-map-marker-alt"></i> عرض
            </a>`
            : "-"
        }
      </td>
      <td class="text-center" style="white-space: nowrap;">${
        activity.receptionDate ? formatDate(activity.receptionDate) : "-"
      }</td>
      <td class="text-center" style="white-space: nowrap;">${
        activity.completionDate ? formatDate(activity.completionDate) : "-"
      }</td>
      <td style="word-break: break-word;">${
        activity.executivePosition || "-"
      }</td>
    `;
    tbody.appendChild(row);
  });

  updateModalStats();
} */

function renderModalTable() {
  const tbody = document.getElementById("modalExcelTableBody");
  tbody.innerHTML = "";

  if (currentModalData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="15" class="text-center py-5">
          <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <h5>لا توجد مشروعات</h5>
            <p>لا توجد بيانات لعرضها حالياً</p>
          </div>
        </td>
      </tr>`;
    updateModalStats();
    return;
  }

  const now = new Date();
  const currentYear =
    now.getMonth() + 1 >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const nextYear = currentYear + 1;
  const fiscalStart = new Date(currentYear, 6, 1);
  const fiscalEnd = new Date(nextYear, 5, 30, 23, 59, 59);

  currentModalData.forEach((activity, index) => {
    const contractualValue = activity.contractualValue || 0;

    const totalDisbursed =
      activity.extract?.reduce(
        (sum, ext) => sum + (ext.extractValue || 0),
        0
      ) || 0;

    const currentYearDisbursed =
      activity.extract
        ?.filter((ext) => {
          const d = new Date(ext.extractDate);
          return d >= fiscalStart && d <= fiscalEnd;
        })
        .reduce((sum, ext) => sum + (ext.extractValue || 0), 0) || 0;

    const disbursementRate =
      contractualValue > 0
        ? ((totalDisbursed / contractualValue) * 100).toFixed(1) + "%"
        : "0%";

    function getProgressColorClass(value) {
      const num = parseFloat(value) || 0;
      if (num >= 100) return "bg-success";
      if (num > 0 && num < 100) return "bg-primary";
      return "bg-danger";
    }

    const progress = parseFloat(activity.progress) || 0;
    const progressText = progress + "%";

    const row = document.createElement("tr");
    row.innerHTML = `
<td class="text-center align-middle">
    <span class="badge bg-info text-white shadow-sm px-3 py-2 rounded-3 fw-normal" style="font-size: 0.9rem;">
      ${index + 1}
    </span>
  </td>
  
  <!-- اسم العملية -->
  <td class="align-middle" style="min-width: 300px; word-break: break-word;">
    <strong style="color: #2d3748; font-size: 0.95rem; font-family: 'Cairo', sans-serif;">
      ${activity.activityName || "-"}
    </strong>
  </td>
  
  <!-- الشركة المنفذة -->
  <td class="align-middle" style="min-width: 150px; word-break: break-word; color: #4a5568;">
    ${activity.executingCompany || "-"}
  </td>
  
  <!-- المحافظة -->
  <td class="text-center align-middle">
    <span class="badge bg-light text-dark shadow-sm px-3 py-2 rounded-3 fw-normal">
      ${activity.governorate || "غير محدد"}
    </span>
  </td>
  
  <!-- تصنيف المشروع -->
  <td class="text-center align-middle">
    <span class="badge bg-light text-dark shadow-sm px-3 py-2 rounded-3 fw-normal">
      ${activity.projectCategory || "غير محدد"}
    </span>
  </td>
  
  <!-- المبالغ المالية (أخضر وبخط واضح) -->
  <td class="text-center align-middle fw-bold text-success" style="white-space: nowrap; max-width: 50px;  font-family: 'Cairo', monospace; font-size: 1rem;">
    ${contractualValue}
  </td>
  
  <td class="text-center align-middle fw-bold text-success" style="white-space: nowrap; font-family: 'Cairo', monospace; font-size: 1rem;">
    ${activity.estimatedValue || 0}
  </td>
  
  <td class="text-center align-middle fw-bold text-success" style="white-space: nowrap; font-family: 'Cairo', monospace; font-size: 1rem;">
    ${currentYearDisbursed}
  </td>
  
  <td class="text-center align-middle fw-bold text-success" style="white-space: nowrap; font-family: 'Cairo', monospace; font-size: 1rem;">
    ${totalDisbursed}
  </td>
  
  <!-- نسبة الصرف -->
  <td class="text-center align-middle" style="white-space: nowrap; min-width: 60px;">
    <span  style="font-size: 0.9rem;">
      ${disbursementRate}
    </span>
  </td>
  
  <!-- نسبة الإنجاز (ملونة حسب الرقم) -->
  <td class="text-center align-middle" style="white-space: nowrap;">
    <span class="badge ${getProgressColorClass(
      progress
    )} text-white shadow-sm px-3 py-2 rounded-3 fw-normal" 
          style="font-size: 0.9rem; min-width: 60px;">
      ${progressText}
    </span>
  </td>
  
  <!-- رابط الموقع (تم تعديل البوردر ليكون زر كامل) -->
  <td class="text-center align-middle" style="white-space: nowrap;">
    ${
      activity.projectLocationLink
        ? `<a href="${activity.projectLocationLink}" target="_blank" 
            class="btn btn-sm btn-primary text-white shadow-sm px-3 py-1" 
            style="border-radius: 20px; font-weight: 600; display: inline-flex; align-items: center; text-decoration: none;">
            <i class="fas fa-map-marker-alt me-2"></i> الموقع
          </a>`
        : `<span class="text-muted small">-</span>`
    }
  </td>
  
  <!-- التواريخ -->
  <td class="text-center align-middle text-secondary fw-bold" style="white-space: nowrap; font-size: 0.85rem;">
    ${activity.receptionDate ? formatDate(activity.receptionDate) : "-"}
  </td>
  
  <td class="text-center align-middle text-secondary fw-bold" style="white-space: nowrap; font-size: 0.85rem;">
    ${activity.completionDate ? formatDate(activity.completionDate) : "-"}
  </td>
  
  <!-- الموقف التنفيذي -->
  <td class="align-middle" style="min-width: 300px; word-break: break-word; color: #4a5568; line-height: 1.6; font-size: 0.9rem;">
    ${activity.executivePosition || "-"}
  </td>
    `;
    tbody.appendChild(row);
  });

  updateModalStats();
}

function updateModalStats() {
  const totalProjects = currentModalData.length;
  const totalValue = currentModalData.reduce(
    (sum, a) => sum + (a.contractualValue || 0),
    0
  );

  const totalDisbursed = currentModalData.reduce((sum, activity) => {
    const disbursed =
      activity.extract?.reduce((s, ext) => s + (ext.extractValue || 0), 0) || 0;
    return sum + disbursed;
  }, 0);

  document.getElementById("modalTotalProjects").textContent = totalProjects;
  document.getElementById("modalTotalValue").textContent =
    formatNumber(totalValue) + " مليون ج.م";
  document.getElementById("modalTotalDisbursed").textContent =
    formatNumber(totalDisbursed) + " مليون ج.م";
}

// معالج الترتيب
document.getElementById("modalSortBy").addEventListener("change", function (e) {
  const sortValue = e.target.value;

  if (sortValue === "none") {
    currentModalData = [...modalActivitiesData];
  } else {
    currentModalData.sort((a, b) => {
      if (sortValue === "contractualValue") {
        return (b[sortValue] || 0) - (a[sortValue] || 0);
      } else if (sortValue === "progress") {
        const progressA = parseFloat((a.progress || "0").replace("%", ""));
        const progressB = parseFloat((b.progress || "0").replace("%", ""));
        return progressB - progressA;
      } else {
        return (a[sortValue] || "").localeCompare(b[sortValue] || "", "ar");
      }
    });
  }

  renderModalTable();
});

// طباعة الجدول
function printExcelTable() {
  window.print();
}

// تحميل Excel من الـ Modal
function downloadModalExcel() {
  // استدعاء الـ API الخاص بتحميل Excel
  window.location.href = `${API_URL}activity/export-excel`;
}

// دالة مساعدة لتنسيق الأرقام
function formatNumber(num) {
  return new Intl.NumberFormat("ar-EG").format(num || 0);
}

// دالة مساعدة لتنسيق التواريخ
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
