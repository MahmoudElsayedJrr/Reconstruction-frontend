let currentFilters = {};
let selectedStatFilter = null;

function saveFilters() {
  const filters = {
    governorate: document.getElementById("governorateFilter").value,
    category: document.getElementById("projectCategoryFilter").value,
    funding: document.getElementById("fundingTypeFilter").value,
    fundingSource: document.getElementById("fundingSourceFilter").value,
    progressMin: document.getElementById("progressMin").value,
    progressMax: document.getElementById("progressMax").value,
    fiscalYear: document.getElementById("fiscalYearFilter").value,
    status: document.getElementById("statusFilter").value,
    selectedStat: selectedStatFilter
      ? JSON.stringify(selectedStatFilter)
      : null,
  };
  const saved = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v && v !== "الكل"),
  );
  localStorage.setItem("reportsFilters", JSON.stringify(saved));
}

function restoreFilters() {
  const saved = localStorage.getItem("reportsFilters");
  if (saved) {
    const filters = JSON.parse(saved);

    if (filters.governorate)
      document.getElementById("governorateFilter").value = filters.governorate;
    if (filters.category)
      document.getElementById("projectCategoryFilter").value = filters.category;
    if (filters.funding)
      document.getElementById("fundingTypeFilter").value = filters.funding;
    if (filters.fundingSource)
      document.getElementById("fundingSourceFilter").value =
        filters.fundingSource;
    if (filters.progressMin)
      document.getElementById("progressMin").value = filters.progressMin;
    if (filters.progressMax)
      document.getElementById("progressMax").value = filters.progressMax;
    if (filters.fiscalYear)
      document.getElementById("fiscalYearFilter").value = filters.fiscalYear;
    if (filters.status)
      document.getElementById("statusFilter").value = filters.status;

    currentFilters = {
      governorate: filters.governorate,
      category: filters.category,
      funding: filters.funding,
      fundingSource: filters.fundingSource,
      progressMin: filters.progressMin,
      progressMax: filters.progressMax,
      fiscalYear: filters.fiscalYear,
      status: filters.status,
    };

    Object.keys(currentFilters).forEach((key) => {
      if (!currentFilters[key] || currentFilters[key] === "الكل")
        delete currentFilters[key];
    });

    if (filters.selectedStat) {
      selectedStatFilter = JSON.parse(filters.selectedStat);
    }

    return true;
  }
  return false;
}

function initializePage() {
  const restored = restoreFilters();

  if (restored) {
    loadStatistics();
    if (selectedStatFilter && selectedStatFilter.governorate) {
      loadProjects();
    }
  } else {
    loadStatistics();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
});

document
  .getElementById("exportExcelBtn")
  .addEventListener("click", exportToExcel);
document.getElementById("filterButton").addEventListener("click", applyFilters);
document.getElementById("resetButton").addEventListener("click", resetFilters);
document
  .getElementById("printStatsBtn")
  .addEventListener("click", printStatistics);
document.getElementById("closeProjectsBtn").addEventListener("click", () => {
  document.getElementById("projectsCard").style.display = "none";
  selectedStatFilter = null;
  saveFilters();
});

function showLoading() {
  document.getElementById("loadingOverlay").classList.add("active");
  document.getElementById("loadingSpinner").classList.add("active");
}

function hideLoading() {
  document.getElementById("loadingOverlay").classList.remove("active");
  document.getElementById("loadingSpinner").classList.remove("active");
}

function buildQueryParams(additionalFilters = {}) {
  const params = new URLSearchParams();

  const filters = { ...currentFilters, ...additionalFilters };

  if (filters.code) params.append("activityCode", filters.code);
  if (filters.name) params.append("name", filters.name);
  if (filters.governorate && filters.governorate !== "الكل")
    params.append("governorate", filters.governorate);
  if (filters.category && filters.category !== "الكل")
    params.append("projectCategory", filters.category);
  if (filters.funding && filters.funding !== "الكل")
    params.append("fundingType", filters.funding);
  if (filters.fundingSource && filters.fundingSource !== "الكل")
    params.append("fundingSource", filters.fundingSource);
  if (filters.progressMin) params.append("progressMin", filters.progressMin);
  if (filters.progressMax) params.append("progressMax", filters.progressMax);
  if (filters.fiscalYear && filters.fiscalYear !== "الكل")
    params.append("fiscalYear", filters.fiscalYear);
  if (filters.status && filters.status !== "الكل")
    params.append("status", filters.status);

  return params.toString();
}

function applyFilters() {
  currentFilters = {
    governorate: document.getElementById("governorateFilter").value,
    category: document.getElementById("projectCategoryFilter").value,
    funding: document.getElementById("fundingTypeFilter").value,
    fundingSource: document.getElementById("fundingSourceFilter").value,
    progressMin: document.getElementById("progressMin").value,
    progressMax: document.getElementById("progressMax").value,
    fiscalYear: document.getElementById("fiscalYearFilter").value,
    status: document.getElementById("statusFilter").value,
  };

  Object.keys(currentFilters).forEach((key) => {
    if (!currentFilters[key] || currentFilters[key] === "الكل")
      delete currentFilters[key];
  });

  saveFilters();

  loadStatistics();
  document.getElementById("projectsCard").style.display = "none";
  selectedStatFilter = null;
}

function resetFilters() {
  document.getElementById("governorateFilter").selectedIndex = 0;
  document.getElementById("projectCategoryFilter").selectedIndex = 0;
  document.getElementById("fundingTypeFilter").selectedIndex = 0;
  document.getElementById("fundingSourceFilter").selectedIndex = 0;
  document.getElementById("progressMin").value = "";
  document.getElementById("progressMax").value = "";
  document.getElementById("fiscalYearFilter").selectedIndex = 0;
  document.getElementById("statusFilter").selectedIndex = 0;

  currentFilters = {};
  selectedStatFilter = null;

  localStorage.removeItem("reportsFilters");

  loadStatistics();
  document.getElementById("projectsCard").style.display = "none";
}

async function loadStatistics() {
  showLoading();
  try {
    const queryParams = buildQueryParams();
    const token = localStorage.getItem("loggedInUserToken");

    const response = await fetch(
      `${API_URL}activity/statistics?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status} - ${
          errorData.message || "فشل جلب الإحصائيات"
        }`,
      );
    }

    const data = await response.json();

    if (data.status === "success" || data.data) {
      renderStatsTable(data.data || data);
      document.getElementById("statsCard").style.display = "block";
      document
        .getElementById("statsCard")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      alert(
        "حدث خطأ في تحميل الإحصائيات: " + (data.message || "خطأ غير معروف"),
      );
    }
  } catch (error) {
    const tbody = document.getElementById("statsBody");
    tbody.innerHTML = `
            <tr class="default-row">
                <td colspan="7" class="text-center align-middle py-4 text-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    حدث خطأ في تحميل البيانات
                </td>
            </tr>
        `;
    document.getElementById("statsCard").style.display = "block";
  } finally {
    hideLoading();
  }
}

function renderStatsTable(stats) {
  const tbody = document.getElementById("statsBody");
  tbody.innerHTML = "";

  if (!stats || stats.length === 0) {
    tbody.innerHTML =
      '<tr class="total-row table-secondary"><td colspan="7" class="text-center">لا توجد بيانات</td></tr>';
    return;
  }

  let totals = {
    totalActivities: 0,
    begin: 0,
    completed: 0,
    withdrawn: 0,
    late: 0,
    inProgress: 0,
    suspended: 0,
    needsExtension: 0,
    initialDelivery: 0,
    finalDelivery: 0,
  };

  stats.forEach((stat, index) => {
    const row = document.createElement("tr");

    totals.totalActivities += stat.totalActivities;
    totals.begin += stat.begin;
    totals.completed += stat.completed;
    totals.withdrawn += stat.withdrawn;
    totals.late += stat.late;
    totals.inProgress += stat.inProgress;
    totals.suspended += stat.suspended;
    totals.needsExtension += stat.needsExtension;
    totals.initialDelivery += stat.initialDelivery;
    totals.finalDelivery += stat.finalDelivery;

    row.innerHTML = `
        <td class="text-center align-middle">${index + 1}</td>
        <td class="text-center align-middle clickable fw-bold" onclick="handleRowClick('${
          stat.governorate
        }')">${stat.governorate}</td>
        <td class="text-center align-middle clickable" onclick="handleCellClick('${
          stat.governorate
        }', null)">${stat.totalActivities || 0}</td>
        <td class="text-center align-middle clickable bg-success bg-opacity-10" onclick="handleCellClick('${
          stat.governorate
        }', 'تحت الطرح')">${stat.begin || 0}</td>
        <td class="text-center align-middle clickable bg-success bg-opacity-10" onclick="handleCellClick('${
          stat.governorate
        }', 'مكتمل')">${stat.completed || 0}</td>
        <td class="text-center align-middle clickable bg-danger bg-opacity-10" onclick="handleCellClick('${
          stat.governorate
        }', 'مسحوب')">${stat.withdrawn || 0}</td>
        <td class="text-center align-middle clickable bg-primary bg-opacity-10" onclick="handleCellClick('${
          stat.governorate
        }', 'قيد التنفيذ')">${stat.inProgress || 0}</td>
        <td class="text-center align-middle clickable bg-warning bg-opacity-10" onclick="handleCellClick('${
          stat.governorate
        }', 'متأخر')">${stat.late || 0}</td>
        <td class="text-center align-middle clickable bg-warning bg-opacity-10" onclick="handleCellClick('${
          stat.governorate
        }', 'متوقف')">${stat.suspended || 0}</td>
        <td class="text-center align-middle clickable bg-warning bg-opacity-10" onclick="handleCellClick('${
          stat.governorate
        }', 'يحتاج مد مده')">${stat.needsExtension || 0}</td>
        <td class="text-center align-middle clickable bg-info bg-opacity-10" onclick="handleCellClick('${
          stat.governorate
        }', 'تسليم ابتدائي')">${stat.initialDelivery || 0}</td>
        <td class="text-center align-middle clickable bg-success bg-opacity-10" onclick="handleCellClick('${
          stat.governorate
        }', 'تسليم نهائي')">${stat.finalDelivery || 0}</td>
    `;
    tbody.appendChild(row);
  });

  if (stats.length > 1) {
    const totalRow = document.createElement("tr");
    totalRow.className = "total-row";

    totalRow.innerHTML = `
                        <td colspan="2" class="text-center">الإجمــــــــالي</td>
                        <td class="text-center">${totals.totalActivities}</td>
                        <td class="text-center">${totals.begin}</td>
                        <td class="text-center">${totals.completed}</td>
                        <td class="text-center">${totals.withdrawn}</td>
                        <td class="text-center">${totals.inProgress}</td>
                        <td class="text-center">${totals.late}</td>
                        <td class="text-center">${totals.suspended}</td>
                        <td class="text-center">${totals.needsExtension}</td>
                        <td class="text-center">${totals.initialDelivery}</td>
                        <td class="text-center">${totals.finalDelivery}</td>
                        
                    `;
    tbody.appendChild(totalRow);
  }
}

function handleRowClick(governorate) {
  selectedStatFilter = { governorate: governorate, status: null };
  saveFilters();
  loadProjects();
}

function handleCellClick(governorate, status) {
  selectedStatFilter = { governorate: governorate, status: status };
  saveFilters();
  loadProjects();
}

async function loadProjects() {
  showLoading();
  try {
    const additionalFilters = {
      governorate: selectedStatFilter.governorate,
    };

    if (selectedStatFilter.status) {
      additionalFilters.status = selectedStatFilter.status;
    }

    const queryParams = buildQueryParams(additionalFilters);
    const token = localStorage.getItem("loggedInUserToken");
    const response = await fetch(`${API_URL}activity?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (data.status === "success") {
      renderProjects(data.data.activities);
    } else {
      alert("حدث خطأ في تحميل المشروعات");
    }
  } catch (error) {
    alert("حدث خطأ في الاتصال بالسيرفر");
  } finally {
    hideLoading();
  }
}

function renderProjects(activities) {
  const projectsList = document.getElementById("projectsList");
  const projectsCard = document.getElementById("projectsCard");
  const projectsCount = document.getElementById("projectsCount");

  projectsCount.textContent = activities.length;
  projectsList.innerHTML = "";

  if (activities.length === 0) {
    projectsList.innerHTML =
      '<div class="col-12 text-center text-muted py-4">لا توجد مشروعات</div>';
    return;
  }

  activities.forEach((activity) => {
    const statusColors = {
      "قيد التنفيذ": "primary",
      "تحت الطرح": "info",
      مكتمل: "success",
      متأخر: "danger",
      مسحوب: "warning",
      متوقف: "danger",
      "يحتاج مد مده": "warning",
      "تسليم ابتدائي": "info",
      "تسليم نهائي": "success",
    };

    const progressValue = activity.progress || 0;
    const progressBarColor = progressValue >= 100 ? "bg-success" : "bg-primary";

    const col = document.createElement("div");
    col.className = "col-12";

    col.innerHTML = `
            <div class="project-card p-3 bg-white" style="cursor: pointer;" onclick="window.location.href='project-details.html?code=${
              activity.activityCode
            }&from=filter'">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 class="fw-bold text-primary mb-1">${
                          activity.activityName || "غير محدد"
                        }</h5>
                        <small class="text-muted">كود المشروع: ${
                          activity.activityCode || "غير محدد"
                        }</small>
                    </div>
                    <span class="badge bg-${
                      statusColors[activity.status] || "secondary"
                    } badge-status">${activity.status || "غير محدد"}</span>
                </div>
                
                <div class="row g-2 mb-3">
                    <div class="col-md-3">
                        <small class="text-muted d-block">المحافظة</small>
                        <span class="fw-bold">${
                          activity.governorate || "غير محدد"
                        }</span>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block">الفئة</small>
                        <span class="fw-bold">${
                          activity.projectCategory || "غير محدد"
                        }</span>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block">نوع التمويل</small>
                        <span class="fw-bold">${
                          activity.fundingType || "غير محدد"
                        }</span>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block">السنة المالية</small>
                        <span class="fw-bold">${
                          activity.fiscalYear || "غير محدد"
                        }</span>
                    </div>
                </div>
                
                <div class="mb-0">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <small class="text-muted">نسبة التنفيذ</small>
                        <small class="fw-bold">${progressValue || 0}%</small>
                    </div>
                    <div class="progress" style="height: 8px;">
                        <div class="progress-bar ${progressBarColor}" role="progressbar" style="width: ${
                          progressValue || 0
                        }%"></div>
                    </div>
                </div>
            </div>
        `;
    projectsList.appendChild(col);
  });

  projectsCard.style.display = "block";
  projectsCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function exportToExcel() {
  const statsBody = document.getElementById("statsBody");

  if (!statsBody.innerHTML.trim() || statsBody.querySelector(".default-row")) {
    alert("لا توجد بيانات لتصديرها!");
    return;
  }

  const table = document.querySelector("#statsCard table");
  const ws = XLSX.utils.table_to_sheet(table);

  ws["!sheetViews"] = [{ rightToLeft: true }];

  const colWidths = [];
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 15;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
      if (cell && cell.v != null) {
        const len = cell.v.toString().length;
        if (len > maxWidth) maxWidth = len;
      }
    }
    colWidths.push({ wch: maxWidth + 1 });
  }
  ws["!cols"] = colWidths;

  const parseCssColor = (cssColor) => {
    if (!cssColor || cssColor === "transparent") return null;

    let m = String(cssColor).match(
      /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)$/i,
    );
    if (m) {
      const r = +m[1],
        g = +m[2],
        b = +m[3],
        a = +m[4];
      if (a === 0) return null;
      const hex = [r, g, b]
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
      return { hex, r, g, b, a };
    }

    // rgb(r,g,b)
    m = String(cssColor).match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (m) {
      const r = +m[1],
        g = +m[2],
        b = +m[3];
      const hex = [r, g, b]
        .map((n) => n.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
      return { hex, r, g, b, a: 1 };
    }

    return null;
  };

  const isGrayLike = ({ r, g, b }) => {
    const close =
      Math.abs(r - g) < 12 && Math.abs(r - b) < 12 && Math.abs(g - b) < 12;
    if (!close) return false;

    const brightness = (r + g + b) / 3;
    if (brightness < 60) return false;
    if (brightness > 245) return false;

    return true;
  };

  const mergeStyle = (cell, add) => {
    cell.s = cell.s || {};
    cell.s = {
      ...cell.s,
      ...add,
      alignment: { ...(cell.s.alignment || {}), ...(add.alignment || {}) },
      font: { ...(cell.s.font || {}), ...(add.font || {}) },
      fill: { ...(cell.s.fill || {}), ...(add.fill || {}) },
      border: { ...(cell.s.border || {}), ...(add.border || {}) },
    };
  };

  const headerStyle = {
    alignment: { horizontal: "center", vertical: "center" },
    font: { bold: true, color: { rgb: "FF000000" } },
    fill: { patternType: "solid", fgColor: { rgb: "FFE6E6E6" } },
  };

  const rows = table.rows;
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].cells.length; c++) {
      const elCell = rows[r].cells[c];
      const addr = XLSX.utils.encode_cell({ r, c });
      const xCell = ws[addr];
      if (!xCell) continue;

      if (r === 0) {
        mergeStyle(xCell, headerStyle);
        continue;
      }

      const parsed = parseCssColor(getComputedStyle(elCell).backgroundColor);
      if (!parsed) continue;

      if (isGrayLike(parsed)) {
        mergeStyle(xCell, {
          fill: { patternType: "solid", fgColor: { rgb: "FF" + parsed.hex } },
        });
      }
    }
  }

  const wb = XLSX.utils.book_new();
  wb.Workbook = { Views: [{ RTL: true }] };
  XLSX.utils.book_append_sheet(wb, ws, "إحصائيات المشروعات");

  const fileName = `تقرير_المشروعات_${new Date()
    .toLocaleDateString("ar-EG")
    .replace(/\//g, "-")}.xlsx`;

  XLSX.writeFile(wb, fileName);
}

function printStatistics() {
  const statsCard = document.getElementById("statsCard");

  if (
    statsCard.style.display === "none" ||
    !document.getElementById("statsBody").innerHTML.trim()
  ) {
    alert(" لا توجد بيانات للطباعة. قم بتطبيق الفلتر أولاً!");
    return;
  }

  const printWindow = window.open("", "_blank");

  const printContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>طباعة إحصائيات المشروعات</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                @media print {
                    body { 
                        padding: 40px;
                        font-family: 'Arial', sans-serif;
                    }
                    .no-print { display: none !important; }
                    table { 
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000 !important;
                        padding: 8px !important;
                    }
                    .total-row {
                        background-color: #e9ecef !important;
                        font-weight: bold;
                    }
                    @page {
                        margin: 1cm;
                    }
                }
                body {
                    font-family: 'Arial', sans-serif;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 15px;
                }
                table {
                    width: 100%;
                    margin-top: 20px;
                }
                th {
                    background-color: #0d6efd;
                    color: white;
                    font-weight: bold;
                }
                .total-row {
                    background-color: #e9ecef;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>📊 تقرير إحصائيات المشروعات</h2>
                <p>تاريخ الطباعة: ${new Date().toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}</p>
            </div>
            
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th class="text-center">#</th>
                        <th class="text-center">المحافظة</th>
                        <th class="text-center">إجمالي المشروعات</th>
                        <th class="text-center">تحت لطرح</th>
                        <th class="text-center">مكتمل</th>
                        <th class="text-center">مسحوب</th>
                        <th class="text-center">قيد التنفيذ</th>
                        <th class="text-center">متأخر</th>
                        <th class="text-center">متوقف</th>
                        <th class="text-center">يحتاج مد مده</th>
                        <th class="text-center">تسليم ابتدائي</th>
                        <th class="text-center">تسليم نهائي</th>
                    </tr>
                </thead>
                <tbody>
                    ${document.getElementById("statsBody").innerHTML}
                </tbody>
            </table>
            
            
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `;

  printWindow.document.write(printContent);
  printWindow.document.close();
}
