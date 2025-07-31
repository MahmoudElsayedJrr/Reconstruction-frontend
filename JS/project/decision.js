const token = localStorage.getItem("loggedInUserToken");

async function addDecision(BaseUrl, activityCode, showToast) {
  const name = document.getElementById("decisionName").value.trim();
  const category = document.getElementById("decisionType").value.trim();
  const quantity = document.getElementById("decisionQuantity").value;
  const price = document.getElementById("decisionPrice").value;
  const unit = document.getElementById("decisionUnit").value.trim();

  if (!name || !category || !quantity || !price || !unit) {
    showToast("برجاء ملء جميع الحقول", "warning");
    return;
  }

  const parsedQuantity = parseFloat(quantity);
  const parsedPrice = parseFloat(price);
  const total = parsedQuantity * parsedPrice;

  const requestBody = {
    decision: [
      {
        decisionName: name,
        decisionType: category,
        decisionUnit: unit,
        decisionQuantity: parsedQuantity,
        decisionPrice: parsedPrice,
        decisionTotal: total,
      },
    ],
  };

  try {
    const response = await fetch(
      `${BaseUrl}activity/decision/${activityCode}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await response.json();
    console.log("Response data:", data);
    if (response.ok) {
      showToast("تم إضافة البند بنجاح", "success");
      clearAndCloseModal();
    } else {
      const errorMessage =
        data.message || data.error || "برجاء المحاولة مرة أخرى";
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error details:", err);
    showToast("حدث خطأ أثناء إضافة البند.", "danger");
  }
}

function clearAndCloseModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addDecisionModal")
  );
  modal.hide();
  //window.location.href = "dashboard.html";
  // Clear the form
  document.getElementById("decisionName").value = "";
  document.getElementById("decisionType").value = "";
  document.getElementById("decisionQuantity").value = "";
  document.getElementById("decisionPrice").value = "";
}

async function deleteDecision(BaseUrl, activityCode, decisionId, showToast) {
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
