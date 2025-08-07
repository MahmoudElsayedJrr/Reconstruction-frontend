const token = localStorage.getItem("loggedInUserToken");

export async function addExtract(BaseUrl, activityCode, showToast) {
  const extractDate = document.getElementById("extractDate").value;
  const extractValue = document.getElementById("extractValue").value;
  const extractFiles = document.getElementById("extractPDFs").files;

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
    return;
  }

  const selectedDate = new Date(extractDate);
  if (isNaN(selectedDate.getTime())) {
    showToast("تاريخ غير صحيح", "warning");
    return;
  }

  const parsedValue = parseFloat(extractValue);
  if (isNaN(parsedValue) || parsedValue <= 0) {
    showToast("قيمة المستخلص غير صحيحة", "warning");
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

    if (response.ok) {
      showToast("تم إضافة المستخلص بنجاح", "success");
      clearAndCloseExtractModal();
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

function clearAndCloseExtractModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addExtractModal")
  );
  modal.hide();

  document.getElementById("extractDate").value = "";
  document.getElementById("extractValue").value = "";
  document.getElementById("extractPDFs").value = "";
}
