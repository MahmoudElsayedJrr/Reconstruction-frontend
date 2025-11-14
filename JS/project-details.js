document.addEventListener("DOMContentLoaded", () => {
  const projectNameHeader = document.getElementById("project-name-header");
  if (!projectNameHeader) return;
  const contractualTabContainer = document.getElementById(
    "contractual-pdf-section"
  );
  const urlParams = new URLSearchParams(window.location.search);
  const mainContent = document.querySelector(".main-content");
  const mediaTabContent = document.getElementById("media-tab");
  const token = localStorage.getItem("loggedInUserToken");
  const fromPage = urlParams.get("from");
  const activityCode = new URLSearchParams(window.location.search).get("code");
  const API_BASE_URL = API_URL;

  const backButton = document.querySelector(
    '.btn-outline-primary[href*="dashboard.html"]'
  );
  if (backButton) {
    if (fromPage === "filter") {
      backButton.href = "../html/reportsPage.html";
      backButton.innerHTML =
        '<i class="fas fa-arrow-right ms-0"></i> العودة للإحصائيات';
    } else {
      backButton.href = "../html/dashboard.html";
      backButton.innerHTML =
        '<i class="fas fa-arrow-right ms-0"></i> العودة للوحة التحكم';
    }
  }

  let mediaToDelete = { type: null, path: null };

  window.openPDFModal = function (pdfUrl) {
    const pdfViewer = document.getElementById("pdfViewer");
    pdfViewer.src = pdfUrl;

    const pdfModal = new bootstrap.Modal(document.getElementById("pdfModal"));
    pdfModal.show();
  };

  function showToast(message, type = "success") {
    const toastContainer = document.querySelector(".toast-container");
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
    toast.show();
  }

  function deleteDecision(BaseUrl, activityCode, decisionId, showToast) {
    const confirmModal = bootstrap.Modal.getOrCreateInstance(
      document.getElementById("confirmDeleteModal")
    );
    confirmModal.show();

    const confirmBtn = document.getElementById("confirmDeleteMediaBtn");
    const handleConfirm = async () => {
      try {
        const response = await fetch(
          `${BaseUrl}activity/decision/${activityCode}/${decisionId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("فشل في حذف البند");
        }
        confirmModal.hide();
        showToast("تم حذف البند بنجاح");
        window.location.reload();
      } catch (err) {
        showToast(err.message, "danger");
      }
      confirmBtn.removeEventListener("click", handleConfirm);
    };
    confirmBtn.addEventListener("click", handleConfirm, { once: true });
  }

  function displayError(message) {
    projectNameHeader.textContent = "حدث خطأ";
    const cardBody = document.querySelector(".card-body");
    if (cardBody) {
      cardBody.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
  }

  const dateFields = [
    "completionDate",
    "assignmentDate",
    "siteHandoverDate",
    "assignmentOrderDate",
    "financialDecisionDate",
    "technicalDecisionDate",
    "publishDate",
    "extensionDate",
    "suspensionDate",
    "resumptionDate",
  ];

  function renderProjectDetails(project) {
    projectNameHeader.textContent = `تفاصيل مشروع: ${project.activityName}`;
    const roadTabNav = document.getElementById("road-tab-nav");
    const isRoadProject = project.projectCategory === "طرق";
    if (isRoadProject) {
      roadTabNav.style.display = "block";
    } else {
      roadTabNav.style.display = "none";
    }
    const setText = (id, value, fallback = "N/A") => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || fallback;
    };

    const contracts = project.contract || [];
    const extracts = project.extract || [];

    setText("extractValue", extracts.length.toString());
    setText("contractNumber", contracts.length.toString());
    const extensions = project.extension || [];
    const lastExtension =
      extensions.length > 0 ? extensions[extensions.length - 1] : null;

    setText(
      "extensionNumber",
      extensions.length === 0 ? 0 : (extensions.length - 1).toString()
    );
    setText("contractNumber", contracts.length.toString());
    setText(
      "lastExtensionDate",
      lastExtension?.extensionDate
        ? new Date(lastExtension.extensionDate).toLocaleDateString("ar-EG")
        : "N/A"
    );
    setText("activityCode", project.activityCode);
    setText("fiscalYear", project.fiscalYear);
    setText("executingCompany", project.executingCompany);
    setText("governorate", project.governorate);
    setText("consultant", project.consultant);
    setText("fundingType", project.fundingType);
    setText("projectCategory", project.projectCategory);
    setText("progress", ` % ${project.progress} `);
    setText(
      "estimatedValue",
      (project.estimatedValue || 0).toLocaleString() + " جنيه"
    );
    setText(
      "contractualValue",
      (project.contractualValue || 0).toLocaleString() + " جنيه"
    );
    setText(
      "disbursedAmount",
      (project.disbursedAmount || 0).toLocaleString() + " جنيه"
    );
    setText(
      "executivePosition",
      project.executivePosition || "لا يوجد موقف تنفيذي"
    );
    if (isRoadProject) {
      setText(
        "petroleumCompany",
        project.roaddetails.petroleumCompany || "غير متوفر"
      );
      setText("notes", project.roaddetails.notes || "لا توجد ملاحظات");
      setText(
        "bitumenQuantity",
        (project.roaddetails.bitumenQuantity || "0").toLocaleString() + " طن"
      );
      setText("rc", (project.roaddetails.rc || "0").toLocaleString() + " طن");
      setText("mc", (project.roaddetails.mc || "0").toLocaleString() + " طن");

      setText(
        "remainingQuantitiesTons",
        (project.remainingQuantitiesTons || 0).toLocaleString() + " طن"
      );

      setText(
        "lastExtensionDate",
        project.extension?.extensionDate
          ? project.extension?.extensionDate.toLocaleDateString("ar-EG")
          : "N/A"
      );
    }
    dateFields.forEach((field) => {
      const value = project[field];
      setText(
        field,
        value ? new Date(value).toLocaleDateString("ar-EG") : "N/A"
      );
    });

    const statusElement = document.getElementById("status");
    if (statusElement) {
      let statusColorClass = "bg-secondary";
      const projectStatus = project.status || "قيد التنفيذ";
      switch (projectStatus) {
        case "قيد التنفيذ":
          statusColorClass = "bg-primary";
        case "مكتمل":
          statusColorClass = "bg-success";
          break;
        case "مسحوب":
          statusColorClass = "bg-warning";
        case "متأخر":
          statusColorClass = "bg-danger";
          break;
        case "متوقف":
          statusColorClass = "bg-danger";
          break;
        default:
          statusColorClass = "bg-secondary";
          break;
      }
      statusElement.innerHTML = `<span class="badge ${statusColorClass} p-2">${projectStatus}</span>`;
    }

    const descriptionEl = document.getElementById("activityDescription");
    if (descriptionEl) {
      descriptionEl.textContent = project.activityDescription || "لا يوجد وصف";
    }

    const locationLink = document.getElementById("project-location-link");
    const noLocationMsg = document.getElementById("no-location-msg");

    if (locationLink && noLocationMsg) {
      if (
        project.projectLocationLink &&
        project.projectLocationLink.trim() !== ""
      ) {
        locationLink.href = project.projectLocationLink;
        locationLink.style.display = "inline-block";
        noLocationMsg.style.display = "none";
      } else {
        locationLink.style.display = "none";
        noLocationMsg.style.display = "block";
      }
    }
  }

  function setExtensionTable(extensions = []) {
    const tbody = document.getElementById("extensionsTableBody");
    tbody.innerHTML = "";

    for (let i = 0; i < extensions.length - 1; i++) {
      const fromDate = new Date(extensions[i].extensionDate).toLocaleDateString(
        "ar-EG"
      );
      const toDate = new Date(
        extensions[i + 1].extensionDate
      ).toLocaleDateString("ar-EG");

      const row = `
      <tr>
        <td>${fromDate}</td>
        <td>${toDate}</td>
      </tr>
    `;
      tbody.insertAdjacentHTML("beforeend", row);
    }

    if (extensions.length === 1) {
      const onlyDate = new Date(extensions[0].extensionDate).toLocaleDateString(
        "ar-EG"
      );
      const row = `
      <tr>
        <td>${onlyDate}</td>
        <td>—</td>
      </tr>
    `;
      tbody.insertAdjacentHTML("beforeend", row);
    }
  }

  function setExtractTable(extracts = [], disbursedAmount) {
    const tbody = document.getElementById("extractsTableBody");
    tbody.innerHTML = "";

    const createPDFLink = (pdfArray) => {
      const pdfUrl =
        Array.isArray(pdfArray) && pdfArray.length > 0
          ? pdfArray[0].path
          : null;

      return pdfUrl
        ? `<div class="mt-2">
        <button class="btn btn-sm btn-outline-primary" 
        onclick="window.open('http://localhost:3000${pdfUrl}', '_blank')">
          عرض المستخلص
        </button>
      </div>`
        : "";
    };

    if (extracts.length === 1) {
      const onlyDate = new Date(extracts[0].extractDate).toLocaleDateString(
        "ar-EG"
      );
      const onlyPrice =
        (extracts[0].extractValue || 0).toLocaleString() + " جنيه";
      const pdfLink = createPDFLink(extracts[0].extractPDFs);

      const row = `
      <tr>
        <td class="text-center">جاري 1</td>
        <td>
          <div class="text-center">
            <div>تم اضافة مستخلص بتاريخ ${onlyDate}</div>
            <div class="d-flex justify-content-center align-items-center mt-2">
              <span class="me-2">قيمة المستخلص:</span>
              <span class="text-primary">${onlyPrice}</span>
            </div>
            ${pdfLink}
          </div>
        </td>
      </tr>
    `;
      tbody.insertAdjacentHTML("beforeend", row);
    } else {
      for (let i = 0; i < extracts.length; i++) {
        const fromDate = new Date(extracts[i].extractDate).toLocaleDateString(
          "ar-EG"
        );
        const fromPrice =
          (extracts[i].extractValue || 0).toLocaleString() + " جنيه";
        const pdfLink = createPDFLink(extracts[i].extractPDFs);

        const row = `
        <tr>
          <td class="text-center">جاري ${i + 1}</td>
          <td>
            <div class="text-center">
              <div>تم اضافة مستخلص بتاريخ ${fromDate}</div>
              <div class="d-flex justify-content-center align-items-center mt-2">
                <span class="me-2">قيمة المستخلص:</span>
                <span class="text-primary">${fromPrice}</span>
              </div>
              ${pdfLink}
            </div>
          </td>
        </tr>
      `;
        tbody.insertAdjacentHTML("beforeend", row);
      }
    }

    const formattedTotal = (disbursedAmount || 0).toLocaleString() + " جنيه";
    const totalRow = `
    <tr class="table-light fw-bold">
      <td class="text-center">الإجمالي</td>
      <td class="text-center text-success">إجمالي المنصرف: ${formattedTotal}</td>
    </tr>
  `;
    tbody.insertAdjacentHTML("beforeend", totalRow);
  }

  function setContractTable(contracts = []) {
    const tbody = document.getElementById("contractsTableBody");
    tbody.innerHTML = "";

    if (contracts.length === 1) {
      const onlyDate = new Date(contracts[0].contractDate).toLocaleDateString(
        "ar-EG"
      );
      const onlyPrice =
        (contracts[0].contractPrice || 0).toLocaleString() + " جنيه";
      const row = `
      <tr>
      <td class="text-center">رقم  ${1}</td>
      <td>
        <div class="text-center">
          <div> تم عمل تعديل عقد بتاريخ ${onlyDate}</div>
          <div class="d-flex justify-content-center align-items-center mt-2">
            <span class="me-2">قيمة تعديل العقد:</span>
            <span class="text-primary">${onlyPrice}</span>
          </div>
        </div>
      </td>
    </tr>
    `;
      tbody.insertAdjacentHTML("beforeend", row);
    } else {
      for (let i = 0; i < contracts.length; i++) {
        const fromDate = new Date(contracts[i].contractDate).toLocaleDateString(
          "ar-EG"
        );
        const fromPrice =
          (contracts[i].contractPrice || 0).toLocaleString() + " جنيه";
        const row = `
    <tr>
      <td class="text-center">رقم  ${i + 1}</td>
      <td>
        <div class="text-center">
          <div> تم عمل تعديل عقد بتاريخ  : ${fromDate}</div>
          <div class="d-flex justify-content-center align-items-center mt-2">
            <span class="me-2">قيمة تعديل العقد:</span>
            <span class="text-primary">${fromPrice}</span>
          </div>
        </div>
      </td>
    </tr>
  `;
        tbody.insertAdjacentHTML("beforeend", row);
      }
    }
  }

  function renderImages(imageUrls = []) {
    if (!mediaTabContent) return;

    const section = document.createElement("div");
    section.innerHTML = "<h6 class='mt-4'>صور المشروع:</h6>";
    console.log(imageUrls);
    if (imageUrls.length === 0) {
      section.innerHTML += "<p class='text-muted text-center'>لا توجد صور</p>";
    } else {
      const row = document.createElement("div");
      row.className = "row g-3";

      imageUrls.forEach((imgUrl) => {
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
        <div class="position-relative">
          <a href="http://localhost:4000${imgUrl}" target="_blank">
            <img src="http://localhost:4000${imgUrl}" 
                 class="img-fluid rounded shadow-sm zoom-hover" 
                 style="height:200px; object-fit:cover; width: 100%;" />
          </a>
          <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 delete-img-btn" 
                  data-path="${imgUrl}" 
                  data-bs-toggle="modal" 
                  data-bs-target="#confirmDeleteModal">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
        row.appendChild(col);
      });

      section.appendChild(row);
    }

    mediaTabContent.appendChild(section);
  }

  function renderPDFs(pdfFiles = [], container = mediaTabContent) {
    const section = document.createElement("div");
    section.innerHTML = "<h6 class='mt-4'>ملفات PDF:</h6>";

    if (!Array.isArray(pdfFiles) || pdfFiles.length === 0) {
      section.innerHTML +=
        "<p class='text-muted text-center'>لا توجد ملفات PDF</p>";
    } else {
      const list = document.createElement("ul");
      list.className = "list-group";

      pdfFiles.forEach((pdf) => {
        const fullUrl = pdf.path;
        const bucketName = fullUrl.includes("contractualDocuments")
          ? "contractualDocuments"
          : "activitypdfs";

        const item = document.createElement("li");
        item.className =
          "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
        <span>${pdf.filename}</span>
        <div>
          <a href="http://localhost:4000${fullUrl}" target="_blank" class="btn btn-sm btn-outline-primary me-2">عرض / تحميل</a>
          <button 
            class="btn btn-sm btn-outline-danger delete-pdf-btn" 
            data-path="${fullUrl}" 
            data-bucket="${bucketName}" 
            data-bs-toggle="modal" 
            data-bs-target="#confirmDeleteModal">
            حذف
          </button>
        </div>
      `;
        list.appendChild(item);
      });

      section.appendChild(list);
    }

    container.appendChild(section);
  }

  document.addEventListener("click", (e) => {
    const pdfBtn = e.target.closest(".delete-pdf-btn");
    const imgBtn = e.target.closest(".delete-img-btn");

    if (pdfBtn) {
      mediaToDelete = {
        type: "pdf",
        path: pdfBtn.dataset.path,
        bucket: pdfBtn.dataset.bucket || "",
      };
    } else if (imgBtn) {
      mediaToDelete = {
        type: "image",
        path: imgBtn.dataset.path,
        bucket: "activityimages",
      };
    }
  });

  document
    .getElementById("confirmDeleteMediaBtn")
    .addEventListener("click", async () => {
      if (!activityCode || !mediaToDelete.path) return;

      let url = `${API_BASE_URL}activity/`;
      let body = {
        activityCode,
      };

      if (mediaToDelete.type === "pdf") {
        if (!mediaToDelete.bucket) {
          showToast("اسم الباكيت غير موجود لحذف ملف PDF", "danger");
          return;
        }

        url += `delete-pdf/${encodeURIComponent(mediaToDelete.bucket)}`;
        body.pdfPath = mediaToDelete.path;
      } else {
        url += `delete-image`;
        body.imagePath = mediaToDelete.path;
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "فشل في الحذف");

        showToast("تم الحذف بنجاح");
        bootstrap.Modal.getInstance(
          document.getElementById("confirmDeleteModal")
        ).hide();
        initializePage();
      } catch (err) {
        showToast("فشل في الحذف: " + err.message, "danger");
      } finally {
        mediaToDelete = { type: null, path: null, bucket: null };
      }
    });

  function populateDecisions(decisions = []) {
    const tableBody = document.getElementById("decisionTableBody");
    tableBody.innerHTML = "";

    if (!decisions.length) {
      tableBody.innerHTML =
        '<tr><td colspan="7" class="text-muted">لا توجد بنود مضافة.</td></tr>';
      return;
    }

    decisions.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td class="wrap-column text-start">${item.decisionName || "-"}</td>
      <td>${item.decisionType || "-"}</td>
      <td>${item.decisionUnit || "-"}</td>
      <td>${item.decisionQuantity ?? "-"}</td>
      <td>${item.decisionPrice ?? "-"}</td>
      <td>${item.decisionTotal ?? "-"}</td>
     <td>

        <a href="#" class="action-btn me-2 edit-decision" data-id="${
          item._id
        }" title="تعديل">
          <i class="fas fa-edit text-primary"></i>
        </a>
        <a href="#" class="action-btn delete-decision" data-id="${
          item._id
        }" title="حذف">
          <i class="fas fa-trash-alt text-danger"></i>
        </a>

     </td>
    `;

      row
        .querySelector(".edit-decision")
        .addEventListener("click", async (e) => {
          e.preventDefault();
          const decisionId = e.currentTarget.dataset.id;

          if (!document.getElementById("editDecisionModal")) {
            const modalHTML = `
          <div class="modal fade" id="editDecisionModal" tabindex="-1">
            <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">تعديل البند</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form id="editDecisionForm">
            <div class="mb-3">
              <label class="form-label">اسم البند</label>
              <textarea 
                class="form-control" 
                id="editDecisionName" 
                required 
                rows="4"
                style="min-height: 200px; resize: vertical; overflow-y: auto;"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="decisionType" class="form-label">نوع البند</label>
                <select class="form-select" id="editDecisionType">
                <option value="تعاقدي">تعاقدي</option>
                <option value="مستجد">مستجد</option>
                <option value="متجاوز">متجاوز</option>
              </select>
              
            </div>
            <div class="mb-3">
              <label class="form-label">الوحدة</label>
              <input type="text" class="form-control" id="editDecisionUnit" required>
            </div>
            <div class="mb-3">
              <label class="form-label">الكمية</label>
              <input type="number" class="form-control" id="editDecisionQuantity" required>
            </div>
            <div class="mb-3">
              <label class="form-label">الفئه</label>
              <input type="number" class="form-control" id="editDecisionPrice" required>
            </div>
            <div class="mb-3">
              <label class="form-label" hidden>الإجمالي</label>
              <input type="number" class="form-control" id="editDecisionTotal"  disabled hidden>
            </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
              <button type="button" class="btn btn-primary" id="saveDecisionBtn">حفظ التغييرات</button>
            </div>
          </div>
            </div>
          </div>`;
            document.body.insertAdjacentHTML("beforeend", modalHTML);
          }

          document.getElementById("editDecisionName").value =
            row.cells[0].textContent;
          document.getElementById("editDecisionType").value =
            row.cells[1].textContent;
          document.getElementById("editDecisionUnit").value =
            row.cells[2].textContent;
          document.getElementById("editDecisionQuantity").value =
            row.cells[3].textContent;
          document.getElementById("editDecisionPrice").value =
            row.cells[4].textContent;
          document.getElementById("editDecisionTotal").value =
            row.cells[5].textContent;

          const modal = new bootstrap.Modal(
            document.getElementById("editDecisionModal")
          );
          modal.show();

          document.getElementById("saveDecisionBtn").onclick = async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}activity/decision/${activityCode}/${decisionId}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    decisionName:
                      document.getElementById("editDecisionName").value,
                    decisionType:
                      document.getElementById("editDecisionType").value,
                    decisionUnit:
                      document.getElementById("editDecisionUnit").value,
                    decisionQuantity: parseFloat(
                      document.getElementById("editDecisionQuantity").value
                    ),
                    decisionPrice: parseFloat(
                      document.getElementById("editDecisionPrice").value
                    ),
                    decisionTotal: parseFloat(
                      document.getElementById("editDecisionTotal").value
                    ),
                  }),
                }
              );

              if (!response.ok) throw new Error("فشل في تعديل البند");
              modal.hide();
              showToast("تم تعديل البند بنجاح");
              initializePage();
            } catch (err) {
              showToast(err.message, "danger");
            }
          };
        });

      row
        .querySelector(".delete-decision")
        .addEventListener("click", async (e) => {
          e.preventDefault();
          const decisionId = e.currentTarget.dataset.id;
          await deleteDecision(
            API_BASE_URL,
            activityCode,
            decisionId,
            showToast
          );
        });
      tableBody.appendChild(row);
    });
  }

  async function initializePage() {
    if (!activityCode) {
      displayError("لم يتم تحديد كود المشروع.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}activity/${activityCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("فشل في تحميل بيانات المشروع.");

      const result = await response.json();
      renderProjectDetails(result.data);
      mediaTabContent.innerHTML = "";
      renderImages(result.data.images || []);
      renderPDFs(result.data.activitypdfs || []);
      populateDecisions(result.data.decision || []);
      setExtensionTable(result.data.extension || []);
      setContractTable(result.data.contract || []);
      setExtractTable(result.data.extract || [], result.data.disbursedAmount);

      if (contractualTabContainer) {
        contractualTabContainer.innerHTML = "";
        renderPDFs(
          result.data.contractualDocuments || [],
          contractualTabContainer
        );
      }
    } catch (err) {
      displayError(err.message);
    }
  }

  initializePage();
  document.addEventListener("click", (e) => {
    const targetImg = e.target.closest(".previewable-img");
    if (targetImg) {
      const previewModal = new bootstrap.Modal(
        document.getElementById("imagePreviewModal")
      );
      const previewImage = document.getElementById("previewImage");
      previewImage.src = targetImg.dataset.full;
      previewModal.show();
    }
  });
});
//jj
