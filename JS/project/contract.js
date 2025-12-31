const token = localStorage.getItem("loggedInUserToken");

export async function addContract(BaseUrl, activityCode, showToast) {
  const price = document.getElementById("contractPrice").value;
  const date = document.getElementById("contractDate").value;

  const saveBtn = document.getElementById("saveContractBtn");
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري إضافة العقد...`;

  function resetButton() {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalBtnText;
  }

  if (!price || !date) {
    showToast("برجاء ملء جميع الحقول", "warning");
    resetButton();
    return;
  }

  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    showToast("تاريخ غير صحيح", "warning");
    resetButton();
    return;
  }

  const formattedDate = selectedDate.toISOString().split("T")[0];
  const parsedPrice = parseFloat(price);

  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    showToast("القيمة غير صحيحة", "warning");
    resetButton();
    return;
  }

  const requestBody = {
    contractDate: formattedDate,
    contractPrice: parsedPrice,
  };

  try {
    const response = await fetch(
      `${BaseUrl}activity/contract/${activityCode}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();
    if (response.ok) {
      showToast("تم إضافة العقد بنجاح", "success");
      clearAndCloseModal("addContractModal");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      const errorMessage =
        data.message || data.error || "برجاء المحاولة مرة أخرى";
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error details:", err);
    showToast("حدث خطأ أثناء إضافة العقد.", "danger");
  } finally {
    resetButton();
  }
}

export async function editContract(activityCode, contractNumber, showToast) {
  const price = document.getElementById("editContractPrice").value;
  const date = document.getElementById("editContractDate").value;

  const saveBtn = document.getElementById("saveEditContractBtn");
  const originalBtnText = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري تعديل العقد...`;

  function resetButton() {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalBtnText;
  }

  if (!price || !date) {
    showToast("برجاء ملء جميع الحقول", "warning");
    resetButton();
    return;
  }

  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    showToast("تاريخ غير صحيح", "warning");
    resetButton();
    return;
  }

  const formattedDate = selectedDate.toISOString().split("T")[0];
  const parsedPrice = parseFloat(price);

  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    showToast("القيمة غير صحيحة", "warning");
    resetButton();
    return;
  }

  const requestBody = {
    contractDate: formattedDate,
    contractPrice: parsedPrice,
  };

  try {
    const response = await fetch(
      `${API_URL}activity/contract/${activityCode}/${contractNumber}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();
    if (response.ok) {
      showToast("تم تعديل العقد بنجاح", "success");
      clearAndCloseModal("editContractModal");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      const errorMessage =
        data.message || data.error || "برجاء المحاولة مرة أخرى";
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error details:", err);
    showToast("حدث خطأ أثناء تعديل العقد.", "danger");
  } finally {
    resetButton();
  }
}

export async function deleteContract(activityCode, contractNumber, showToast) {
  const deleteBtn = document.getElementById("confirmDeleteContractBtn");
  const originalBtnText = deleteBtn.innerHTML;
  deleteBtn.disabled = true;
  deleteBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري الحذف...`;

  function resetButton() {
    deleteBtn.disabled = false;
    deleteBtn.innerHTML = originalBtnText;
  }

  try {
    const response = await fetch(
      `${API_URL}activity/contract/${activityCode}/${contractNumber}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (response.ok) {
      showToast("تم حذف العقد بنجاح", "success");
      clearAndCloseModal("deleteContractModal");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      const errorMessage =
        data.message || data.error || "برجاء المحاولة مرة أخرى";
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error details:", err);
    showToast(err.message, "danger");
  } finally {
    resetButton();
  }
}

// فتح modal التعديل
export function openEditContractModal(
  index,
  contractDate,
  contractPrice,
  contractNumber
) {
  document.getElementById("editContractDate").value =
    contractDate.split("T")[0];
  document.getElementById("editContractPrice").value = contractPrice;
  document.getElementById("editContractNumber").value = contractNumber;

  const contractsModalEl = document.getElementById("contractsModal");
  const contractsModal = bootstrap.Modal.getInstance(contractsModalEl);
  if (contractsModal) contractsModal.hide();

  setTimeout(() => {
    new bootstrap.Modal(document.getElementById("editContractModal")).show();
  }, 300);
}

export function openDeleteContractModal(index, displayNumber, contractNumber) {
  document.getElementById("deleteContractNumber").value = contractNumber;
  document.getElementById(
    "deleteContractText"
  ).textContent = `رقم ${displayNumber}`;

  const contractsModalEl = document.getElementById("contractsModal");
  const contractsModal = bootstrap.Modal.getInstance(contractsModalEl);
  if (contractsModal) contractsModal.hide();

  setTimeout(() => {
    new bootstrap.Modal(document.getElementById("deleteContractModal")).show();
  }, 300);
}

// إغلاق وتنظيف الـ modal (واحدة بس)
function clearAndCloseModal(modalId) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
  if (modal) {
    modal.hide();
  }

  if (modalId === "addContractModal") {
    document.getElementById("contractDate").value = "";
    document.getElementById("contractPrice").value = "";
  } else if (modalId === "editContractModal") {
    document.getElementById("editContractDate").value = "";
    document.getElementById("editContractPrice").value = "";
    document.getElementById("editContractNumber").value = "";
  } else if (modalId === "deleteContractModal") {
    document.getElementById("deleteContractNumber").value = "";
  }
}
