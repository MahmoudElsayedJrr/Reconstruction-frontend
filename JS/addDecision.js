const token = localStorage.getItem("loggedInUserToken");

async function submitDecisionItem(BaseUrl, activityCode) {
  // Input validation
  const name = document.getElementById("decisionName").value.trim();
  const category = document.getElementById("decisionType").value.trim();
  const quantity = document.getElementById("decisionQuantity").value;
  const price = document.getElementById("decisionPrice").value;

  // Validate required fields
  if (!name || !category || !quantity || !price) {
    alert("جميع الحقول مطلوبة");
    return;
  }

  // Validate numeric values
  const parsedQuantity = parseFloat(quantity);
  const parsedPrice = parseFloat(price);

  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    alert("الرجاء إدخال كمية صحيحة");
    return;
  }

  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    alert("الرجاء إدخال سعر صحيح");
    return;
  }

  const total = parsedQuantity * parsedPrice;

  const requestBody = {
    decision: [
      {
        decisionName: name,
        decisionType: category,
        decisionQuantity: parsedQuantity,
        decisionPrice: parsedPrice,
        decisionTotal: total,
      },
    ],
  };

  try {
    const response = await fetch(
      `${BaseUrl}activity/add-decision/${activityCode}`,
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
      alert("تم إضافة البند بنجاح ✅");
      clearAndCloseModal();
    } else {
      const errorMessage =
        data.message || data.error || "برجاء المحاولة مرة أخرى";
      alert("حدث خطأ: " + errorMessage);
    }
  } catch (err) {
    console.error("Error details:", err);
    alert("فشل الاتصال بالسيرفر");
  }
}

function clearAndCloseModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("addDecisionModal")
  );
  modal.hide();

  // Clear the form
  document.getElementById("decisionName").value = "";
  document.getElementById("decisionType").value = "";
  document.getElementById("decisionQuantity").value = "";
  document.getElementById("decisionPrice").value = "";
}

// ربط الزرار بالدالة
