document.addEventListener("DOMContentLoaded", () => {
  const excelInput = document.getElementById("excelFile");
  const uploadBtn = document.getElementById("uploadExcelBtn");
  const resultDiv = document.getElementById("resultDiv");

  const VALID_GOVERNORATES = [
    "شمال سيناء",
    "جنوب سيناء",
    "بورسعيد",
    "الاسماعيلية",
    "السويس",
    "الشرقية",
    "دمياط",
  ];
  const VALID_CATEGORIES = [
    "طرق",
    "كهرباء",
    "مياه",
    "صرف صحي",
    "اسكان بدوي",
    "اسكان اجتماعي",
    "خدمات",
    "تنمية متكاملة",
    "حضانات",
    "مجازر",
    "تأهيل مباني حكومية",
    "آخر",
  ];
  const VALID_FUNDING_TYPES = ["خطة استثمارية", "تمويل الغير"];

  function parseDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }

  function generateCode(length = 6) {
    const digits = "0123456789";
    return Array.from(
      { length },
      () => digits[Math.floor(Math.random() * digits.length)]
    ).join("");
  }

  uploadBtn.addEventListener("click", () => {
    const file = excelInput.files[0];
    if (!file) {
      alert("من فضلك اختر ملف Excel");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      console.log("تم قراءة البيانات بنجاح:", rows);
      let successCount = 0;
      let failCount = 0;
      const token = localStorage.getItem("loggedInUserToken");
      for (const row of rows) {
        const name = (row["اسم المشروع"] || "").trim();
        if (!name) continue;

        let governorate = (row["المحافظة"] || "").trim();
        if (!VALID_GOVERNORATES.includes(governorate)) {
          governorate =
            VALID_GOVERNORATES[
              Math.floor(Math.random() * VALID_GOVERNORATES.length)
            ];
        }

        let category = (row["الفئة"] || "").trim();
        if (!VALID_CATEGORIES.includes(category)) {
          category =
            VALID_CATEGORIES[
              Math.floor(Math.random() * VALID_CATEGORIES.length)
            ];
        }

        let fundingType = (row["نوع التمويل"] || "").trim();
        if (!VALID_FUNDING_TYPES.includes(fundingType)) {
          fundingType =
            VALID_FUNDING_TYPES[
              Math.floor(Math.random() * VALID_FUNDING_TYPES.length)
            ];
        }

        const body = {
          activityCode: generateCode(),
          activityName: name,
          executingCompany: (row["الشركة المنفذة"] || "").trim(),
          consultant: (row["الاستشارى"] || "").trim(),

          assignmentDate: parseDate(row["تاريخ الاسناد"]),
          completionDate: parseDate(row["تاريخ النهو"]),

          fundingType,
          status: "قيد التنفيذ",
          governorate,
          projectCategory: category,
        };
        console.log("إرسال البيانات:", body);
        try {
          const res = await fetch(`${API_URL}activity`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          });
          const data = await res.json();
          console.log("الرد من السيرفر:", data);
          if (res.status === 201) {
            successCount++;
          } else {
            failCount++;
          }
        } catch {
          failCount++;
        }
      }

      resultDiv.innerHTML = `
        <div class="alert alert-info">
          تم رفع الملف.<br/>
          ✅ ناجحة: ${successCount} | ❌ فاشلة: ${failCount}
        </div>
      `;
    };

    reader.readAsArrayBuffer(file);
  });
});
