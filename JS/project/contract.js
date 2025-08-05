const token = localStorage.getItem("loggedInUserToken");

export async function addContract(BaseUrl, activityCode, showToast) {
  const price = document.getElementById("contractPrice").value;
  const date = document.getElementById("contractDate").value;

  if (!price || !date) {
    showToast("برجاء ملء جميع الحقول", "warning");
    return;
  }

  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    showToast("تاريخ غير صحيح", "warning");
    return;
  }

  // تنسيق التاريخ بشكل ISO
  const formattedDate = selectedDate.toISOString().split("T")[0];
  const parsedPrice = parseFloat(price);

  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    showToast("القيمة غير صحيحة", "warning");
    return;
  }

  const requestBody = {
    contractDate: formattedDate,
    contractPrice: parsedPrice,
  };
  console.log("Sending contract data:", requestBody);
  try {
    const response = await fetch(
      `${BaseUrl}activity/contract/${activityCode}`,
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
    console.log("Response data:", data);
    if (response.ok) {
      showToast("تم تعديل العقد بنجاح", "success");
      clearAndCloseModal();
    } else {
      const errorMessage =
        data.message || data.error || "برجاء المحاولة مرة أخرى";
      showToast(errorMessage, "danger");
    }
  } catch (err) {
    console.error("Error details:", err);
    showToast("حدث خطأ أثناء  تعديل العقد.", "danger");
  }
}

function clearAndCloseModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addContractModal")
  );
  modal.hide();
  //window.location.href = "dashboard.html";
  // Clear the form
  document.getElementById("contractDate").value = "";
  document.getElementById("contractPrice").value = "";
}
