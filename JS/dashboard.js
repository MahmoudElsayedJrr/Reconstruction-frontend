document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("projects-table-body")) {
    return;
  }

  const projectsTableBody = document.getElementById("projects-table-body");
  const chart1Container = document.getElementById("chart1-container");
  const chart2Container = document.getElementById("chart2-container");
  const chart3Container = document.getElementById("chart3-container");
  const deleteConfirmBtn = document.getElementById("confirmDeleteBtn");
  const toastContainer = document.querySelector(".toast-container");
  const filterButton = document.getElementById("filter-button");

  let codeToDelete = null;

  function getProgressBarColor(percentage, status) {
    if (status === "متأخر") return "#dc3545"; // أحمر مهما كانت النسبة
    if (percentage === 100) return "#198754"; // أخضر
    return "#0d6efd"; // أزرق
  }

  function showToast(message, type = "success") {
    if (!toastContainer) {
      console.error("Toast container not found!");
      alert(message); // fallback to alert
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

  function renderCharts() {
    const mockChartData = {
      status: { labels: ["قيد التنفيذ", "مكتمل", "متأخر"], values: [15, 9, 4] },
      governorates: {
        labels: ["الشرقية", "دمياط", "السويس", "بورسعيد"],
        values: [8, 5, 6, 4],
      },
      categories: {
        labels: [
          "طرق",
          "كهرباء",
          "مياه",
          "صرف صحي",
          "اسكان بدوي",
          "اسكان اجتماعي",
          "خدمات",
          "تنمية متكاملة",
          "حضانات",
          "مجازر",
          "تأهيل مباني حكومية",
          "آخر",
        ],
        values: [3, 5, 2, 4, 1, 6, 2, 1, 1, 1, 2, 1], // بيانات وهمية مؤقتة
      },
    };
    chart1Container.innerHTML = '<canvas id="projectStatusChart"></canvas>';
    const ctx1 = chart1Container.querySelector("canvas").getContext("2d");
    new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: mockChartData.status.labels,
        datasets: [
          {
            data: mockChartData.status.values,
            backgroundColor: ["#0d6efd", "#198754", "#dc3545"],
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
        labels: mockChartData.governorates.labels,
        datasets: [
          {
            label: "عدد المشروعات",
            data: mockChartData.governorates.values,
            backgroundColor: "#0d6efd",
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
        labels: mockChartData.categories.labels,
        datasets: [
          {
            label: "عدد المشاريع",
            data: mockChartData.categories.values,
            backgroundColor: "#20c997",
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

      // ### بداية: تم تحديث هذا الجزء ###
      row.innerHTML = `
                <td>
                    <span class="truncate-text" title="${
                      project.activityName || "مشروع بدون اسم"
                    }">
                        ${project.activityName || "مشروع بدون اسم"}
                    </span>
                </td>
                <td><span class="badge bg-light text-dark fw-normal">${
                  project.projectCategory || "غير محدد"
                }</span></td>
                <td><span class="badge bg-info bg-opacity-25 text-info-emphasis">${
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
    projectsTableBody.innerHTML = `<tr><td><p class="skeleton skeleton-text mb-0"></p></td><td><p class="skeleton skeleton-text mb-0"></p></td><td><div class="skeleton" style="height:10px; border-radius: 5px;"></div></td><td><p class="skeleton skeleton-text mb-0" style="width: 110px;"></p></td></tr>`;

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
      } else {
        renderTable([]);
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
      name: document.getElementById("projectNameFilter").value,
      governorate: document.getElementById("governorateFilter").value,
      activityCode: document.getElementById("activityCodeFilter").value,
      status: document.getElementById("statusFilter").value,
      fundingType: document.getElementById("fundingTypeFilter").value,
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
    chart1Container.innerHTML = `<span class="spinner-border text-primary"></span>`;
    chart2Container.innerHTML = `<span class="spinner-border text-primary"></span>`;
    renderCharts();
    fetchAndRenderProjects();
  }

  initializePage();
});
