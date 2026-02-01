document
  .getElementById("export-excel-btn")
  .addEventListener("click", async () => {
    const projectName = document
      .getElementById("projectNameFilter")
      .value.trim();
    const activityCode = document
      .getElementById("activityCodeFilter")
      .value.trim();
    const governorate = document.getElementById("governorateFilter").value;
    const fundingType = document.getElementById("fundingTypeFilter").value;
    const status = document.getElementById("statusFilter").value;
    const fiscalYear = document.getElementById("fiscalYearFilter").value;
    const fundingSource = document.getElementById("fundingSourceFilter").value;
    const projectCategory = document.getElementById(
      "projectCategoryFilter"
    ).value;

    const queryParams = [];

    if (projectName)
      queryParams.push(`activityName=${encodeURIComponent(projectName)}`);
    if (activityCode)
      queryParams.push(`activityCode=${encodeURIComponent(activityCode)}`);
    if (governorate && governorate !== "الكل")
      queryParams.push(`governorate=${encodeURIComponent(governorate)}`);
    if (fundingType && fundingType !== "الكل")
      queryParams.push(`fundingType=${encodeURIComponent(fundingType)}`);
    if (fundingSource && fundingSource !== "الكل")
      queryParams.push(`fundingSource=${encodeURIComponent(fundingSource)}`);
    if (projectCategory && projectCategory !== "الكل")
      queryParams.push(
        `projectCategory=${encodeURIComponent(projectCategory)}`
      );
    if (fiscalYear && fiscalYear !== "الكل")
      queryParams.push(`fiscalYear=${encodeURIComponent(fiscalYear)}`);
    if (status && status !== "الكل")
      queryParams.push(`status=${encodeURIComponent(status)}`);

    const token = localStorage.getItem("loggedInUserToken");
    const queryString = queryParams.join("&");
    const url = `${API_URL}activity/export-excel${
      queryString ? `?${queryString}` : ""
    }`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        console.error("Server:", errorMsg);
        throw new Error("فشل في تصدير الملف");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "projects.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء التصدير");
    }
  });

