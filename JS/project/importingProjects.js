document.addEventListener("DOMContentLoaded", () => {
  const excelInput = document.getElementById("excelFile");
  const uploadBtn = document.getElementById("uploadExcelBtn");
  const resultDiv = document.getElementById("resultDiv");
  const excelFileLabel = document.getElementById("excelFileLabel");

  if (excelInput && excelFileLabel) {
    excelInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        excelFileLabel.textContent = file.name;
      } else {
        excelFileLabel.textContent = "إضافة ملف";
      }
    });
  }

  const VALID_GOVERNORATES = [
    "شمال سيناء",
    "جنوب سيناء",
    "بورسعيد",
    "الإسماعيلية",
    "السويس",
    "الشرقية",
    "دمياط",
  ];
  const VALID_CATEGORIES = [
    "طرق",
    "كهرباء",
    "مياه",
    "صرف صحي",
    "منازل بدوية",
    "إسكان اجتماعي",
    "خدمات",
    "تنمية متكاملة",
    "حضانات",
    "مجازر",
    "مباني حكومية",
    "اخر",
  ];
  const VALID_FUNDING_TYPES = ["خطة استثمارية", "تمويل الغير"];

  function parseDate(value) {
    if (!value) return null;

    try {
      if (typeof value === "number") {
        const date = new Date((value - 25569) * 86400 * 1000);
        return date.toISOString();
      }

      if (typeof value === "string") {
        value = value.trim();
        const match = value.match(
          /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/
        );
        if (match) {
          let [, day, month, year] = match;
          if (year.length === 2) {
            year = "20" + year;
          }
          const date = new Date(
            `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
          );
          if (!isNaN(date.getTime())) {
            return date.toISOString();
          }
        }
      }
      if (value instanceof Date) {
        return value.toISOString();
      }

      return null;
    } catch (error) {
      console.error("خطأ في تحليل التاريخ:", value, error);
      return null;
    }
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
        let category = (row["فئة المشروع"] || "").trim();
        let fundingType = (row["نوع التمويل"] || "").trim();

        const body = {
          activityCode: generateCode(),
          activityName: name,
          executingCompany: (row["الشركة المنفذة"] || "").trim(),
          consultant: (row["الاستشارى"] || "").trim(),

          assignmentDate: parseDate(row["تاريخ الإسناد"]),
          completionDate: parseDate(row["تاريخ النهو"]),

          contractualValue: parseFloat(row["القيمه التعاقديه"]),
          estimatedValue: parseFloat(row["القيمه التقديريه"]),
          progress: parseFloat(row["نسبة التنفيذ"]) || 0,
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
          if (res.status === 201) {
            successCount++;
            console.log(" تم اضافه المشروع بنجاح :");
          } else {
            console.log(`Failed on ${res.json}`);
            failCount++;
            console.log("  خطأ ف اضافه المشروع :", data);
          }
        } catch (error) {
          console.log(error.message);
          failCount++;
          console.log("  خطأ ف السيرفر  :", data);
        }
      }

      if (successCount > 0 && typeof markDashboardForRefresh === "function") {
        markDashboardForRefresh();
      }

      resultDiv.innerHTML = `
        <div class="alert alert-info">
          تم رفع الملف.<br/>
          ✅ ناجحة: ${successCount} |  فاشلة: ${failCount}
        </div>
      `;
    };

    reader.readAsArrayBuffer(file);
  });
});
