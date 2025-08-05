import { addDecision } from "./decision.js";

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
  if (project.progress === 100) {
    project.status = "مكتمل";
  }
  formContainer.innerHTML = `
      <form id="editProjectForm" enctype="multipart/form-data" method="POST">
        <div class="row g-3">
          <h5 class="form-section-title">البيانات الأساسية</h5>
          <div class="col-md-6"><label for="activityName" class="form-label">اسم المشروع</label><input type="text" id="activityName" class="form-control" value="${
            project.activityName || ""
          }"></div>
          <div class="col-md-6"><label for="executingCompany" class="form-label">الشركة المنفذة</label><input type="text" id="executingCompany" class="form-control" value="${
            project.executingCompany || ""
          }"></div>
          <div class="col-md-6"><label for="consultant" class="form-label">الاستشاري</label><input type="text" id="consultant" class="form-control" value="${
            project.consultant || ""
          }"></div>
          <div class="col-md-6"><label for="status" class="form-label">حالة المشروع</label><select id="status" class="form-select"><option value="قيد التنفيذ">قيد التنفيذ</option><option value="مكتمل">مكتمل</option><option value="متأخر">متأخر</option><option value="مسحوب">مسحوب</option> <option value="متوقف">متوقف</option></select></div>
          <div class="col-md-12"><label for="activityDescription" class="form-label">وصف المشروع</label><textarea id="activityDescription" class="form-control" rows="4" style="resize: vertical;">${
            project.activityDescription || ""
          }</textarea></div>

          <div class="col-md-12">
            <label for="mediaFiles" class="form-label">رفع صور أو ملفات PDF للمشروع</label>
            <input type="file" id="mediaFiles" name="mediaFiles" class="form-control" multiple accept="image/*,application/pdf">
          </div>

          <div class="col-md-12">
            <label for="projectLocationLink" class="form-label">رابط الموقع الجغرافي (Google Maps)</label>
            <input type="url" id="projectLocationLink" class="form-control" value="${
              project.projectLocationLink || ""
            }" placeholder="https://maps.google.com/?q=30.1,31.2">
          </div>
          <h5 class="form-section-title">البيانات المالية والزمنية</h5>
          <div class="col-md-4"><label for="estimatedValue" class="form-label">القيمة التقديرية</label><input type="number" id="estimatedValue" class="form-control" value="${
            project.estimatedValue || 0
          }"></div>
          <div class="col-md-4"><label for="contractualValue" class="form-label">القيمة التعاقدية</label><input type="number" id="contractualValue" class="form-control" value="${
            project.contractualValue || 0
          }"></div>
          <div class="col-md-4"><label for="disbursedAmount" class="form-label">المنصرف</label><input type="number" id="disbursedAmount" class="form-control" value="${
            project.disbursedAmount || 0
          }"></div>
          <div class="col-md-4"><label for="progress" class="form-label">نسبة الإنجاز</label><input type="number" id="progress" class="form-control" value="${
            project.progress || 0
          }"></div>
          <div class="col-md-4"><label for="completionDate" class="form-label">تاريخ النهو</label><input type="date" id="completionDate" class="form-control" value="${
            project.completionDate
              ? new Date(project.completionDate).toISOString().split("T")[0]
              : ""
          }"></div>
          <div class="col-md-4"><label for="receptionDate" class="form-label">تاريخ الاستلام</label><input type="date" id="receptionDate" class="form-control" value="${
            project.receptionDate
              ? new Date(project.receptionDate).toISOString().split("T")[0]
              : ""
          }"></div>

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
                        project.roaddetails?.remainingQuantitiesTons || 0
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
                ? new Date(project.suspensionDate).toISOString().split("T")[0]
                : ""
            }">
          </div>

          <div class="col-md-6">
            <label for="resumptionDate" class="form-label">تاريخ الاستئناف</label>
            <input type="date" id="resumptionDate" class="form-control" value="${
              project.resumptionDate
                ? new Date(project.resumptionDate).toISOString().split("T")[0]
                : ""
            }"> 
          </div> 

        <div class="text-center my-3">
          <button type="button" class="btn btn-sm btn-success px-3" data-bs-toggle="modal" data-bs-target="#addDecisionModal">
            + إضافة بند
          </button>
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

          <h5 class="form-section-title">البيانات التعاقدية</h5>
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
          </div>

       


         
          <div class="col-12 mt-4 text-center">
            <button type="submit" class="btn btn-primary px-4" id="save-changes-button">حفظ التعديلات</button>
          </div>
        </div>
      </form>
    `;

  const saveDecisionBtn = document.getElementById("saveDecisionBtn");

  if (saveDecisionBtn) {
    saveDecisionBtn.addEventListener("click", () => {
      const activityCode = getProjectCodeFromUrl();
      addDecision(API_URL, activityCode, showToast);
    });
  }
  document.getElementById("status").value = project.status || "قيد التنفيذ";

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
