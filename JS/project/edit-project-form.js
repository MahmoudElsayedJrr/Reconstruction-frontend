import { addContract } from "./contract.js";
import { addDecision } from "./decision.js";
import { addExtract } from "./extract.js";

function getProjectCodeFromUrl() {
  return new URLSearchParams(window.location.search).get("code");
}

export function renderForm(
  project,
  formContainer,
  allowedFields,
  userRole,
  showToast,
  attachSubmitListener
) {
  formContainer.innerHTML = `
      <form id="editProjectForm" enctype="multipart/form-data" method="POST">
        <div class="row g-3">
        <!-- البيانات الاساسيه --> 
            ${
              userRole === "admin" || userRole === "manager"
                ? ` <h5 class="form-section-title">البيانات الأساسية</h5>
            <div class="col-md-6">
              <label for="activityName" class="form-label">اسم المشروع</label>
              <input type="text" id="activityName" class="form-control" value="${
                project.activityName || ""
              }">
            </div>
            <div class="col-md-6">
              <label for="executingCompany" class="form-label">الشركة المنفذة</label>
              <input type="text" id="executingCompany" class="form-control" value="${
                project.executingCompany || ""
              }">
            </div>

            <div class="col-md-6">
              <label for="fundingType" class="form-label">نوع التمويل</label>
              <select id="fundingType" class="form-select">
                <option value="خطة استثمارية" ${
                  project.fundingType === "خطة استثمارية" ? "selected" : ""
                }>خطة استثمارية</option>
                <option value="تمويل الغير" ${
                  project.fundingType === "تمويل الغير" ? "selected" : ""
                }>تمويل الغير</option>
              </select>
            </div>

            <div class="col-md-6">
              <label for="governorate" class="form-label">المحافظة</label>
              <select id="governorate" class="form-select">
                <option value="شمال سيناء" ${
                  project.governorate === "شمال سيناء" ? "selected" : ""
                }>شمال سيناء</option>
                <option value="جنوب سيناء" ${
                  project.governorate === "جنوب سيناء" ? "selected" : ""
                }>جنوب سيناء</option>
                <option value="بورسعيد" ${
                  project.governorate === "بورسعيد" ? "selected" : ""
                }>بورسعيد</option>
                <option value="الإسماعيلية" ${
                  project.governorate === "الإسماعيلية" ? "selected" : ""
                }>الإسماعيلية</option>
                <option value="السويس" ${
                  project.governorate === "السويس" ? "selected" : ""
                }>السويس</option>
                <option value="الشرقية" ${
                  project.governorate === "الشرقية" ? "selected" : ""
                }>الشرقية</option>
                <option value="دمياط" ${
                  project.governorate === "دمياط" ? "selected" : ""
                }>دمياط</option>
              </select>
            </div>


            <div class="col-md-6">
              <label for="projectCategory" class="form-label">فئة المشروع</label>
              <select id="projectCategory" class="form-select">
                <option value="طرق" ${
                  project.projectCategory === "طرق" ? "selected" : ""
                }>طرق</option>

                <option value="كهرباء" ${
                  project.projectCategory === "كهرباء" ? "selected" : ""
                }>كهرباء</option>

                <option value="مياه" ${
                  project.projectCategory === "مياه" ? "selected" : ""
                }>مياه</option>

                <option value="صرف صحي" ${
                  project.projectCategory === "صرف صحي" ? "selected" : ""
                }>صرف صحي</option>

                <option value="منازل بدوية" ${
                  project.projectCategory === "منازل بدوية" ? "selected" : ""
                }>منازل بدوية</option>

                <option value="إسكان اجتماعي" ${
                  project.projectCategory === "إسكان اجتماعي" ? "selected" : ""
                }>إسكان اجتماعي</option>

                <option value="خدمات" ${
                  project.projectCategory === "خدمات" ? "selected" : ""
                }>خدمات</option>

                <option value="تنمية متكاملة" ${
                  project.projectCategory === "تنمية متكاملة" ? "selected" : ""
                }>تنمية متكاملة</option>
                <option value="حضانات" ${
                  project.projectCategory === "حضانات" ? "selected" : ""
                }>حضانات</option>
                <option value="مجازر" ${
                  project.projectCategory === "مجازر" ? "selected" : ""
                }>مجازر</option>
                <option value="مباني حكومية" ${
                  project.projectCategory === "مباني حكومية" ? "selected" : ""
                }>مباني حكومية</option>
                <option value="اخر" ${
                  project.projectCategory === "اخر" ? "selected" : ""
                }>اخر</option>
              </select>
            </div>

            <div class="col-md-6">
              <label for="consultant" class="form-label">الاستشاري</label>
              <input type="text" id="consultant" class="form-control" value="${
                project.consultant || ""
              }">
            </div>

            <div class="col-md-12">
              <label for="activityDescription" class="form-label">وصف المشروع</label>
              <textarea id="activityDescription" class="form-control" rows="4" style="resize: vertical;">${
                project.activityDescription || ""
              }</textarea>
            </div>
            <div class="col-md-4">
              <label for="fiscalYear" class="form-label">السنة المالية</label>
              <select id="fiscalYear" class="form-select">
              <option value="" ${
                !project.fiscalYear ? "selected" : ""
              }> </option>
                <option value="" ${
                  project.fiscalYear === "2024/2025" ? "selected" : ""
                }>2024/2025</option>
                <option value="" ${
                  project.fiscalYear === "2025/2026" ? "selected" : ""
                }>2025/2026</option>
                <option value="2026/2027" ${
                  project.fiscalYear === "2026/2027" ? "selected" : ""
                }>2026/2027</option>
                <option value="2027/2028" ${
                  project.fiscalYear === "2027/2028" ? "selected" : ""
                }>2027/2028</option>
                <option value="2028/2029" ${
                  project.fiscalYear === "2028/2029" ? "selected" : ""
                }>2028/2029</option>
                <option value="2029/2030" ${
                  project.fiscalYear === "2029/2030" ? "selected" : ""
                }>2029/2030</option>
                <option value="2030/2031" ${
                  project.fiscalYear === "2030/2031" ? "selected" : ""
                }>2030/2031</option>
                <option value="2031/2032" ${
                  project.fiscalYear === "2031/2032" ? "selected" : ""
                }>2031/2032</option>
                <option value="2032/2033" ${
                  project.fiscalYear === "2032/2033" ? "selected" : ""
                }>2032/2033</option>
                <option value="2033/2034" ${
                  project.fiscalYear === "2033/2034" ? "selected" : ""
                }>2033/2034</option>
                <option value="2034/2035" ${
                  project.fiscalYear === "2034/2035" ? "selected" : ""
                }>2034/2035</option>
                <option value="2035/2036" ${
                  project.fiscalYear === "2035/2036" ? "selected" : ""
                }>2035/2036</option>
                <option value="2036/2037" ${
                  project.fiscalYear === "2036/2037" ? "selected" : ""
                }>2036/2037</option>
                <option value="2037/2038" ${
                  project.fiscalYear === "2037/2038" ? "selected" : ""
                }>2037/2038</option>
                <option value="2038/2039" ${
                  project.fiscalYear === "2038/2039" ? "selected" : ""
                }>2038/2039</option>
                <option value="2039/2040" ${
                  project.fiscalYear === "2039/2040" ? "selected" : ""
                }>2039/2040</option>
                <option value="2040/2041" ${
                  project.fiscalYear === "2040/2041" ? "selected" : ""
                }>2040/2041</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="estimatedValue" class="form-label">القيمة التقديرية</label>
              <input type="number" id="estimatedValue" class="form-control" value="${
                project.estimatedValue || 0
              }">
            </div>
            <div class="col-md-4">
              <label for="contractualValue" class="form-label">القيمة التعاقدية</label>
              <input type="number" id="contractualValue" class="form-control" value="${
                project.contractualValue || 0
              }">
            </div>
            <div class="col-md-4">
              <label for="completionDate" class="form-label">تاريخ النهو</label>
              <input type="date" id="completionDate" class="form-control" value="${
                project.completionDate
                  ? new Date(project.completionDate).toISOString().split("T")[0]
                  : ""
              }">
            </div>
            <div class="col-md-4">
              <label for="receptionDate" class="form-label">تاريخ الاستلام</label>
              <input type="date" id="receptionDate" class="form-control" value="${
                project.receptionDate
                  ? new Date(project.receptionDate).toISOString().split("T")[0]
                  : ""
              }">
            </div> `
                : ""
            }
      
        	  ${
              userRole === "admin" || userRole === "executive"
                ? ` <h5 class="form-section-title">البيانات التنفيذيه</h5>

          <div class="col-md-6">
            <label for="status" class="form-label">حالة المشروع</label>
            <select id="status" class="form-select">
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="مكتمل">مكتمل</option>
              <option value="متأخر">متأخر</option>
              <option value="مسحوب">مسحوب</option>
              <option value="متوقف">متوقف</option>
            </select>
          </div>

            <div class="col-md-4">
            <label for="progress" class="form-label">نسبة الإنجاز</label>
            <input type="number" id="progress" class="form-control" value="${
              project.progress || 0
            }">
          </div>

          <div class="col-md-12">
            <label for="executivePosition" class="form-label"> الموقف التنفيذي</label>
            <textarea id="executivePosition" class="form-control" rows="4" style="resize: vertical;">${
              project.executivePosition || ""
            }</textarea>
          </div>

          <div class="col-md-12">
            <label for="projectLocationLink" class="form-label">رابط الموقع الجغرافي (Google Maps)</label>
            <input type="url" id="projectLocationLink" class="form-control" value="${
              project.projectLocationLink || ""
            }" placeholder="https://maps.google.com/?q=30.1,31.2">
          </div>

          <div class="col-md-12">
            <label for="mediaFiles" class="form-label">رفع صور أو ملفات PDF للمشروع</label>
            <input type="file" id="mediaFiles" name="mediaFiles" class="form-control" multiple accept="image/*,application/pdf">
          </div>`
                : ""
            }



          <!-- البيانات الماليه --> 
              ${
                userRole === "financial" || userRole === "admin"
                  ? `
            <h5 class="form-section-title">البيانات المالية</h5>
            <div class="col-md-4">
              <label for="disbursedAmount" class="form-label">المنصرف</label>
              <input type="number" id="disbursedAmount" class="form-control" value="${
                project.disbursedAmount || 0
              }">
            </div>

            <div class="d-flex justify-content-start gap-3 my-3 flex-wrap">
              <button type="button" class="btn custom-btn px-3" data-bs-toggle="modal" data-bs-target="#addExtractModal">
                + إضافة مستخلص
              </button>
            </div>`
                  : ""
              }

          <!-- البيانات المشروعات --> 

              ${
                userRole === "admin" || userRole === "projectManager"
                  ? ` 
                    ${
                      project.projectCategory === "طرق"
                        ? `
                              <h5 class="form-section-title">بيانات الطرق</h5>

                              <div class="col-md-6">
                                <label for="petroleumCompany" class="form-label">شركة البترول</label>
                                <input type="text" id="petroleumCompany" class="form-control" value="${
                                  project.roaddetails?.petroleumCompany || ""
                                }">
                              </div>

                              <div class="col-md-6">
                                <label for="bitumenQuantity" class="form-label">كمية بيتومين 60/70</label>
                                <input type="number" step="any" id="bitumenQuantity" class="form-control" value="${
                                  project.roaddetails?.bitumenQuantity || 0
                                }">
                              </div>

                              <div class="col-md-4">
                                <label for="mc" class="form-label">MC</label>
                                <input type="number" step="any" id="mc" class="form-control" value="${
                                  project.roaddetails?.mc || 0
                                }">
                              </div>

                              <div class="col-md-4">
                                <label for="rc" class="form-label">RC</label>
                                <input type="number" step="any" id="rc" class="form-control" value="${
                                  project.roaddetails?.rc || 0
                                }">
                              </div>

                              <div class="col-md-4">
                                <label for="remainingQuantitiesTons" class="form-label">الكميات المتبقية بالطن</label>
                                <input type="number" step="any" id="remainingQuantitiesTons" class="form-control" value="${
                                  project.roaddetails
                                    ?.remainingQuantitiesTons || 0
                                }">
                              </div>

                              <div class="col-md-12">
                                <label for="notes" class="form-label">ملاحظات</label>
                                <textarea id="notes"  class="form-control" rows="3" style="resize: vertical;">${
                                  project.roaddetails?.notes || ""
                                }</textarea>
                              </div>
                    
                            `
                        : ""
                    }

                  <h5 class="form-section-title"> بيانات المشروعات</h5>
        
                  <div class="col-md-6">
                    <label for="extensionDate" class="form-label">مد مدة</label>
                  <input type="date" id="extensionDate" class="form-control" value="">
                  </div>

                  <div class="col-md-6">
                    <label for="suspensionDate" class="form-label">تاريخ محضر التوقف</label>
                    <input type="date" id="suspensionDate" class="form-control" value="${
                      project.suspensionDate
                        ? new Date(project.suspensionDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }">
                  </div>

                  <div class="col-md-6">
                    <label for="resumptionDate" class="form-label">تاريخ الاستئناف</label>
                    <input type="date" id="resumptionDate" class="form-control" value="${
                      project.resumptionDate
                        ? new Date(project.resumptionDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }">   
                  </div> 

                  <div class="row g-2 my-3">
                    <div class="col-6">
                      <button type="button" class="btn custom-btn w-100 px-3" data-bs-toggle="modal" data-bs-target="#addContractModal">
                        + تعديل عقد
                      </button>
                    </div>
                    <div class="col-6">
                      <button type="button" class="btn custom-btn w-100 px-3" data-bs-toggle="modal" data-bs-target="#addDecisionModal">
                        + إضافة بند
                      </button>
                    </div>
                  </div>
                        `
                  : ""
              }


          <!-- البيانات التعاقديه -->     
          ${
            userRole === "admin" || userRole === "contractual"
              ? `          <h5 class="form-section-title">البيانات التعاقدية</h5>
          <div class="row">
          <div class="col-md-6">
            <label for="publishDate" class="form-label">تاريخ النشر</label>
            <input type="date" id="publishDate" class="form-control" value="${
              project.publishDate
                ? new Date(project.publishDate).toISOString().split("T")[0]
                : ""
            }">
          </div>

          <div class="col-md-6">
            <label for="technicalDecisionDate" class="form-label">تاريخ البت الفني</label>
            <input type="date" id="technicalDecisionDate" class="form-control" value="${
              project.technicalDecisionDate
                ? new Date(project.technicalDecisionDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }">
          </div>

          <div class="col-md-6">
            <label for="financialDecisionDate" class="form-label">تاريخ البت المالي</label>
            <input type="date" id="financialDecisionDate" class="form-control" value="${
              project.financialDecisionDate
                ? new Date(project.financialDecisionDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }">
          </div>

          <div class="col-md-6">
            <label for="assignmentOrderDate" class="form-label">تاريخ أمر الإسناد</label>
            <input type="date" id="assignmentOrderDate" class="form-control" value="${
              project.assignmentOrderDate
                ? new Date(project.assignmentOrderDate)
                    .toISOString()
                    .split("T")[0]
                : ""
            }">
          </div>

          <div class="col-md-6">
            <label for="siteHandoverDate" class="form-label">تاريخ استلام الموقع</label>
            <input type="date" id="siteHandoverDate" class="form-control" value="${
              project.siteHandoverDate
                ? new Date(project.siteHandoverDate).toISOString().split("T")[0]
                : ""
            }">
          </div>
        </div>  
          <div class="col-md-12">
            <label for="contractualDocuments" class="form-label">رفع ملف PDF</label>
            <input type="file" id="contractualDocuments" name="contractualDocuments" class="form-control" multiple accept="application/pdf">
          </div>`
              : ""
          }
        

       


         
          <div class="col-12 mt-4 text-center">
            <button type="submit" class="btn btn-primary px-4" id="save-changes-button">حفظ التعديلات</button>
          </div>
        </div>
      </form>


       <div class="modal fade" id="addContractModal" tabindex="-1" aria-labelledby="addContractModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="contractModalLabel">إضافة تعديل عقد</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
		
        <div class="md-3">
            <label for="contractDate" class="form-label"> تاريخ تعديل العقد</label>
           <input type="date" id="contractDate" name="contractDate" class="form-control" >
          </div>


        <div class="mb-3">
          <label for="contractPrice" class="form-label">القيمه</label>
          <input type="number" class="form-control" id="contractPrice" name="contractPrice" step="any" min="0">
        </div>


      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
        <button type="button" class="btn btn-success" id="saveContractBtn">اضافه تعديل عقد</button>
      </div>
    </div>
  </div>
</div>


    <div class="modal fade" id="addDecisionModal" tabindex="-1" aria-labelledby="addDecisionModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="addDecisionModalLabel">إضافة بند</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body">

            <div class="mb-3">
              <label for="decisionName" class="form-label">اسم البند</label>
                <textarea 
                  class="form-control" 
                  id="decisionName" 
                  name="decisionName"           
                  rows="1"
                  style="min-height: 200px; resize: vertical; overflow-y: auto;"
                ></textarea>
            </div>

            <div class="mb-3">
              <label for="decisionType" class="form-label">نوع البند</label>
                <select class="form-select" id="decisionType" name="decisionType">
                <option value="تعاقدي">تعاقدي</option>
                <option value="مستجد">مستجد</option>
                <option value="متجاوز">متجاوز</option>
              </select>
              
            </div>

            <div class="mb-3">
              <label for="decisionUnit" class="form-label">الوحده</label>
              <input type="text" class="form-control" id="decisionUnit"  name="decisionUnit">
            </div>

            <div class="mb-3">
              <label for="decisionQuantity" class="form-label">الكمية</label>
              <input type="number" class="form-control" id="decisionQuantity" name="decisionQuantity" step="any" min="0">
            </div>

            <div class="mb-3">
              <label for="decisionPrice" class="form-label">الفئه</label>
              <input type="number" class="form-control" id="decisionPrice" name="decisionPrice" step="any" min="0">
            </div>


          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            <button type="button" class="btn btn-success" id="saveDecisionBtn">حفظ</button>
          </div>
        </div>
      </div>
    </div>


        <div class="modal fade" id="addExtractModal" tabindex="-1" aria-labelledby="addExtractModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h5 class="modal-title" id="addExtractModalLabel">إضافة مستخلص</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">

              <div class="mb-3">
                <label for="extractDate" class="form-label">تاريخ المستخلص</label>
                <input type="date" id="extractDate" name="extractDate" class="form-control">
              </div>

              <div class="mb-3">
                <label for="extractValue" class="form-label">قيمة المستخلص</label>
                <input type="number" class="form-control" id="extractValue" name="extractValue" step="any" min="0">
              </div>

              <div class="mb-3">
                <label for="extractPDFs" class="form-label">ملفات PDF</label>
                <input type="file" class="form-control" id="extractPDFs" name="extractPDFs" accept=".pdf" multiple>
                <div class="form-text">يمكنك رفع ملف أو أكثر بصيغة PDF.</div>
              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
              <button type="button" class="btn btn-success" id="saveExtractBtn">إضافة مستخلص</button>
            </div>

          </div>
        </div>
      </div>





    `;

  const saveDecisionBtn = document.getElementById("saveDecisionBtn");
  const saveContractBtn = document.getElementById("saveContractBtn");
  const saveExtractBtn = document.getElementById("saveExtractBtn");

  if (saveExtractBtn) {
    saveExtractBtn.addEventListener("click", () => {
      const activityCode = getProjectCodeFromUrl();
      addExtract(API_URL, activityCode, showToast);
    });
  }

  if (saveDecisionBtn) {
    saveDecisionBtn.addEventListener("click", () => {
      const activityCode = getProjectCodeFromUrl();
      addDecision(API_URL, activityCode, showToast);
    });
  }

  if (saveContractBtn) {
    saveContractBtn.addEventListener("click", () => {
      const activityCode = getProjectCodeFromUrl();
      addContract(API_URL, activityCode, showToast);
    });
  }
  const statusElement = document.getElementById("status");
  if (statusElement) {
    statusElement.value = project.status || "قيد التنفيذ";
  }

  const allInputs = formContainer.querySelectorAll("input, select, textarea");
  allInputs.forEach((input) => {
    if (
      input.id &&
      !allowedFields.includes(input.id) &&
      input.type !== "file"
    ) {
      input.disabled = true;
    }
  });

  if (userRole === "financial") {
    const mediaInputWrapper = document
      .getElementById("mediaFiles")
      ?.closest(".col-md-12");
    if (mediaInputWrapper) {
      mediaInputWrapper.remove();
    }
  }

  attachSubmitListener(project.activityCode);
  return project.activityCode;
}
