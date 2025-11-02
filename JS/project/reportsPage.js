let currentFilters = {};
let selectedStatFilter = null;

document.addEventListener("DOMContentLoaded", () => {});
document.getElementById("filterButton").addEventListener("click", applyFilters);
document.getElementById("resetButton").addEventListener("click", resetFilters);
document
  .getElementById("printStatsBtn")
  .addEventListener("click", printStatistics);
document.getElementById("closeProjectsBtn").addEventListener("click", () => {
  document.getElementById("projectsCard").style.display = "none";
  selectedStatFilter = null;
});

function showLoading() {
  console.log("Showing loading...");
  document.getElementById("loadingOverlay").classList.add("active");
  document.getElementById("loadingSpinner").classList.add("active");
}

function hideLoading() {
  console.log("Hiding loading...");
  document.getElementById("loadingOverlay").classList.remove("active");
  document.getElementById("loadingSpinner").classList.remove("active");
}

function buildQueryParams(additionalFilters = {}) {
  const params = new URLSearchParams();

  const filters = { ...currentFilters, ...additionalFilters };

  if (filters.code) params.append("activityCode", filters.code);
  if (filters.name) params.append("name", filters.name);
  if (filters.governorate) params.append("governorate", filters.governorate);
  if (filters.category) params.append("projectCategory", filters.category);
  if (filters.funding) params.append("fundingType", filters.funding);
  if (filters.progressMin) params.append("progressMin", filters.progressMin);
  if (filters.progressMax) params.append("progressMax", filters.progressMax);
  if (filters.fiscalYear) params.append("fiscalYear", filters.fiscalYear);
  if (filters.status) params.append("status", filters.status);

  return params.toString();
}

function applyFilters() {
  currentFilters = {
    governorate: document.getElementById("governorateFilter").value,
    category: document.getElementById("projectCategoryFilter").value,
    funding: document.getElementById("fundingTypeFilter").value,
    progressMin: document.getElementById("progressMin").value,
    progressMax: document.getElementById("progressMax").value,
    fiscalYear: document.getElementById("fiscalYearFilter").value,
    status: document.getElementById("statusFilter").value,
  };

  loadStatistics();
  document.getElementById("projectsCard").style.display = "none";
  selectedStatFilter = null;
}

function resetFilters() {
  document.getElementById("governorateFilter").selectedIndex = 0;
  document.getElementById("projectCategoryFilter").selectedIndex = 0;
  document.getElementById("fundingTypeFilter").selectedIndex = 0;
  document.getElementById("progressMin").value = "";
  document.getElementById("progressMax").value = "";
  document.getElementById("fiscalYearFilter").selectedIndex = 0;
  document.getElementById("statusFilter").selectedIndex = 0;

  currentFilters = {};
  selectedStatFilter = null;
  loadStatistics();
  document.getElementById("projectsCard").style.display = "none";
}

async function loadStatistics() {
  showLoading();
  try {
    const queryParams = buildQueryParams();
    console.log("Fetching statistics with params:", queryParams);
    const token = localStorage.getItem("loggedInUserToken");

    const response = await fetch(
      `${API_URL}activity/statistics?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // 🔑
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Statistics data received:", data);

    if (data.status === "success" || data.data) {
      renderStatsTable(data.data || data);
      document.getElementById("statsCard").style.display = "block";
      document
        .getElementById("statsCard")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.error("Error in response:", data);
      alert(
        "حدث خطأ في تحميل الإحصائيات: " + (data.message || "خطأ غير معروف")
      );
    }
  } catch (error) {
    console.error("Error loading statistics:", error);
    alert("حدث خطأ في الاتصال بالسيرفر: " + error.message);

    // Show error in table
    const tbody = document.getElementById("statsBody");
    tbody.innerHTML = `
            <tr class="default-row">
                <td colspan="7" class="text-center align-middle py-4 text-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    حدث خطأ في تحميل البيانات
                </td>
            </tr>
        `;
    // إظهار الجدول حتى لو في error
    document.getElementById("statsCard").style.display = "block";
  } finally {
    hideLoading();
  }
}

// Render Statistics Table
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
    completed: 0,
    withdrawn: 0,
    inProgress: 0,
    suspended: 0,
  };

  stats.forEach((stat, index) => {
    const row = document.createElement("tr");

    totals.totalActivities += stat.totalActivities;
    totals.completed += stat.completed;
    totals.withdrawn += stat.withdrawn;
    totals.inProgress += stat.inProgress;
    totals.suspended += stat.suspended;

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
    }', 'مكتمل')">${stat.completed || 0}</td>
    <td class="text-center align-middle clickable bg-danger bg-opacity-10" onclick="handleCellClick('${
      stat.governorate
    }', 'مسحوب')">${stat.withdrawn || 0}</td>
    <td class="text-center align-middle clickable bg-primary bg-opacity-10" onclick="handleCellClick('${
      stat.governorate
    }', 'قيد التنفيذ')">${stat.inProgress || 0}</td>
    <td class="text-center align-middle clickable bg-warning bg-opacity-10" onclick="handleCellClick('${
      stat.governorate
    }', 'متوقف')">${stat.suspended || 0}</td>
`;
    tbody.appendChild(row);
  });

  if (stats.length > 1) {
    const totalRow = document.createElement("tr");
    totalRow.className = "total-row";

    totalRow.innerHTML = `
                    <td colspan="2" class="text-center">الإجمــــــــالي</td>
                    <td class="text-center">${totals.totalActivities}</td>
                    <td class="text-center">${totals.completed}</td>
                    <td class="text-center">${totals.withdrawn}</td>
                    <td class="text-center">${totals.inProgress}</td>
                    <td class="text-center">${totals.suspended}</td>
                `;
    tbody.appendChild(totalRow);
  }
}

// Handle Row Click
function handleRowClick(governorate) {
  selectedStatFilter = { governorate: governorate, status: null };
  loadProjects();
}

// Handle Cell Click
function handleCellClick(governorate, status) {
  selectedStatFilter = { governorate: governorate, status: status };
  loadProjects();
}

// Load Projects from API
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
    console.log("🔍 Query Params:", queryParams);
    const response = await fetch(`${API_URL}activity?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("📡 Response Status:", response.status);
    const data = await response.json();
    console.log("📦 Response Data:", data);

    if (data.status === "success") {
      renderProjects(data.data.activities);
    } else {
      console.error("Error loading projects:", data.message);
      alert("حدث خطأ في تحميل المشروعات");
    }
  } catch (error) {
    console.error("Error:", error);
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
      مكتمل: "success",
      متأخر: "warning",
      مسحوب: "danger",
      متوقف: "secondary",
    };

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
            <span class="fw-bold">${activity.governorate || "غير محدد"}</span>
          </div>
          <div class="col-md-3">
            <small class="text-muted d-block">الفئة</small>
            <span class="fw-bold">${
              activity.projectCategory || "غير محدد"
            }</span>
          </div>
          <div class="col-md-3">
            <small class="text-muted d-block">نوع التمويل</small>
            <span class="fw-bold">${activity.fundingType || "غير محدد"}</span>
          </div>
          <div class="col-md-3">
            <small class="text-muted d-block">السنة المالية</small>
            <span class="fw-bold">${activity.fiscalYear || "غير محدد"}</span>
          </div>
        </div>
        
        <div class="mb-0">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <small class="text-muted">نسبة التنفيذ</small>
            <small class="fw-bold">${activity.progress || 0}%</small>
          </div>
          <div class="progress" style="height: 8px;">
            <div class="progress-bar bg-primary" role="progressbar" style="width: ${
              activity.progress || 0
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

function printStatistics() {
  const statsCard = document.getElementById("statsCard");

  if (
    statsCard.style.display === "none" ||
    !document.getElementById("statsBody").innerHTML.trim()
  ) {
    alert("⚠️ لا توجد بيانات للطباعة. قم بتطبيق الفلتر أولاً!");
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
            <th class="text-center">مكتمل</th>
            <th class="text-center">مسحوب</th>
            <th class="text-center">قيد التنفيذ</th>
            <th class="text-center">متوقف</th>
          </tr>
        </thead>
        <tbody>
          ${document.getElementById("statsBody").innerHTML}
        </tbody>
      </table>
      
      
      <script>
        window.onload = function() {
          window.print();
          // إغلاق النافذة بعد الطباعة (اختياري)
          // window.onafterprint = function() { window.close(); }
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
}
