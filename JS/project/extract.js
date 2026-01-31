const token = localStorage.getItem("loggedInUserToken");
let currentExtractId = null;
let isEditMode = false;

export async function addExtract(BaseUrl, activityCode, showToast) {
  const extractDate = document.getElementById("extractDate").value;
  const extractValue = document.getElementById("extractValue").value;
  const extractFiles = document.getElementById("extractpdfs").files;

  const saveBtn = document.getElementById("saveExtractBtn");
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري الإضافة...`;

  function resetButton() {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalBtnText;
  }

  if (!extractDate || !extractValue) {
    showToast("برجاء ملء جميع الحقول", "warning");
    resetButton();
    return;
  }

  const selectedDate = new Date(extractDate);
  if (isNaN(selectedDate.getTime())) {
    showToast("تاريخ غير صحيح", "warning");
    resetButton();
    return;
  }

  const parsedValue = parseFloat(extractValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    showToast("قيمة المستخلص غير صحيحة", "warning");
    resetButton();
    return;
  }

  const formData = new FormData();
  formData.append("extractDate", selectedDate.toISOString());
  formData.append("extractValue", parsedValue);

  for (let i = 0; i < extractFiles.length; i++) {
    formData.append("extractpdfs", extractFiles[i]);
  }

  try {
    const response = await fetch(`${BaseUrl}activity/extract/${activityCode}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok && data.status === "success") {
      showToast("تم إضافة المستخلص بنجاح", "success");
      clearAndCloseExtractModal();

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      const errorMessage =
        data.message || data.error || "حدث خطأ، برجاء المحاولة مرة أخرى";
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error adding extract:", err);
    showToast("حدث خطأ أثناء إضافة المستخلص.", "danger");
  } finally {
    resetButton();
  }
}

export async function editExtract(BaseUrl, activityCode, extractId, showToast) {
  const extractDate = document.getElementById("editExtractDate").value;
  const extractValue = document.getElementById("editExtractValue").value;

  const saveBtn = document.getElementById("saveExtractBtn");
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري التعديل...`;

  function resetButton() {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalBtnText;
  }

  if (!extractDate || !extractValue) {
    showToast("برجاء ملء جميع الحقول", "warning");
    resetButton();
    return;
  }

  const selectedDate = new Date(extractDate);
  if (isNaN(selectedDate.getTime())) {
    showToast("تاريخ غير صحيح", "warning");
    resetButton();
    return;
  }

  const extractValueProcessed = extractValue.replace(",", ".");
  const parsedValue = parseFloat(extractValueProcessed);

  if (isNaN(parsedValue) || parsedValue <= 0) {
    showToast("قيمة المستخلص غير صحيحة", "warning");
    resetButton();
    return;
  }

  const updateData = {
    extractDate: selectedDate.toISOString(),
    extractValue: parsedValue,
  };

  try {
    const response = await fetch(
      `${BaseUrl}activity/extract/${activityCode}/${extractId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    const data = await response.json();

    if (response.ok && data.status === "success") {
      showToast("تم تعديل المستخلص بنجاح", "success");
      clearAndCloseExtractModal();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      const errorMessage = data.message || "فشل التعديل، برجاء المحاولة.";
      console.log(errorMessage);
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error editing extract:", err);
    showToast(err, "danger");
  } finally {
    resetButton();
  }
}

export async function executeDeleteExtract(
  BaseUrl,
  activityCode,
  extractId,
  showToast
) {
  const deleteModal = bootstrap.Modal.getInstance(
    document.getElementById("confirmDeleteModal")
  );
  if (deleteModal) deleteModal.hide();

  try {
    const response = await fetch(
      `${BaseUrl}activity/extract/${activityCode}/${extractId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.status === "success") {
      showToast("تم حذف المستخلص بنجاح", "success");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      const errorMessage = data.message || "فشل الحذف، برجاء المحاولة.";
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error deleting extract:", err);
    showToast("حدث خطأ أثناء حذف المستخلص.", "danger");
  }
}

function clearAndCloseExtractModal() {
  document.getElementById("extractDate").value = "";
  document.getElementById("extractValue").value = "";
  //document.getElementById("extractpdfs").value = "";

  const extractModalElement = document.getElementById("extractModal");
  if (extractModalElement) {
    const modalInstance = bootstrap.Modal.getInstance(extractModalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}
