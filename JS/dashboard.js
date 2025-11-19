document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("projects-table-body")) {
    return;
  }

  const projectsTableBody = document.getElementById("projects-table-body");
  const chart1Container = document.getElementById("chart1-container");
  const chart2Container = document.getElementById("chart2-container");
  const chart3Container = document.getElementById("chart3-container");
  const chart4Container = document.getElementById("chart4-container");
  const chart5Container = document.getElementById("chart5-container");
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

  async function fetchTotalDisbursed(filters = {}) {
    const totalElement = document.getElementById("totalDisbursedValue");
    try {
      const token = localStorage.getItem("loggedInUserToken");

      const queryParams = new URLSearchParams();

      if (filters.fiscalYear && filters.fiscalYear !== "الكل") {
        queryParams.append("fiscalYear", filters.fiscalYear);
      }

      const queryString = queryParams.toString();
      const url = `${API_URL}activity/total-disbursed${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiResponse = await response.json();

      if (!response.ok)
        throw new Error(apiResponse.message || "فشل جلب البيانات");

      const total = apiResponse.data.totalDisbursed || 0;
      const formattedTotal = total.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

      totalElement.textContent = formattedTotal + " مليون ج.م";
    } catch (error) {
      console.error("فشل تحميل إجمالي المنصرف", error);
      totalElement.textContent = "خطأ";
    }
  }
  async function fetchTotalContractual(filters = {}) {
    const totalElement = document.getElementById("totalContractualValue");
    try {
      const token = localStorage.getItem("loggedInUserToken");

      const queryParams = new URLSearchParams();

      if (filters.fiscalYear && filters.fiscalYear !== "الكل") {
        queryParams.append("fiscalYear", filters.fiscalYear);
      }

      const queryString = queryParams.toString();
      const url = `${API_URL}activity/total-contractualValue${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiResponse = await response.json();
      console.log(apiResponse);
      if (!response.ok)
        throw new Error(apiResponse.message || "فشل جلب البيانات");

      const total = apiResponse.data.totalContractualValue || 0;

      const formattedTotal = total.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

      totalElement.textContent = formattedTotal + " مليون ج.م";
    } catch (error) {
      console.error("فشل تحميل إجمالي المنصرف", error);
      totalElement.textContent = "خطأ";
    }
  }

  function prepareChartData(projects) {
    const statusCounts = {};
    const governorateCounts = {};
    const categoryCounts = {};
    const disbursedByCategory = {};
    const disbursedByGovernorate = {};

    projects.forEach((project) => {
      let currentStatus = project.progress >= 100 ? "مكتمل" : project.status;

      statusCounts[currentStatus] = (statusCounts[currentStatus] || 0) + 1;

      governorateCounts[project.governorate] =
        (governorateCounts[project.governorate] || 0) + 1;

      categoryCounts[project.projectCategory] =
        (categoryCounts[project.projectCategory] || 0) + 1;

      const category = project.projectCategory || "غير محدد";
      disbursedByCategory[category] =
        (disbursedByCategory[category] || 0) + (project.disbursedAmount || 0);

      const governorate = project.governorate || "غير محدد";
      disbursedByGovernorate[governorate] =
        (disbursedByGovernorate[governorate] || 0) +
        (project.disbursedAmount || 0);
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
        labels: Object.keys(disbursedByCategory),
        values: Object.values(disbursedByCategory),
      },

      disbursedByGovernorate: {
        labels: Object.keys(disbursedByGovernorate),
        values: Object.values(disbursedByGovernorate),
      },
    };
  }

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = ((i * 360) / count) % 360;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  function renderCharts(chartData) {
    chart1Container.innerHTML = '<canvas id="projectStatusChart"></canvas>';
    const ctx1 = chart1Container.querySelector("canvas").getContext("2d");

    const labelsWithCounts = chartData.status.labels.map((label, index) => {
      return `${label} (${chartData.status.values[index]})`;
    });

    new Chart(ctx1, {
      type: "bar",
      data: {
        labels: chartData.status.labels,
        datasets: [
          {
            label: "حاله المشروعات",
            data: chartData.status.values,
            backgroundColor: generateColors(chartData.status.labels.length),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.status.labels[index];
                const count = chartData.status.values[index];
                return `${label} (${count.toLocaleString()})`;
              },
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              callback: (val) => val.toLocaleString(),
            },
          },
        },
      },
      // تأكد من وجود هذا السطر إذا كنت تستخدم مكتبة datalabels
      // plugins: [ChartDataLabels],
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
            backgroundColor: generateColors(
              chartData.governorates.labels.length
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.governorates.labels[index];
                const count = chartData.governorates.values[index];
                return `${label} (${count.toLocaleString()})`;
              },
              font: { size: 11 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              callback: (val) => val.toLocaleString(),
            },
          },
        },
      },
      plugins: [ChartDataLabels],
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
            backgroundColor: generateColors(chartData.categories.labels.length),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.categories.labels[index];
                const count = chartData.categories.values[index];
                return `${label} (${count})`;
              },
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    /* chart4Container.innerHTML =
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
    }); */

    chart4Container.innerHTML =
      '<canvas id="disbursedByCategoryChart"></canvas>';
    const ctx5 = chart4Container.querySelector("canvas").getContext("2d");
    new Chart(ctx5, {
      type: "bar",
      data: {
        labels: chartData.disbursedByCategory.labels,
        datasets: [
          {
            label: "المنصرف (مليون ج.م)",
            data: chartData.disbursedByCategory.values,
            backgroundColor: generateColors(
              chartData.disbursedByCategory.labels.length
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.disbursedByCategory.labels[index];
                const amount = chartData.disbursedByCategory.values[index];
                return `${label} (${amount.toLocaleString()} مليون ج.م)`;
              },
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => val.toLocaleString() + " مليون ج.م",
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });

    chart5Container.innerHTML =
      '<canvas id="disbursedByGovernorateChart"></canvas>';
    const ctx6 = chart5Container.querySelector("canvas").getContext("2d");

    new Chart(ctx6, {
      type: "bar",
      data: {
        labels: chartData.disbursedByGovernorate.labels,
        datasets: [
          {
            label: "المنصرف (مليون ج.م)",
            data: chartData.disbursedByGovernorate.values,
            backgroundColor: generateColors(
              chartData.disbursedByGovernorate.labels.length
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.disbursedByGovernorate.labels[index];
                const amount = chartData.disbursedByGovernorate.values[index];
                return `${label} (${amount.toLocaleString()} مليون ج.م)`;
              },
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => val.toLocaleString() + " مليون ج.م",
            },
          },
        },
      },
      plugins: [ChartDataLabels],
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
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("active");

      if (sidebar.classList.contains("active")) {
        if (!document.querySelector(".sidebar-overlay")) {
          const overlay = document.createElement("div");
          overlay.className = "sidebar-overlay";
          document.body.appendChild(overlay);

          overlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.remove();
          });
        }
      } else {
        const overlay = document.querySelector(".sidebar-overlay");
        if (overlay) overlay.remove();
      }
    });

    const navLinks = document.querySelectorAll(".sidebar .nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active");
          const overlay = document.querySelector(".sidebar-overlay");
          if (overlay) overlay.remove();
        }
      });
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
        console.log("لا توجد بيانات مشاريع");
        renderTable([]);
        renderCharts({
          status: { labels: [], values: [] },
          governorates: { labels: [], values: [] },
          categories: { labels: [], values: [] },
          disbursedByCategory: { labels: [], values: [] },
        });
      }
    } catch (error) {
      console.error(" فشل تحميل البيانات:", error);
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
      disbursedPercentageMin:
        document.getElementById("disbursedPercentageMin").value || 0,
      disbursedPercentageMax:
        document.getElementById("disbursedPercentageMax").value || 100,
    };

    Object.keys(filters).forEach((key) => {
      if (!filters[key] || filters[key] === "الكل") delete filters[key];
    });
    localStorage.setItem("dashboardFilters", JSON.stringify(filters));
    Promise.all([
      fetchAndRenderProjects(filters),
      fetchTotalDisbursed(filters),
      fetchTotalContractual(filters),
    ]).finally(() => {
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
      window.location.reload();
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

  function restoreFilters() {
    const savedFilters = localStorage.getItem("dashboardFilters");
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);

      if (filters.name)
        document.getElementById("projectNameFilter").value = filters.name;
      if (filters.governorate)
        document.getElementById("governorateFilter").value =
          filters.governorate;
      if (filters.activityCode)
        document.getElementById("activityCodeFilter").value =
          filters.activityCode;
      if (filters.status)
        document.getElementById("statusFilter").value = filters.status;
      if (filters.fundingType)
        document.getElementById("fundingTypeFilter").value =
          filters.fundingType;
      if (filters.fiscalYear)
        document.getElementById("fiscalYearFilter").value = filters.fiscalYear;
      if (filters.projectCategory)
        document.getElementById("projectCategoryFilter").value =
          filters.projectCategory;
      if (filters.progressMin !== undefined)
        document.getElementById("progressMin").value = filters.progressMin;
      if (filters.progressMax !== undefined)
        document.getElementById("progressMax").value = filters.progressMax;

      return filters;
    }
    return {};
  }

  function initializePage() {
    const filters = restoreFilters();
    fetchTotalDisbursed(filters);
    fetchTotalContractual(filters);
    fetchAndRenderProjects(filters);
  }

  initializePage();
});
