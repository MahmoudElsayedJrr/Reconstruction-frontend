import { renderForm } from "./edit-project-form.js";

document.addEventListener("DOMContentLoaded", () => {
  const pageTitle = document.getElementById("page-title");
  if (!pageTitle) return;

  const formContainer = document.getElementById("form-container");
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("loggedInUserToken");

  const allowedFields = permissions[userRole] || [];

  function getProjectCodeFromUrl() {
    return new URLSearchParams(window.location.search).get("code");
  }

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
    if (toastContainer) {
      toastContainer.insertAdjacentHTML("beforeend", toastHTML);
      const toastElement = document.getElementById(toastId);
      const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
      toast.show();
    }
  }

  function attachSubmitListener(activityCode) {
    const editForm = document.getElementById("editProjectForm");

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveButton = document.getElementById("save-changes-button");
      saveButton.disabled = true;
      saveButton.innerHTML = `<span class="d-flex align-items-center gap-2">
              <span class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
              جاري الحفظ ...
            </span>`;

      const progressInput = document.getElementById("progress");
      const statusInput = document.getElementById("status");

      if (progressInput) {
        const progressValue = parseFloat(progressInput.value);

        if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
          showToast("يجب أن تكون نسبة الإنجاز بين 0 و 100", "danger");
          saveButton.disabled = false;
          saveButton.innerHTML = "حفظ التعديلات";
          return;
        }

        if (progressValue === 100 && statusInput) {
          statusInput.value = "مكتمل";
        }
      }

      const formData = new FormData();

      allowedFields.forEach((fieldId) => {
        if (document.getElementById("petroleumCompany")) {
          formData.append(
            "roaddetails[petroleumCompany]",
            document.getElementById("petroleumCompany").value
          );
          formData.append(
            "roaddetails[bitumenQuantity]",
            document.getElementById("bitumenQuantity").value
          );
          formData.append(
            "roaddetails[mc]",
            document.getElementById("mc").value
          );
          formData.append(
            "roaddetails[rc]",
            document.getElementById("rc").value
          );
          formData.append(
            "roaddetails[remainingQuantitiesTons]",
            document.getElementById("remainingQuantitiesTons").value
          );
          formData.append(
            "roaddetails[notes]",
            document.getElementById("notes").value
          );
        }
        const input = document.getElementById(fieldId);
        if (input) {
          if (fieldId === "status" && progressInput) {
            const progressValue = parseFloat(progressInput.value);
            if (progressValue === 100) {
              formData.append("status", "مكتمل");
            } else {
              formData.append("status", input.value);
            }
          } else {
            formData.append(fieldId, input.value);
          }
        }
      });
      //let bucketName;
      const mediaInput = document.getElementById("mediaFiles");
      const contractualDocsInput = document.getElementById(
        "contractualDocuments"
      );

      if (contractualDocsInput?.files.length > 0) {
        for (const file of contractualDocsInput.files) {
          if (file.type === "application/pdf") {
            formData.append("contractualDocuments", file);
          } else {
            showToast(
              "يجب أن تكون المستندات التعاقدية بصيغة PDF فقط",
              "danger"
            );
          }
        }
      }

      if (mediaInput?.files.length > 0) {
        for (const file of mediaInput.files) {
          if (file.type.startsWith("image/")) {
            formData.append("images", file);
          } else if (file.type === "application/pdf") {
            formData.append("activitypdfs", file);
            // formData.append("bucketName", "activityPdf");
            //  bucketName = "activityPdf";
          } else {
            showToast(`نوع الملف ${file.name} غير مدعوم`, "danger");
          }
        }
      }

      try {
        const activityCode = getProjectCodeFromUrl();
        const response = await fetch(`${API_URL}activity/${activityCode}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();
        console.log(result);
        if (!response.ok) throw new Error(result.data || "فشل تحديث المشروع");

        showToast("تم حفظ التعديلات بنجاح!", "success");

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 2000);
      } catch (error) {
        showToast(`خطأ: ${error.message}`, "danger");
        saveButton.disabled = false;
        saveButton.innerHTML = "حفظ التعديلات";
      }
    });
  }

  async function initializePage() {
    const activityCodee = getProjectCodeFromUrl();
    if (!activityCodee) {
      formContainer.innerHTML = `<div class="alert alert-danger">كود المشروع غير موجود.</div>`;
      return;
    }
    try {
      const response = await fetch(`${API_URL}activity/${activityCodee}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.data);
      pageTitle.textContent = `تعديل مشروع: ${result.data.activityName}`;
      const activityCode = renderForm(
        result.data,
        formContainer,
        allowedFields,
        userRole,
        showToast,
        attachSubmitListener
      );
      //attachSubmitListener(activityCode);
    } catch (error) {
      formContainer.innerHTML = `<div class="alert alert-danger">فشل في جلب بيانات المشروع: ${error.message}</div>`;
    }
  }

  initializePage();
});
