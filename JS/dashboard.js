document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("projects-table-body")) {
    return;
  }

  const projectsTableBody = document.getElementById("projects-table-body");
  const chart1Container = document.getElementById("chart1-container");
  const chart2Container = document.getElementById("chart2-container");
  const chart3Container = document.getElementById("chart3-container");
  const chart4Container = document.getElementById("chart4-container");
  const deleteConfirmBtn = document.getElementById("confirmDeleteBtn");
  const toastContainer = document.querySelector(".toast-container");
  const filterButton = document.getElementById("filter-button");

  let codeToDelete = null;

  function getProgressBarColor(percentage, status) {
    if (status === "متأخر") return "#dc3545";
    if (status === "متوقف") return "#d15d26ff";
    if (status === "مسحوب") return "#ffc107";
    if (percentage === 100 || status === "مكتمل") return "#198754";
    return "#0d6efd";
  }

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

  async function fetchTotalDisbursed() {
    const totalElement = document.getElementById("totalDisbursedValue");
    try {
      const token = localStorage.getItem("loggedInUserToken");
      const response = await fetch(`${API_URL}activity/total-disbursed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiResponse = await response.json();
      if (!response.ok)
        throw new Error(apiResponse.message || "فشل جلب البيانات");

      const total = apiResponse.data.totalDisbursed || 0;

      // تنسيق الرقم (يفصل الآلاف ويحط "ج.م")
      totalElement.textContent = total.toLocaleString("ar-EG") + " ج.م";
    } catch (error) {
      console.error("❌ فشل تحميل إجمالي المنصرف:", error);
      totalElement.textContent = "خطأ";
    }
  }

  function prepareChartData(projects) {
    const statusCounts = {};
    const governorateCounts = {};
    const categoryCounts = {};
    const disbursedByCategory = {}; // جديد

    projects.forEach((project) => {
      let currentStatus = project.progress >= 100 ? "مكتمل" : project.status;

      // الحالة
      statusCounts[currentStatus] = (statusCounts[currentStatus] || 0) + 1;

      // المحافظات
      governorateCounts[project.governorate] =
        (governorateCounts[project.governorate] || 0) + 1;

      // الفئات (عدد المشاريع)
      categoryCounts[project.projectCategory] =
        (categoryCounts[project.projectCategory] || 0) + 1;

      // المنصرف حسب الفئة
      const category = project.projectCategory || "غير محدد";
      disbursedByCategory[category] =
        (disbursedByCategory[category] || 0) + (project.disbursedAmount || 0);
    });

    return {
      status: {
        labels: Object.keys(statusCounts),
        values: Object.values(statusCounts),
      },
      governorates: {
        labels: Object.keys(governorateCounts),
        values: Object.values(governorateCounts),
      },
      categories: {
        labels: Object.keys(categoryCounts),
        values: Object.values(categoryCounts),
      },
      disbursedByCategory: {
        // لازم ترجعها عشان الشارت يشتغل
        labels: Object.keys(disbursedByCategory),
        values: Object.values(disbursedByCategory),
      },
    };
  }

  function renderCharts(chartData) {
    //console.log("📊 Rendering charts with data:", chartData);
    chart1Container.innerHTML = '<canvas id="projectStatusChart"></canvas>';
    const ctx1 = chart1Container.querySelector("canvas").getContext("2d");
    new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: chartData.status.labels,
        datasets: [
          {
            data: chartData.status.values,
            backgroundColor: chartData.status.labels.map((label) => {
              switch (label) {
                case "مكتمل":
                  return "#198754";
                case "متأخر":
                  return "#d15d26ff";
                case "متوقف":
                  return "#dc3545";
                case "قيد التنفيذ":
                  return "#0d6efd";
                case "مسحوب":
                  return "#ffc107";
                default:
                  return "#6c757d";
              }
            }),
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    chart2Container.innerHTML =
      '<canvas id="projectsByGovernorateChart"></canvas>';
    const ctx2 = chart2Container.querySelector("canvas").getContext("2d");
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: chartData.governorates.labels,
        datasets: [
          {
            label: "عدد المشروعات",
            data: chartData.governorates.values,
            backgroundColor: "#3966aaff",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    chart3Container.innerHTML = '<canvas id="projectCategoryChart"></canvas>';
    const ctx3 = chart3Container.querySelector("canvas").getContext("2d");
    new Chart(ctx3, {
      type: "bar",
      data: {
        labels: chartData.categories.labels,
        datasets: [
          {
            label: "عدد المشاريع",
            data: chartData.categories.values,
            backgroundColor: "#afb2dbff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
      },
    });

    // ✅ الشارت الخامس: المنصرف حسب الفئة
    chart4Container.innerHTML =
      '<canvas id="disbursedByCategoryChart"></canvas>';
    const ctx5 = chart4Container.querySelector("canvas").getContext("2d");
    new Chart(ctx5, {
      type: "bar",
      data: {
        labels: chartData.disbursedByCategory.labels,
        datasets: [
          {
            label: "المنصرف (ج.م)",
            data: chartData.disbursedByCategory.values,
            backgroundColor: "#0dcaf0",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => val.toLocaleString() + " ج.م",
            },
          },
        },
      },
    });
  }

  function renderTable(projects) {
    const projectsTableBody = document.getElementById("projects-table-body");
    projectsTableBody.innerHTML = "";
    if (!projects || projects.length === 0) {
      projectsTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">لا توجد مشاريع تطابق البحث.</td></tr>`;
      return;
    }

    projects.reverse().forEach((project) => {
      const row = document.createElement("tr");
      const percentage = project.progress || 0;
      const barColor = getProgressBarColor(percentage, project.status);

      row.innerHTML = `
                <td><span class="badge bg-info bg-opacity-25 text-info-emphasis">${
                  project.activityCode || "غير محدد"
                }</span></td>
                <td>
                    <span class="truncate-text" title="${
                      project.activityName || "مشروع بدون اسم"
                    }">
                        ${project.activityName || "مشروع بدون اسم"}
                    </span>
                </td>
                <td><span class="badge bg-light text-dark">${
                  project.projectCategory || "غير محدد"
                }</span></td>
                <td><span class="badge bg-light text-dark">${
                  project.fundingType || "غير محدد"
                }</span></td>
                <td>
                  <div class="progress" role="progressbar" style="height: 20px; font-size: 0.6rem;">
                    ${
                      percentage > 0
                        ? `
                      <div class="progress-bar fw-bold"
                          style="
                            width: ${percentage}%;
                            min-width: 16px;
                            background-color: ${barColor};
                            text-align: center;
                            white-space: nowrap;
                            overflow: hidden;">
                        ${percentage}%
                      </div>
                    `
                        : ""
                    }
                  </div>
              </td>
                <td>
                    <a href="project-details.html?code=${
                      project.activityCode
                    }" class="action-btn" title="عرض التفاصيل"><i class="fas fa-eye text-info"></i></a>
                    <a href="edit-project.html?code=${
                      project.activityCode
                    }" class="action-btn" title="تعديل"><i class="fas fa-pen text-primary"></i></a>
                    <button class="action-btn delete-btn" data-code="${
                      project.activityCode
                    }" title="حذف" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal"><i class="fas fa-trash text-danger"></i></button>
                </td>
            `;

      projectsTableBody.appendChild(row);
    });
  }
  function displayErrorInTable(message) {
    projectsTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger p-4">${message}</td></tr>`;
  }

  const toggleBtn = document.getElementById("toggle-sidebar");
  const sidebar = document.querySelector(".sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      document.body.classList.toggle("sidebar-open");
    });

    document.addEventListener("click", (e) => {
      if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target)
      ) {
        sidebar.classList.remove("open");
        document.body.classList.remove("sidebar-open");
      }
    });
  }

  async function fetchAndRenderProjects(filters = {}) {
    projectsTableBody.innerHTML = `<tr>
    <td><p class="skeleton skeleton-text mb-0"></p></td>
    <td><p class="skeleton skeleton-text mb-0"></p></td>
    <td><div class="skeleton" style="height:10px; border-radius: 5px;"></div></td>
    <td><p class="skeleton skeleton-text mb-0" style="width: 110px;"></p></td></tr>`;

    chart1Container.innerHTML = `<span class="spinner-border text-primary"></span>`;
    chart2Container.innerHTML = `<span class="spinner-border text-primary"></span>`;
    chart3Container.innerHTML = `<span class="spinner-border text-primary"></span>`;
    chart4Container.innerHTML = `<span class="spinner-border text-primary"></span>`;

    try {
      const token = localStorage.getItem("loggedInUserToken");

      const queryParams = new URLSearchParams(filters).toString();
      const fetchUrl = `${API_URL}activity?${queryParams}`;

      const response = await fetch(fetchUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiResponse = await response.json();
      // console.log("📦 Response data:", apiResponse);

      if (!response.ok) {
        throw new Error(apiResponse.data || "فشل جلب البيانات");
      }

      if (
        apiResponse &&
        apiResponse.data &&
        Array.isArray(apiResponse.data.activities)
      ) {
        renderTable(apiResponse.data.activities);
        const chartData = prepareChartData(apiResponse.data.activities);
        renderCharts(chartData);
      } else {
        console.log("⚠️ لا توجد بيانات مشاريع");
        renderTable([]);
        renderCharts({
          status: { labels: [], values: [] },
          governorates: { labels: [], values: [] },
          categories: { labels: [], values: [] },
          disbursedByCategory: { labels: [], values: [] },
        });
      }
    } catch (error) {
      console.error("❌ فشل تحميل البيانات:", error);
      displayErrorInTable(error.message);
    }
  }

  filterButton.addEventListener("click", () => {
    const scrollPosition = window.scrollY;

    filterButton.disabled = true;
    filterButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;

    const filters = {
      name: document.getElementById("projectNameFilter").value,
      governorate: document.getElementById("governorateFilter").value,
      activityCode: document.getElementById("activityCodeFilter").value,
      status: document.getElementById("statusFilter").value,
      fundingType: document.getElementById("fundingTypeFilter").value,
      fiscalYear: document.getElementById("fiscalYearFilter").value,
      projectCategory: document.getElementById("projectCategoryFilter").value,
      progressMin: document.getElementById("progressMin").value || 0,
      progressMax: document.getElementById("progressMax").value || 100,
    };

    Object.keys(filters).forEach((key) => {
      if (!filters[key] || filters[key] === "الكل") delete filters[key];
    });

    fetchAndRenderProjects(filters).finally(() => {
      filterButton.disabled = false;
      filterButton.innerHTML = `<i class="fas fa-filter"></i>`;
      window.scrollTo(0, scrollPosition);
    });
  });

  projectsTableBody.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-btn");
    if (deleteButton) {
      codeToDelete = deleteButton.dataset.code;
    }
  });

  deleteConfirmBtn.addEventListener("click", async () => {
    if (!codeToDelete) return;
    const token = localStorage.getItem("loggedInUserToken");
    try {
      const response = await fetch(`${API_URL}activity/${codeToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.data || result.message || "فشل حذف المشروع.");
      showToast("تم حذف المشروع بنجاح!", "success");
      fetchAndRenderProjects();
    } catch (error) {
      showToast(`Error: ${error.message}`, "danger");
    } finally {
      const modalElement = document.getElementById("deleteConfirmationModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
      codeToDelete = null;
    }
  });

  function initializePage() {
    fetchAndRenderProjects();
    fetchTotalDisbursed();
  }

  initializePage();
});
