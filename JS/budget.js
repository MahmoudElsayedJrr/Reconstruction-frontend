const form = document.getElementById("budgetForm");
const amountInput = document.getElementById("amountInput");
const yearSelect = document.getElementById("yearSelect");
const submitBtn = document.getElementById("submitBtn");
const currentBudget = document.getElementById("currentBudget");
const displayValue = document.getElementById("displayValue");
const displayYear = document.getElementById("displayYear");

const token = localStorage.getItem("loggedInUserToken");

function formatNumber(num) {
  return new Intl.NumberFormat("ar-EG", {
    style: "decimal",
    maximumFractionDigits: 2,
  }).format(num);
}

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "";

  if (type === "success") {
    icon = `<svg viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>`;
  } else if (type === "error") {
    icon = `<svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>`;
  } else {
    icon = `<svg viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>`;
  }

  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hiding");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function setLoading(loading) {
  if (loading) {
    submitBtn.classList.add("loading");
  } else {
    submitBtn.classList.remove("loading");
  }
}

function showCurrentBudget(amount, year) {
  displayValue.textContent = formatNumber(amount) + " ج.م";
  displayYear.textContent = "السنة المالية: " + year;
  currentBudget.classList.add("show");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = amountInput.value;
  const fiscalYear = yearSelect.value;

  if (!amount || !fiscalYear) {
    showToast("من فضلك أدخل القيمة المالية واختار السنة المالية", "warning");
    return;
  }

  if (Number(amount) < 0) {
    showToast("القيمة المالية لازم تكون أكبر من صفر", "error");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/budget`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fiscalYear: fiscalYear,
        amount: Number(amount),
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      showToast("تم حفظ المخصص المالي بنجاح ✅", "success");
      showCurrentBudget(data.data.amount, data.data.fiscalYear);
    } else {
      showToast(data.message || "حصل مشكلة، حاول تاني", "error");
    }
  } catch (error) {
    showToast("مفيش اتصال بالسيرفر، تأكد إن السيرفر شغال", "error");
  } finally {
    setLoading(false);
  }
});

yearSelect.addEventListener("change", async () => {
  const fiscalYear = yearSelect.value;
  if (!fiscalYear) return;

  const response = await fetch(`${API_URL}/${encodeURIComponent(fiscalYear)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await response.json();

  if (data.status === "success") {
    amountInput.value = data.data.amount;
    showCurrentBudget(data.data.amount, data.data.fiscalYear);
  } else {
    amountInput.value = "";
    currentBudget.classList.remove("show");
  }
});
