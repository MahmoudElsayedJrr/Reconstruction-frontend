document.addEventListener("DOMContentLoaded", () => {
  const addProjectForm = document.getElementById("addProjectForm");
  if (!addProjectForm) return;

  const saveButton = document.getElementById("save-project-button");
  const toastContainer = document.querySelector(".toast-container");

  function generateCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
      code += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return code;
  }

  function getCurrentFiscalYear() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    if (month >= 7) {
      return `${year}/${year + 1}`;
    } else {
      return `${year - 1}/${year}`;
    }
  }

  function showToast(message, type = "success") {
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

  addProjectForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    saveButton.disabled = true;
    saveButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> جاري الحفظ...`;

    const code = generateCode();
    const formData = {
      activityCode: code,
      activityName: document.getElementById("activityName").value,
      executingCompany: document.getElementById("executingCompany").value,
      consultant: document.getElementById("consultant").value,
      governorate: document.getElementById("governorate").value,
      status: "قيد التنفيذ",
      fundingType: document.getElementById("fundingType").value,
      projectCategory: document.getElementById("projectCategory").value,
      fiscalYear:
        document.getElementById("fiscalYear").value || getCurrentFiscalYear(),
      estimatedValue: document.getElementById("estimatedValue")?.value || 0,
      contractualValue: document.getElementById("contractualValue")?.value || 0,
      disbursedAmount: document.getElementById("disbursedAmount")?.value || 0,
      assignmentDate: document.getElementById("assignmentDate").value,
      completionDate: document.getElementById("completionDate").value,
      receptionDate: document.getElementById("receptionDate").value,
      progress: 0,
    };

    const token = localStorage.getItem("loggedInUserToken");

    const fiscalYearInput = document.getElementById("fiscalYear").value.trim();
    let fiscalYear = fiscalYearInput;

    if (fiscalYear === "") {
      fiscalYear = getCurrentFiscalYear(); 
    } else {
      const fiscalYearRegex = /^\d{4}\/\d{4}$/;
      if (!fiscalYearRegex.test(fiscalYear)) {
        showToast(
          "صيغة السنة المالية غير صحيحة. يجب أن تكون مثل: 2024/2025",
          "danger"
        );
        saveButton.disabled = false;
        saveButton.innerHTML = "حفظ المشروع";
        return; 
      }
    }

    try {
      const response = await fetch(`${API_URL}activity/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || result.data || "حدث خطأ أثناء حفظ المشروع."
        );
      }

      showToast("تمت إضافة المشروع بنجاح!", "success");
      addProjectForm.reset();
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } catch (error) {
      showToast(error.message, "danger");
    } finally {
      saveButton.disabled = false;
      saveButton.innerHTML = "حفظ المشروع";
    }
  });
});
