document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("projects-table-body")) {
    return;
  }

  document
    .getElementById("sharedFiscalYear")
    ?.addEventListener("change", applySharedFilters);
  document
    .getElementById("sharedFundingType")
    ?.addEventListener("change", applySharedFilters);
  document
    .getElementById("applyFilters")
    ?.addEventListener("click", applySharedFilters);

  const projectsTableBody = document.getElementById("projects-table-body");
  const chart1Container = document.getElementById("chart1-container");
  const chart2Container = document.getElementById("chart2-container");
  const chart3Container = document.getElementById("chart3-container");
  const chart4Container = document.getElementById("chart4-container");
  const chart5Container = document.getElementById("chart5-container");
  const deleteConfirmBtn = document.getElementById("confirmDeleteBtn");
  const toastContainer = document.querySelector(".toast-container");
  const filterButton = document.getElementById("filter-button");
  const resetButton = document.getElementById("reset-button");

  let codeToDelete = null;
  let currentFilters = {}; // ← متغير خارجي لحفظ الفلاتر الحالية

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

  function resetFilters() {
    const allFilterIDs = [
      "activityCodeFilter",
      "projectNameFilter",
      "governorateFilter",
      "projectCategoryFilter",
      "fundingTypeFilter",
      "fundingSourceFilter",
      "fiscalYearFilter",
      "statusFilter",
      "progressMin",
      "progressMax",
      "disbursedPercentageMin",
      "disbursedPercentageMax",
    ];

    allFilterIDs.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        if (element.tagName === "INPUT") {
          element.value = "";
        } else if (element.tagName === "SELECT") {
          element.value = element.options[0].value;
        }
      }
    });

    localStorage.removeItem("dashboardFilters");
    filterButton.click();
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetFilters);
  }

  async function applySharedFilters() {
    const fiscalYear = document.getElementById("sharedFiscalYear").value;
    const fundingType = document.getElementById("sharedFundingType").value;

    if (!fiscalYear) {
      showFilterMessage("totalBudgetValue", "اختر السنة المالية");
      showFilterMessage("payoutPercentageValue", "اختر السنة المالية");
      return;
    }

    if (!fundingType) {
      showFilterMessage("totalBudgetValue", "اختر نوع التمويل");
      showFilterMessage("payoutPercentageValue", "اختر نوع التمويل");
      return;
    }

    const sharedFilters = {
      fiscalYear: fiscalYear,
      fundingType: fundingType,
    };
    localStorage.setItem(
      "dashboardSharedFilters",
      JSON.stringify(sharedFilters),
    );

    await Promise.all([
      loadBudgetForYear(fiscalYear, fundingType),
      fetchPayoutPercentage(fiscalYear, fundingType),
    ]);
  }

  function showFilterMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<small style="color: white;">${message}</small>`;
    }
  }

  async function fetchTotalDisbursed(filters = {}) {
    const totalElement = document.getElementById("totalDisbursedValue");
    try {
      const token = localStorage.getItem("loggedInUserToken");
      const queryParams = new URLSearchParams();

      for (const key in filters) {
        const value = filters[key];
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          value !== "الكل"
        ) {
          queryParams.append(key, value);
        }
      }

      const queryString = queryParams.toString();
      const url = `${API_URL}activity/total-disbursed${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiResponse = await response.json();

      if (!response.ok)
        throw new Error(apiResponse.message || "فشل جلب البيانات");

      const total = apiResponse.data.totalDisbursed || 0;
      console.log("Total disbursed:", total);
      totalElement.textContent = formatMoneyAdvanced(total);
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

      for (const key in filters) {
        const value = filters[key];
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          value !== "الكل"
        ) {
          queryParams.append(key, value);
        }
      }

      const queryString = queryParams.toString();
      const url = `${API_URL}activity/total-contractualValue${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiResponse = await response.json();

      if (!response.ok)
        throw new Error(apiResponse.message || "فشل جلب البيانات");

      const total = apiResponse.data.totalContractualValue || 0;
      totalElement.textContent = formatMoneyAdvanced(total);
    } catch (error) {
      console.error("فشل تحميل إجمالي التعاقدي", error);
      totalElement.textContent = "خطأ";
    }
  }

  async function loadBudgetForYear(fiscalYear, fundingType) {
    const token = localStorage.getItem("loggedInUserToken");
    const budgetElement = document.getElementById("totalBudgetValue");

    budgetElement.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span>';

    try {
      const response = await fetch(
        `${API_URL}budget/${encodeURIComponent(fiscalYear)}/${encodeURIComponent(fundingType)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const apiResponse = await response.json();

      if (apiResponse.status === "success" && apiResponse.data) {
        budgetElement.textContent = formatMoneyAdvanced(
          apiResponse.data.amount,
        );
        budgetElement.className = "text-primary fw-bold";
      } else {
        budgetElement.textContent = "٠ ج.م";
        budgetElement.className = "text-primary fw-bold";
      }
    } catch (error) {
      console.error("خطأ في تحميل الميزانية:", error);
      budgetElement.innerHTML =
        '<small class="text-danger">خطأ في التحميل</small>';
    }
  }

  async function fetchPayoutPercentage(fiscalYear, fundingType) {
    const percentageElement = document.getElementById("payoutPercentageValue");
    const detailsElement = document.getElementById("payoutDetails");

    percentageElement.innerHTML =
      '<span class="spinner-border spinner-border-sm"></span>';
    if (detailsElement) detailsElement.innerHTML = "";

    try {
      const token = localStorage.getItem("loggedInUserToken");
      const queryParams = new URLSearchParams();

      // 1. إضافة الفلاتر الأساسية الإلزامية
      queryParams.append("fiscalYear", fiscalYear);
      queryParams.append("fundingType", fundingType);

      // 2. 👇 الجزء السحري: جلب الفلاتر الحالية المحددة في الصفحة (مثل المحافظة وباقي العناصر)
      // قمنا بوضع كل الـ IDs للفلاتر المتاحة في لوحة التحكم لديك
      const filterIds = [
        "projectNameFilter",
        "governorateFilter", // 👈 فلتر المحافظة (الإسماعيلية مثلاً)
        "activityCodeFilter",
        "statusFilter",
        "fundingSourceFilter",
        "hasContractFilter",
        "hasExtensionFilter",
        "projectCategoryFilter",
        "progressMin",
        "progressMax",
        "disbursedPercentageMin",
        "disbursedPercentageMax",
      ];

      filterIds.forEach((id) => {
        const element = document.getElementById(id);
        // إذا كان العنصر موجوداً وله قيمة ومختار قيمة فعلية (ليست فارغة)
        if (element && element.value && element.value !== "") {
          // نقوم بتحويل الـ ID إلى اسم الفلتر المتوقع في الباك إند (عن طريق إزالة كلمة Filter من نهايته)
          const queryKey = id.replace("Filter", "");
          queryParams.append(queryKey, element.value);
        }
      });

      // 3. إرسال الطلب بالرابط الجديد المليء بالفلاتر كاملة
      const response = await fetch(
        `${API_URL}activity/payout-percentage?${queryParams.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const apiResponse = await response.json();
      if (!response.ok)
        throw new Error(apiResponse.message || "فشل جلب البيانات");

      const { percentage, status, budget, totalDisbursed } = apiResponse.data;

      percentageElement.textContent =
        percentage.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + "%";

      const colorMap = {
        exceeded: "text-danger",
        high: "text-warning",
        medium: "text-info",
        low: "text-success",
      };
      percentageElement.className = `${colorMap[status]} fw-bold`;
    } catch (error) {
      console.error("خطأ في حساب نسبة الصرف:", error);
      percentageElement.innerHTML =
        '<small class="text-danger">خطأ في الحساب</small>';
    }
  }

  function prepareChartData(projects, filters = {}) {
    const statusCounts = {};
    const governorateCounts = {};
    const categoryCounts = {};
    const disbursedByCategory = {};
    const disbursedByGovernorate = {};

    const statusOrder = [
      "تحت الطرح",
      "قيد التنفيذ",
      "متعثرة",
      "متأخر",
      "مسحوب",
      "متوقف",
      "يحتاج مد مده",
      "مكتمل",
      "تسليم ابتدائي",
      "تسليم نهائي",
    ].reverse();

    projects.forEach((project) => {
      const status = project.status || "غير محدد";
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      const governorate = project.governorate || "غير محدد";
      governorateCounts[governorate] =
        (governorateCounts[governorate] || 0) + 1;

      const category = project.projectCategory || "غير محدد";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;

      const extracts = project.extract || [];
      let disbursedAmount = 0;

      if (filters?.fiscalYear && filters.fiscalYear !== "الكل") {
        disbursedAmount = extracts
          .filter((e) => e.extractFiscalYear === filters.fiscalYear)
          .reduce((sum, e) => sum + (e.extractValue || 0), 0);
      } else {
        disbursedAmount = parseFloat(project.disbursedAmount) || 0;
      }

      disbursedByCategory[category] =
        (disbursedByCategory[category] || 0) + disbursedAmount;
      disbursedByGovernorate[governorate] =
        (disbursedByGovernorate[governorate] || 0) + disbursedAmount;
    });

    const sortedStatusLabels = [];
    const sortedStatusValues = [];

    statusOrder.forEach((status) => {
      if (statusCounts[status] !== undefined) {
        sortedStatusLabels.push(status);
        sortedStatusValues.push(statusCounts[status]);
      }
    });

    Object.keys(statusCounts).forEach((status) => {
      if (!statusOrder.includes(status)) {
        sortedStatusLabels.push(status);
        sortedStatusValues.push(statusCounts[status]);
      }
    });

    return {
      status: { labels: sortedStatusLabels, values: sortedStatusValues },
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
        values: [...Object.values(disbursedByCategory)],
      },
      disbursedByGovernorate: {
        labels: Object.keys(disbursedByGovernorate),
        values: [...Object.values(disbursedByGovernorate)],
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
          legend: { display: true },
          datalabels: { display: false },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.status.labels[index];
                const count = chartData.status.values[index];
                return [label, count.toLocaleString()];
              },
              font: { size: 12 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: { precision: 0, callback: (val) => val.toLocaleString() },
          },
        },
      },
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
              chartData.governorates.labels.length,
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          datalabels: { display: false },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.governorates.labels[index];
                const count = chartData.governorates.values[index];
                return [label, count.toLocaleString()];
              },
              font: { size: 11 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: { precision: 0, callback: (val) => val.toLocaleString() },
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
          datalabels: { display: false },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.categories.labels[index];
                const count = chartData.categories.values[index];
                return [label, count.toLocaleString()];
              },
              font: { size: 11 },
            },
          },
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
      plugins: [ChartDataLabels],
    });

    chart4Container.innerHTML =
      '<canvas id="disbursedByCategoryChart"></canvas>';
    const ctx5 = chart4Container.querySelector("canvas").getContext("2d");
    new Chart(ctx5, {
      type: "bar",
      data: {
        labels: chartData.disbursedByCategory.labels,
        datasets: [
          {
            label: "المنصرف حسب الفئه",
            data: chartData.disbursedByCategory.values,
            backgroundColor: generateColors(
              chartData.disbursedByCategory.labels.length,
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${formatMoneyAdvanced(context.raw)}`;
              },
            },
          },
          datalabels: { display: false },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.disbursedByCategory.labels[index];
                const amount = chartData.disbursedByCategory.values[index];
                return [label, formatMoneyAdvanced(amount)];
              },
              font: { size: 11 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: { callback: (value) => formatMoneyAdvanced(value) },
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
            label: "المنصرف حسب المنطقة",
            data: chartData.disbursedByGovernorate.values,
            backgroundColor: generateColors(
              chartData.disbursedByGovernorate.labels.length,
            ),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${formatMoneyAdvanced(context.raw)}`;
              },
            },
          },
          datalabels: { display: false },
        },
        scales: {
          x: {
            ticks: {
              callback: function (value, index) {
                const label = chartData.disbursedByGovernorate.labels[index];
                const amount = chartData.disbursedByGovernorate.values[index];
                return [label, formatMoneyAdvanced(amount)];
              },
              font: { size: 11 },
            },
          },
          y: {
            beginAtZero: true,
            ticks: { callback: (value) => formatMoneyAdvanced(value) },
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
      projectsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">لا توجد مشاريع تطابق البحث.</td></tr>`;
      return;
    }

    const reversedProjects = projects.slice().reverse();
    reversedProjects.forEach((project) => {
      const row = document.createElement("tr");
      const percentage = parseFloat(project.progress) || 0;
      const barColor = getProgressBarColor(percentage, project.status);

      row.innerHTML = `
        <td><span class="badge bg-info bg-opacity-25 text-info-emphasis">${project.activityCode || "غير محدد"}</span></td>
        <td>
          <span class="truncate-text" title="${project.activityName || "مشروع بدون اسم"}">
            ${project.activityName || "مشروع بدون اسم"}
          </span>
        </td>
        <td><span class="badge bg-light text-dark">${project.projectCategory || "غير محدد"}</span></td>
        <td><span class="badge bg-light text-dark">${project.fundingType || "غير محدد"}</span></td>
        <td>
          <div class="progress" role="progressbar" style="height: 20px; font-size: 0.6rem;">
            ${
              percentage > 0
                ? `
              <div class="progress-bar fw-bold"
                style="width: ${percentage}%; min-width: 16px; background-color: ${barColor}; text-align: center; white-space: nowrap; overflow: hidden;">
                ${percentage}%
              </div>
            `
                : ""
            }
          </div>
        </td>
        <td>
          <a href="project-details.html?code=${project.activityCode}" class="action-btn" title="عرض التفاصيل"><i class="fas fa-eye text-info"></i></a>
          <a href="edit-project.html?code=${project.activityCode}" class="action-btn" title="تعديل"><i class="fas fa-pen text-primary"></i></a>
          <button class="action-btn delete-btn" data-code="${project.activityCode}" title="حذف" data-bs-toggle="modal" data-bs-target="#deleteConfirmationModal"><i class="fas fa-trash text-danger"></i></button>
        </td>
      `;
      projectsTableBody.appendChild(row);
    });
  }

  function displayErrorInTable(message) {
    projectsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger p-4">${message}</td></tr>`;
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
      <td><p class="skeleton skeleton-text mb-0" style="width: 110px;"></p></td>
    </tr>`;

    chart1Container.innerHTML = `<span class="spinner-border text-primary"></span>`;
    chart2Container.innerHTML = `<span class="spinner-border text-primary"></span>`;
    chart3Container.innerHTML = `<span class="spinner-border text-primary"></span>`;
    chart4Container.innerHTML = `<span class="spinner-border text-primary"></span>`;
    chart5Container.innerHTML = `<span class="spinner-border text-primary"></span>`;

    try {
      const token = localStorage.getItem("loggedInUserToken");
      const queryParams = new URLSearchParams();

      for (const key in filters) {
        const value = filters[key];
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          value !== "الكل"
        ) {
          queryParams.append(key, value);
        }
      }

      const fetchUrl = `${API_URL}activity?${queryParams.toString()}`;
      const response = await fetch(fetchUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiResponse = await response.json();
      if (!response.ok) {
        throw new Error(
          apiResponse.data || apiResponse.message || "فشل جلب البيانات",
        );
      }

      if (
        apiResponse?.data?.activities &&
        Array.isArray(apiResponse.data.activities)
      ) {
        console.log("Number of projects:", apiResponse.data.activities.length);
        renderTable(apiResponse.data.activities);
        const chartData = prepareChartData(
          apiResponse.data.activities,
          filters,
        );
        renderCharts(chartData);
      } else {
        console.log("لا توجد بيانات مشاريع");
        renderTable([]);
        renderCharts({
          status: { labels: [], values: [] },
          governorates: { labels: [], values: [] },
          categories: { labels: [], values: [] },
          disbursedByCategory: { labels: [], values: [] },
          disbursedByGovernorate: { labels: [], values: [] },
        });
      }
    } catch (error) {
      console.error("فشل تحميل البيانات:", error);
      displayErrorInTable(error.message);
    }
  }

  filterButton.addEventListener("click", () => {
    const scrollPosition = window.scrollY;
    filterButton.disabled = true;
    filterButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;

    const filters = {
      name: document.getElementById("projectNameFilter")?.value || "",
      governorate: document.getElementById("governorateFilter")?.value || "",
      activityCode: document.getElementById("activityCodeFilter")?.value || "",
      status: document.getElementById("statusFilter")?.value || "",
      fundingType: document.getElementById("fundingTypeFilter")?.value || "",
      hasContract: document.getElementById("hasContractFilter")?.value || "",
      hasExtension: document.getElementById("hasExtensionFilter")?.value || "",
      fundingSource:
        document.getElementById("fundingSourceFilter")?.value || "",
      fiscalYear: document.getElementById("fiscalYearFilter")?.value || "",
      projectCategory:
        document.getElementById("projectCategoryFilter")?.value || "",
      progressMin: document.getElementById("progressMin")?.value || "",
      progressMax: document.getElementById("progressMax")?.value || "",
      disbursedPercentageMin:
        document.getElementById("disbursedPercentageMin")?.value || "",
      disbursedPercentageMax:
        document.getElementById("disbursedPercentageMax")?.value || "",
    };

    Object.keys(filters).forEach((key) => {
      if (
        filters[key] === "" ||
        filters[key] === "الكل" ||
        filters[key] === null ||
        filters[key] === undefined
      ) {
        delete filters[key];
      }
    });

    currentFilters = filters; // ← حفظ الفلاتر الحالية
    console.log("Filters to apply:", filters);
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

      const savedFilters = JSON.parse(
        localStorage.getItem("dashboardFilters") || "{}",
      );

      const savedSharedFilters = JSON.parse(
        localStorage.getItem("dashboardSharedFilters") || "{}",
      );

      await fetchAndRenderProjects(savedFilters);
      await fetchTotalDisbursed(savedFilters);
      await fetchTotalContractual(savedFilters);
      await loadBudgetForYear(
        savedSharedFilters.fiscalYear,
        savedSharedFilters.fundingType,
      );
      await fetchPayoutPercentage(
        savedSharedFilters.fiscalYear,
        savedSharedFilters.fundingType,
      );
    } catch (error) {
      showToast(`Error: ${error.message}`, "danger");
    } finally {
      const modalElement = document.getElementById("deleteConfirmationModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
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
      if (filters.fundingSource)
        document.getElementById("fundingSourceFilter").value =
          filters.fundingSource;
      if (filters.hasContract)
        document.getElementById("hasContractFilter").value =
          filters.hasContract;
      if (filters.hasExtension)
        document.getElementById("hasExtensionFilter").value =
          filters.hasExtension;
      if (filters.fiscalYear)
        document.getElementById("fiscalYearFilter").value = filters.fiscalYear;
      if (filters.projectCategory)
        document.getElementById("projectCategoryFilter").value =
          filters.projectCategory;
      if (filters.progressMin !== undefined)
        document.getElementById("progressMin").value = filters.progressMin;
      if (filters.progressMax !== undefined)
        document.getElementById("progressMax").value = filters.progressMax;
      if (filters.disbursedPercentageMin !== undefined)
        document.getElementById("disbursedPercentageMin").value =
          filters.disbursedPercentageMin;
      if (filters.disbursedPercentageMax !== undefined)
        document.getElementById("disbursedPercentageMax").value =
          filters.disbursedPercentageMax;

      return filters;
    }
    return {};
  }

  function initializePage() {
    const filters = restoreFilters();
    currentFilters = filters;
    fetchTotalDisbursed(filters);
    fetchTotalContractual(filters);
    fetchAndRenderProjects(filters);
  }

  initializePage();
});
